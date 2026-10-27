import React, { useMemo, useState } from "react";
import { FaCircleInfo, FaPlus, FaTrash } from "react-icons/fa6";
import "./study-matcher.css";

const OFFICIAL_LANGUAGES = ["Afrikaans", "English", "isiNdebele", "isiXhosa", "isiZulu", "Sepedi", "Sesotho", "Setswana", "siSwati", "Tshivenda", "Xitsonga"];
const OTHER_LANGUAGES = [
  ["Arabic", "Second Additional Language"], ["French", "Second Additional Language"], ["German", "Home Language"], ["German", "Second Additional Language"],
  ["Gujarati", "Home Language"], ["Gujarati", "First Additional Language"], ["Gujarati", "Second Additional Language"], ["Hebrew", "Second Additional Language"],
  ["Hindi", "Home Language"], ["Hindi", "First Additional Language"], ["Hindi", "Second Additional Language"], ["Italian", "Second Additional Language"],
  ["Latin", "Second Additional Language"], ["Portuguese", "Home Language"], ["Portuguese", "First Additional Language"], ["Portuguese", "Second Additional Language"],
  ["Spanish", "Second Additional Language"], ["Tamil", "Home Language"], ["Tamil", "First Additional Language"], ["Tamil", "Second Additional Language"],
  ["Telugu (Telegu)", "Home Language"], ["Telugu (Telegu)", "First Additional Language"], ["Telugu (Telegu)", "Second Additional Language"], ["Urdu", "Home Language"],
  ["Urdu", "First Additional Language"], ["Urdu", "Second Additional Language"],
].map(([language, level]) => `${language} ${level}`);
const OPTIONAL_SUBJECTS = [
  "Accounting", "Agricultural Management Practices", "Agricultural Sciences", "Agricultural Technology", "Business Studies", "Civil Technology",
  "Computer Applications Technology", "Consumer Studies", "Dance Studies", "Design", "Dramatic Arts", "Economics", "Electrical Technology",
  "Engineering Graphics and Design", "Geography", "History", "Hospitality Studies", "Information Technology", "Life Sciences", "Marine Sciences",
  "Mechanical Technology", "Mathematics", "Mathematical Literacy", "Music", "Physical Sciences", "Religion Studies", "Technical Mathematics",
  "Technical Sciences", "Tourism", "Visual Arts", "Life Orientation",
];
const SUBJECTS = [
  ...OFFICIAL_LANGUAGES.flatMap((language) => [`${language} Home Language`, `${language} First Additional Language`, `${language} Second Additional Language`]),
  "South African Sign Language Home Language",
  ...OTHER_LANGUAGES,
  ...OPTIONAL_SUBJECTS,
];
const LEVELS = ["Level 1", "Level 2", "Level 3", "Level 4", "Level 5", "Level 6", "Level 7"];
const INITIAL_ROWS = Array.from({ length: 6 }, (_, index) => ({ id: index + 1, subject: "", mark: "", level: "" }));
const RESULTS_KEY = "excellencehub-study-results";

function browserKey() {
  try {
    const user = JSON.parse(sessionStorage.getItem("excellencehub-api-session") || "null")?.user;
    return `${RESULTS_KEY}:${user?.email || user?.id || "learner"}`;
  } catch { return `${RESULTS_KEY}:learner`; }
}

function readSaved() {
  try { return JSON.parse(localStorage.getItem(browserKey()) || "null"); } catch { return null; }
}

