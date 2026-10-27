import React, { useEffect, useState } from "react";
import { FaArrowUpRightFromSquare, FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useOpportunities } from "../OpportunityContext";
import { WHO_CAN_APPLY_OPTIONS } from "../api";
import "./opportunity-portals.css";

const initialForm = { type: "Bursary", title: "", organisation: "", location: "South Africa", deadline: "", officialUrl: "", whoCanApply: "All applicants", detail: "" };
const formFromOpportunity = (item) => item ? {
  type: item.type || "Bursary",
  title: item.title || "",
  organisation: item.organisation || "",
  location: item.location || "South Africa",
  deadline: String(item.deadline || "").slice(0, 10),
  officialUrl: item.officialUrl || "",
  whoCanApply: item.whoCanApply || "All applicants",
  detail: item.detail || "",
} : initialForm;

export function OpportunityForm({ publishImmediately = false, onComplete, opportunity = null }) {
  const { submitOpportunity, updateOpportunity } = useOpportunities();
  const [form, setForm] = useState(() => formFromOpportunity(opportunity));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => setForm(formFromOpportunity(opportunity)), [opportunity]);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(false);
    setError("");
    setIsSubmitting(true);
    try {
      const details = { ...form, detail: form.detail.trim() };
      if (opportunity) await updateOpportunity(opportunity.id, details);
      else await submitOpportunity(details);
      setForm(initialForm);
      setSubmitted(true);
      onComplete?.();
    } catch (requestError) {
      setError(requestError.message || "Could not save this opportunity.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return <>
    {submitted && <div className="portal-success" role="status"><FaCircleCheck /> {publishImmediately ? "Opportunity published and added to the learner hub." : opportunity ? "Your changes were saved and sent to the manager for review." : "Opportunity submitted. It will appear in the learner hub after manager review."}</div>}
    {error && <div className="portal-form-error" role="alert">{error}</div>}
    <form className="opportunity-form" onSubmit={handleSubmit}>
      <div className="op-form-grid">
        <label>Opportunity title<input name="title" value={form.title} onChange={update} required maxLength="100" placeholder="e.g. Graduate finance internship" /></label>
        <label>Type<select name="type" value={form.type} onChange={update} required><option>Bursary</option><option>Job</option><option>Learnership</option><option>Internship</option></select></label>
        <label>Organisation<input name="organisation" value={form.organisation} onChange={update} required maxLength="100" placeholder="Company or funding provider" /></label>
        <label>Location<input name="location" value={form.location} onChange={update} required maxLength="100" placeholder="City, province or remote" /></label>
        <label>Application deadline<input name="deadline" type="date" value={form.deadline} onChange={update} required /></label>
        <label>Official application link<input name="officialUrl" type="url" value={form.officialUrl} onChange={update} required maxLength="500" placeholder="https://..." /></label>
        <label className="op-form-wide">Who can apply? (eligibility requirements)<select name="whoCanApply" value={form.whoCanApply} onChange={update} required>{WHO_CAN_APPLY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
        <label className="op-form-wide">Description<textarea name="detail" value={form.detail} onChange={update} required rows="4" maxLength="2000" placeholder="Describe the opportunity, requirements, benefits and how to apply." /></label>
      </div>
      <p className="form-safety-note">Use an official application link and check the deadline and eligibility before submitting.</p>
      <button type="submit" className="portal-primary" disabled={isSubmitting}>{isSubmitting ? "Saving…" : opportunity ? "Save changes and resubmit" : publishImmediately ? "Publish opportunity" : "Submit for review"}</button>
    </form>
  </>;
}

function displayDeadline(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function RecruiterDashboard({ currentUser }) {
  const displayName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || currentUser?.email || "Employer";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const { opportunities, isLoading, error, deleteOpportunity } = useOpportunities();
  const [showForm, setShowForm] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const pendingCount = opportunities.filter((item) => item.status === "Pending review").length;
  const startNewOpportunity = () => {
    setEditingOpportunity(null);
    setShowForm(true);
  };
  const startEditing = (item) => {
    setEditingOpportunity(item);
    setShowForm(true);
  };
  const closeForm = () => {
    setEditingOpportunity(null);
    setShowForm(false);
  };
  const deleteEmployerOpportunity = async (item) => {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    setDeleteMessage("");
    setDeleteError("");
    try {
      await deleteOpportunity(item.id);
      setDeleteMessage(`“${item.title}” was deleted.`);
    } catch (requestError) {
      setDeleteError(requestError.message || "Could not delete this opportunity.");
    }
  };
  return <main className="op-portal"><div className="op-portal-wrap">
    <section className="portal-hero recruiter-hero"><div><div className="portal-eyebrow">EMPLOYER WORKSPACE</div><h1>Reach learners ready for their next step.</h1><p>Share jobs, bursaries, internships and learnerships with the ExcellenceHub learner community.</p><div className="employer-session-chip"><span>{avatarInitial}</span><span><small>Signed in as</small><strong>{displayName}</strong></span></div><button className="portal-primary" onClick={() => showForm ? closeForm() : startNewOpportunity()}>{showForm ? "Close form" : "+ Post an opportunity"}</button></div><div className="portal-hero-art" aria-hidden="true"><span>✳</span><i>talent<br/>meets<br/>opportunity</i></div></section>
    <div className="portal-local-note">Employer submissions are saved in the database and sent to a manager for review before publication. Expired opportunities are automatically removed after their closing date.</div>
    <section className="portal-panel"><div className="portal-section-head"><div><div className="portal-eyebrow">CREATE A LISTING</div><h2>{editingOpportunity ? "Edit opportunity" : showForm ? "Opportunity details" : "Share a new opportunity"}</h2></div><span className="portal-count">{pendingCount} pending</span></div>
      {showForm ? <OpportunityForm key={editingOpportunity?.id || "new"} opportunity={editingOpportunity} onComplete={closeForm} /> : <p className="portal-muted">Add clear eligibility details, an accurate closing date and the official application URL. Submitted posts go to the manager review queue.</p>}
    </section>
    <section className="portal-panel"><div className="portal-section-head"><div><div className="portal-eyebrow">YOUR SUBMISSIONS</div><h2>Posting activity</h2></div><span className="portal-count">{opportunities.length} total</span></div>
      {deleteMessage && <div className="portal-success" role="status"><FaCircleCheck /> {deleteMessage}</div>}{deleteError && <div className="portal-form-error" role="alert">{deleteError}</div>}
      {error ? <div className="portal-form-error" role="alert">{error}</div> : isLoading ? <div className="portal-empty"><p>Loading your submissions…</p></div> : opportunities.length ? <div className="portal-post-list">{opportunities.map((item) => <article className="portal-post" key={item.id}><span className="post-type-icon">{item.type.slice(0,1)}</span><div className="portal-post-info"><strong>{item.title}</strong><small>{item.organisation} · {item.type} · Applies to: {item.whoCanApply} · Closes {displayDeadline(item.deadline)}</small></div><span className={`post-status status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>{item.status}</span><button type="button" className="edit-opportunity-button" onClick={() => startEditing(item)}>Edit opportunity</button><button type="button" className="delete-opportunity-button" onClick={() => deleteEmployerOpportunity(item)}>Delete</button></article>)}</div> : <div className="portal-empty"><strong>No posts yet</strong><p>Your submitted opportunities will appear here.</p></div>}
    </section>
    <p className="portal-footnote"><FaArrowUpRightFromSquare /> Only manager-approved listings are shown to learners.</p>
  </div></main>;
}

export function ManagerDashboard() {
  const { opportunities, updateOpportunityStatus, deleteOpportunity, isLoading, error } = useOpportunities();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const pending = opportunities.filter((item) => item.status === "Pending review");
  const published = opportunities.filter((item) => item.status === "Published");
  const changesRequested = opportunities.filter((item) => item.status === "Changes requested");
  const deleteManagerOpportunity = async (item) => {
    if (!window.confirm(`Permanently delete “${item.title}”? This cannot be undone.`)) return;
    setActionMessage("");
    setActionError("");
    try {
      await deleteOpportunity(item.id);
      setActionMessage(`“${item.title}” was permanently deleted.`);
      navigate("/Manager", { replace: true });
    } catch (requestError) {
      setActionError(requestError.message || "Could not delete this opportunity.");
    }
  };
  const reviewAction = async (id, status) => {
    setActionMessage("");
    setActionError("");
    try {
      await updateOpportunityStatus(id, status);
      setActionMessage(status === "Published" ? "Opportunity approved and published. You are still on the manager dashboard." : "Changes requested. The employer can now edit and resubmit this opportunity.");
      navigate("/Manager", { replace: true });
    } catch (requestError) {
      setActionError(requestError.message || "Could not update this opportunity.");
    }
  };
  return <main className="op-portal"><div className="op-portal-wrap">
    <section className="portal-hero manager-hero"><div><div className="portal-eyebrow">PLATFORM MANAGER</div><h1>Keep useful opportunities moving.</h1><p>Review recruiter submissions, publish verified listings, and add opportunities you find for learners.</p><button className="portal-primary" onClick={() => setShowForm((current) => !current)}>{showForm ? "Close form" : "+ Add an opportunity"}</button></div><div className="manager-stat"><strong>{pending.length}</strong><span>awaiting review</span><strong>{published.length}</strong><span>published listings</span></div></section>
    <div className="portal-local-note">Review recruiter submissions and publish trusted opportunities to the learner hub. Approving a post keeps you on this manager dashboard; expired opportunities are automatically removed after their closing date.</div>
    {actionMessage && <div className="portal-success" role="status">{actionMessage}</div>}
    {actionError && <div className="portal-form-error" role="alert">{actionError}</div>}
    {showForm && <section className="portal-panel"><div className="portal-section-head"><div><div className="portal-eyebrow">MANAGER LISTING</div><h2>Add a verified opportunity</h2></div></div><OpportunityForm publishImmediately /></section>}
    <section className="portal-panel"><div className="portal-section-head"><div><div className="portal-eyebrow">RECRUITER SUBMISSIONS</div><h2>Review queue</h2></div><span className="portal-count">{pending.length} to review</span></div>
      {error ? <div className="portal-form-error" role="alert">{error}</div> : isLoading ? <div className="portal-empty"><p>Loading opportunities…</p></div> : pending.length ? <div className="portal-review-list">{pending.map((item) => <article className="review-card" key={item.id}><div className="review-card-head"><div><span className="review-type">{item.type}</span><h3>{item.title}</h3><p>{item.organisation} · {item.location} · Closes {displayDeadline(item.deadline)}</p></div><a href={item.officialUrl} target="_blank" rel="noreferrer">Check source <FaArrowUpRightFromSquare /></a></div><p className="review-description">{item.detail}</p><p className="review-eligibility"><strong>Who can apply:</strong> {item.whoCanApply}</p><div className="review-actions"><button type="button" className="review-approve" onClick={() => reviewAction(item.id, "Published")}>Approve &amp; publish</button><button type="button" className="review-revise" onClick={() => reviewAction(item.id, "Changes requested")}>Request changes</button><button type="button" className="delete-opportunity-button" onClick={() => deleteManagerOpportunity(item)}>Delete</button></div></article>)}</div> : <div className="portal-empty"><strong>All caught up</strong><p>Recruiter submissions will appear here for review.</p></div>}
    </section>
    <section className="portal-panel"><div className="portal-section-head"><div><div className="portal-eyebrow">EMPLOYER FOLLOW-UP</div><h2>Changes requested</h2></div><span className="portal-count">{changesRequested.length} waiting</span></div>{changesRequested.length ? <div className="portal-post-list">{changesRequested.map((item) => <article className="portal-post" key={item.id}><span className="post-type-icon">{item.type.slice(0,1)}</span><div className="portal-post-info"><strong>{item.title}</strong><small>{item.organisation} · {item.type} · Closes {displayDeadline(item.deadline)}</small></div><span className="post-status status-changes-requested">Changes requested</span><button type="button" className="delete-opportunity-button" onClick={() => deleteManagerOpportunity(item)}>Delete</button></article>)}</div> : <div className="portal-empty"><strong>No posts awaiting employer changes</strong><p>Listings sent back to employers will appear here.</p></div>}</section>
    <section className="portal-panel"><div className="portal-section-head"><div><div className="portal-eyebrow">LIVE IN THE LEARNER HUB</div><h2>Published opportunities</h2></div><span className="portal-count">{published.length} live</span></div>{published.length ? <div className="portal-post-list">{published.map((item) => <article className="portal-post" key={item.id}><span className="post-type-icon">{item.type.slice(0,1)}</span><div className="portal-post-info"><strong>{item.title}</strong><small>{item.organisation} · {item.type} · {item.whoCanApply} · Closes {displayDeadline(item.deadline)}</small></div><button type="button" className="unpublish-button" onClick={() => reviewAction(item.id, "Changes requested")}>Unpublish</button><button type="button" className="delete-opportunity-button" onClick={() => deleteManagerOpportunity(item)}>Delete</button></article>)}</div> : <div className="portal-empty"><strong>No approved posts yet</strong><p>Approve a recruiter submission or add a verified listing above.</p></div>}</section>
    <p className="portal-footnote"><FaArrowUpRightFromSquare /> Confirm provider, eligibility, closing date and application link before approval. Approval publishes the listing to the learner hub.</p>
  </div></main>;
}
