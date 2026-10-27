import React, { useEffect, useMemo, useState } from "react";
import { FaArrowRight, FaBookmark, FaRegBookmark, FaMagnifyingGlass, FaGraduationCap, FaBriefcase, FaCalendarDays, FaFileLines, FaLocationDot, FaArrowUpRightFromSquare, FaCircleInfo } from "react-icons/fa6";
import "./dashboard.css";
import { useOpportunities } from "../OpportunityContext";
import { WHO_CAN_APPLY_OPTIONS } from "../api";
import { Link } from "react-router-dom";



const filters = ["All", "Bursary", "Job", "Learnership", "Internship"];

function Dashboard({ currentUser }) {
  const displayName = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(" ") || currentUser?.email || "Learner";
  const avatarInitial = displayName.charAt(0).toUpperCase();
  const { opportunities: postedOpportunities, refreshOpportunities, isLoading, error } = useOpportunities();
  const [filter, setFilter] = useState("All");
  const [whoCanApplyFilter, setWhoCanApplyFilter] = useState("");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState([]);
  const [activeTab, setActiveTab] = useState("For you");

  useEffect(() => {
    refreshOpportunities("learner", whoCanApplyFilter).catch(() => {});
  }, [refreshOpportunities, whoCanApplyFilter]);

  const visible = useMemo(() => {
    const available = postedOpportunities;
    return available.filter((item) => {
      const matchesFilter = filter === "All" || item.type === filter;
      const matchesEligibility = !whoCanApplyFilter || item.whoCanApply === whoCanApplyFilter || item.whoCanApply === "All applicants" || (whoCanApplyFilter === "Recent graduates" && item.whoCanApply === "Final-year students or recent graduates");
      const matchesSearch = `${item.title} ${item.organisation} ${item.type} ${item.location} ${item.whoCanApply || "All applicants"}`.toLowerCase().includes(query.toLowerCase());
      const matchesSaved = activeTab !== "Saved" || saved.includes(item.id);
      return matchesFilter && matchesEligibility && matchesSearch && matchesSaved;
    });
  }, [filter, whoCanApplyFilter, query, saved, activeTab, postedOpportunities]);
  const toggleSaved = (id) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <main className="learner-dashboard">
      <div className="dashboard-topbar">
        <a href="/" className="dashboard-brand">Excellence<span>Hub</span></a>
        <nav className="dashboard-nav" aria-label="Dashboard sections">
          <a className="selected" href="#opportunities">Explore</a><Link to="/Study">Study (Grade 12)</Link>
        </nav>
        <div className="profile-chip" aria-label={`Signed in as ${displayName}`}><span className="profile-avatar">{avatarInitial}</span><span className="profile-name">{displayName}</span><span className="profile-chevron" aria-hidden="true">⌄</span></div>
      </div>
      <div className="learner-session-label">Signed in as <strong>{displayName}</strong></div>

      <div className="dashboard-main">
        <section className="welcome-panel">
          <div className="welcome-copy">
            <div className="eyebrow"><span className="live-dot" /> YOUR NEXT STEP STARTS HERE</div>
            <h1>Make your next move, <em>your own.</em></h1>
            <p>Find funding, build experience, and plan what comes after matric — all in one place.</p>
            <a href="#opportunities" className="welcome-action">Explore opportunities <FaArrowRight /></a>
          </div>
          <div className="welcome-art" aria-hidden="true"><div className="art-orbit orbit-one"/><div className="art-orbit orbit-two"/><div className="art-sun">✳</div><div className="art-card card-one"><FaGraduationCap/><span>Study</span></div><div className="art-card card-two"><FaBriefcase/><span>Work</span></div><div className="art-card card-three"><FaCalendarDays/><span>Plan</span></div></div>
          <div className="welcome-index">01 <span>—</span> YOUR JOURNEY</div>
        </section>

        <section className="pathways-section" aria-labelledby="pathways-title">
          <div className="section-heading"><div><div className="eyebrow">A GOOD PLACE TO BEGIN</div><h2 id="pathways-title">What are you working towards?</h2></div><span className="section-note">Choose a path to get started</span></div>
          <div className="pathway-grid">
            <a className="pathway-card pathway-funding" href="#opportunities" onClick={() => setFilter("Bursary")}><span className="pathway-icon"><FaGraduationCap /></span><span className="pathway-content"><strong>Find funding</strong><small>Bursaries, scholarships &amp; study support</small></span><FaArrowRight className="pathway-arrow" /></a>
            <a className="pathway-card pathway-work" href="#opportunities" onClick={() => setFilter("Job")}><span className="pathway-icon"><FaBriefcase /></span><span className="pathway-content"><strong>Start your career</strong><small>Jobs, internships &amp; learnerships</small></span><FaArrowRight className="pathway-arrow" /></a>
            <Link className="pathway-card pathway-study" to="/Study"><span className="pathway-icon"><FaFileLines /></span><span className="pathway-content"><strong>Plan after matric</strong><small>Universities, courses &amp; prospectuses</small></span><FaArrowRight className="pathway-arrow" /></Link>
          </div>
        </section>

        <section className="content-grid" id="opportunities">
          <div className="opportunities-panel">
            <div className="section-heading opportunity-heading"><div><div className="eyebrow">TAKE A LOOK AROUND</div><h2>Opportunities for you</h2></div><span className="sample-label"><FaCircleInfo /> Live listings</span></div>
            <div className="opportunity-toolbar">
              <div className="opportunity-tabs" role="tablist" aria-label="Opportunity lists">{["For you", "Saved"].map((tab) => <button key={tab} className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>{tab}{tab === "Saved" && saved.length > 0 ? ` (${saved.length})` : ""}</button>)}</div>
              <label className="search-field"><FaMagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search opportunities" aria-label="Search opportunities" /></label>
            </div>
            <div className="filter-row" aria-label="Filter opportunities">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} className={`filter-pill ${filter === item ? "active" : ""}`}>{item}</button>)}<label className="eligibility-filter"><span>Filter by</span><select value={whoCanApplyFilter} onChange={(event) => setWhoCanApplyFilter(event.target.value)} aria-label="Filter by eligibility requirements"><option value="">All eligibility categories</option>{WHO_CAN_APPLY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select></label></div>
            <div className="opportunity-list">{error ? <div className="empty-state"><FaCircleInfo /><h3>Opportunities could not load</h3><p>{error}</p></div> : isLoading ? <div className="empty-state"><p>Loading opportunities…</p></div> : visible.length ? visible.map((item) => <article className="opportunity-card" key={item.id}>
              <div className={`opportunity-mark mark-${item.type.toLowerCase()}`}>{item.type === "Bursary" ? <FaGraduationCap /> : item.type === "Job" ? <FaBriefcase /> : <FaFileLines />}</div>
              <div className="opportunity-info"><div className="opportunity-meta"><span className={`type-label type-${item.type.toLowerCase()}`}>{item.type}</span><span>{item.organisation}</span></div><h3>{item.title}</h3><p>{item.detail}</p><div className="opportunity-details"><span><FaCalendarDays /> Closes {item.deadline}</span><span><FaLocationDot /> {item.location}</span></div><div className="tag-row"><span>{item.whoCanApply || "All applicants"}</span></div></div>
              <div className="opportunity-actions"><button className="save-button" onClick={() => toggleSaved(item.id)} aria-label={saved.includes(item.id) ? `Remove ${item.title} from saved` : `Save ${item.title}`} title={saved.includes(item.id) ? "Remove saved item" : "Save for later"}>{saved.includes(item.id) ? <FaBookmark /> : <FaRegBookmark />}</button><a className="details-button" href={item.officialUrl} target="_blank" rel="noreferrer">Apply <FaArrowUpRightFromSquare /></a></div>
            </article>) : <div className="empty-state"><FaMagnifyingGlass /><h3>No opportunities found</h3><p>Try another search or choose a different category.</p></div>}</div>
            <p className="demo-disclaimer">Verify eligibility, closing dates and application links with the official provider before applying.</p>
          </div>


        </section>

        <footer className="dashboard-footer"><span>ExcellenceHub · Find your next step</span><span>Always verify details with the official institution or opportunity provider.</span></footer>
      </div>
    </main>
  );
}

export default Dashboard;