function SubjectPicker({ rowId, value, onChange, disabledOptions }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const matches = useMemo(() => SUBJECTS.filter((subject) => subject.toLowerCase().includes(query.trim().toLowerCase())), [query]);
  const choose = (subject) => {
    onChange(subject);
    setQuery("");
    setOpen(false);
  };
  return <div className="subject-picker">
    <input className="subject-picker-input" role="combobox" aria-label="Search Grade 12 subjects" aria-expanded={open} aria-autocomplete="list" aria-controls={`nsc-subject-options-${rowId}`} autoComplete="off" placeholder="Search or choose a subject" value={open ? query : value} onFocus={() => { setQuery(""); setOpen(true); }} onChange={(event) => { setQuery(event.target.value); setOpen(true); }} onBlur={() => { setOpen(false); setQuery(""); }} onKeyDown={(event) => {
      if (event.key === "Escape") { setOpen(false); setQuery(""); }
      if (event.key === "Enter") { const firstAvailable = matches.find((subject) => !disabledOptions.includes(subject)); if (firstAvailable) { event.preventDefault(); choose(firstAvailable); } }
    }} />
    {open && <div className="subject-picker-options" id={`nsc-subject-options-${rowId}`} role="listbox" aria-label="Grade 12 subjects">{matches.length ? matches.map((subject) => <button key={subject} type="button" role="option" aria-selected={value === subject} disabled={disabledOptions.includes(subject)} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(subject)}>{subject}</button>) : <span className="subject-picker-empty">No matching subjects</span>}</div>}
  </div>;
}

function StudyMatcher() {
  const saved = readSaved();
  const [term, setTerm] = useState(saved?.term || "Grade 11 Term 4");
  const [rows, setRows] = useState(saved?.rows || INITIAL_ROWS);
  const [savedMessage, setSavedMessage] = useState("");
  const changeRow = (id, field, value) => setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  const addRow = () => setRows((current) => [...current, { id: Date.now(), subject: "", mark: "", level: "" }]);
  const removeRow = (id) => setRows((current) => current.length <= 6 ? current : current.filter((row) => row.id !== id));
  const saveResults = () => {
    try {
      localStorage.setItem(browserKey(), JSON.stringify({ term, rows }));
      setSavedMessage("Your marks are saved on this device for your learner account.");
    } catch { setSavedMessage("These marks could not be saved in this browser."); }
  };

  return <section className="study-matcher" aria-labelledby="study-matcher-title">
    <div className="study-matcher-head"><div><div className="eyebrow">PLAN YOUR STUDY OPTIONS</div><h2 id="study-matcher-title">Enter your school subjects</h2><p>Add your latest subject marks to keep your study results together.</p></div><span className="matcher-badge">Grade 11 &amp; Grade 12</span></div>
    <div className="matcher-form">
      <label className="matcher-term">Results period<select value={term} onChange={(event) => { setTerm(event.target.value); setSavedMessage(""); }}><option>Grade 11 Term 4</option><option>Grade 12 mid-year</option></select></label>
      <p className="matcher-help"><FaCircleInfo /> Search for and select each Grade 12 subject, then enter its percentage and NSC achievement level (1–7) if available. Your marks are saved in this browser only.</p>
      <div className="matcher-columns"><span>Subject</span><span>Mark (%)</span><span>Level</span><span className="sr-only">Remove subject</span></div>
      <div className="matcher-rows">{rows.map((row) => <div className="matcher-row" key={row.id}><SubjectPicker rowId={row.id} value={row.subject} onChange={(subject) => changeRow(row.id, "subject", subject)} disabledOptions={rows.filter((other) => other.id !== row.id).map((other) => other.subject)} /><input type="number" min="0" max="100" step="1" value={row.mark} onChange={(event) => changeRow(row.id, "mark", event.target.value)} aria-label="Mark percentage" placeholder="e.g. 72" /><select value={row.level || ""} onChange={(event) => changeRow(row.id, "level", event.target.value)} aria-label="Achievement level"><option value="">Select level</option>{LEVELS.map((level) => <option key={level}>{level}</option>)}</select><button type="button" className="matcher-remove" onClick={() => removeRow(row.id)} disabled={rows.length <= 6} aria-label="Remove subject"><FaTrash /></button></div>)}</div>
      <div className="matcher-actions"><button type="button" className="matcher-add" onClick={addRow}><FaPlus /> Add another subject</button><button type="button" className="matcher-save" onClick={saveResults}>Save my marks</button></div>
      {savedMessage && <p className="matcher-saved" role="status">{savedMessage}</p>}<p className="matcher-source">Subject names follow the DBE NSC list; a subject must also be offered by your school. <a href="https://www.education.gov.za/Informationfor/Learners/SubjectChoiceandCareerPathing.aspx" target="_blank" rel="noreferrer">View DBE subject guidance</a>.</p>
    </div>
  </section>;
}

export default StudyMatcher;
