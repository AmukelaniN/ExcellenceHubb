import React from "react";
import { FaArrowUpRightFromSquare, FaCalendarDays, FaFileLines, FaGraduationCap } from "react-icons/fa6";
import { Link } from "react-router-dom";
import StudyMatcher from "./StudyMatcher";
import "./dashboard.css";

const universities = [
  { name: "University of Cape Town", short: "UCT", color: "#d4eee7", url: "https://www.uct.ac.za/" },
  { name: "University of the Witwatersrand", short: "Wits", color: "#f9e3c1", url: "https://www.wits.ac.za/" },
  { name: "University of Johannesburg", short: "UJ", color: "#e6dcfa", url: "https://www.uj.ac.za/" },
  { name: "University of Pretoria", short: "UP", color: "#dce8f8", url: "https://www.up.ac.za/" },
];

function StudyPage({ currentUser }) {
  const displayName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || currentUser?.email || "Learner";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  return <main className="learner-dashboard">
    <div className="dashboard-topbar">
      <Link to="/Dashboard" className="dashboard-brand">Excellence<span>Hub</span></Link>
      <nav className="dashboard-nav" aria-label="Dashboard sections">
        <Link to="/Dashboard#opportunities">Explore</Link><Link className="selected" to="/Study">Study (Grade 12)</Link>
      </nav>
      <div className="profile-chip" aria-label={`Signed in as ${displayName}`}><span className="profile-avatar">{avatarInitial}</span><span className="profile-name">{displayName}</span><span className="profile-chevron" aria-hidden="true">⌄</span></div>
    </div>
    <div className="learner-session-label">Signed in as <strong>{displayName}</strong></div>
    <div className="dashboard-main">
      <section className="study-section study-page-section">
        <div className="study-title"><div><div className="eyebrow">FOR GRADE 12 &amp; FUTURE STUDENTS</div><h2>Plan what comes after matric.</h2><p>Enter your Grade 11 Term 4 or Grade 12 mid-year results, keep your subjects together, and use the official university links below to check current requirements.</p></div><a className="text-link" href="https://www.gov.za/about-sa/education" target="_blank" rel="noreferrer">Explore study pathways <FaArrowUpRightFromSquare /></a></div>
        <StudyMatcher />
        <div className="study-tools"><a href="https://uct.ac.za/students/applications/key-dates" target="_blank" rel="noreferrer" className="study-tool"><span className="tool-icon tool-blue"><FaCalendarDays /></span><span><strong>Application dates</strong><small>Check opening dates, closing dates &amp; fees</small></span><FaArrowUpRightFromSquare /></a><a href="https://uct.ac.za/students/prospective-students/undergraduate-prospectus" target="_blank" rel="noreferrer" className="study-tool"><span className="tool-icon tool-orange"><FaFileLines /></span><span><strong>Prospectuses</strong><small>Browse courses, entry requirements &amp; campus life</small></span><FaArrowUpRightFromSquare /></a><a href="https://www.nsfas.org.za/" target="_blank" rel="noreferrer" className="study-tool"><span className="tool-icon tool-green"><FaGraduationCap /></span><span><strong>Funding &amp; NSFAS</strong><small>Understand funding options and requirements</small></span><FaArrowUpRightFromSquare /></a></div>
        <div className="university-header"><h2>Explore universities</h2><span>Visit official sites for current course and application information</span></div>
        <div className="university-grid">{universities.map((university) => <a key={university.short} className="university-card" href={university.url} target="_blank" rel="noreferrer"><span className="university-monogram" style={{ background: university.color }}>{university.short}</span><span>{university.name}</span><FaArrowUpRightFromSquare /></a>)}</div>
      </section>
      <footer className="dashboard-footer"><span>ExcellenceHub · Plan your next step</span><span>Always verify requirements, application dates and fees with the official institution.</span></footer>
    </div>
  </main>;
}

export default StudyPage;
