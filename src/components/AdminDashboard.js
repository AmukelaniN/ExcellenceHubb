import React, { useEffect, useMemo, useState } from "react";
import { FaBriefcase, FaGraduationCap, FaUsers, FaClipboardCheck, FaMagnifyingGlass, FaArrowRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useOpportunities } from "../OpportunityContext";
import { apiRequest } from "../api";
import "./admin-dashboard.css";

function AdminDashboard({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loadError, setLoadError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const { opportunities } = useOpportunities();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError("");
    apiRequest("/api/admin/users")
      .then((rows) => {
        if (cancelled) return;
        setUsers(rows.map((user) => ({
          ...user,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          role: user.accountType === "manager" ? "administrator" : user.accountType === "employer" ? "employer" : "learner",
        })));
      })
      .catch((error) => {
        if (!cancelled) setLoadError(error.message || "Could not load users from the database.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => { cancelled = true; };
  }, [reload]);

  const learners = users.filter((user) => user.role === "learner").length;
  const employers = users.filter((user) => user.role === "employer").length;
  const pending = opportunities.filter((item) => item.status === "Pending review").length;
  const visibleUsers = useMemo(() => users.filter((user) => `${user.name} ${user.email} ${user.phoneNumber || ""} ${user.role}`.toLowerCase().includes(query.toLowerCase())), [users, query]);

  return <main className="admin-dashboard"><div className="admin-wrap">
    <header className="admin-welcome"><div><div className="admin-eyebrow">EXCELLENCEHUB ADMINISTRATION</div><h1>Administrator dashboard</h1><p>Manage registered learners, employers and opportunity activity.</p></div><div className="admin-user-pill"><span className="admin-avatar">{(currentUser?.firstName || "A").slice(0, 1).toUpperCase()}</span><span><strong>Administrator</strong><small>{currentUser?.email || "Manager account"}</small></span></div></header>
    <div className="admin-live-notice"><span className="admin-live-dot" /> User directory connected to the database</div>
    <section className="admin-stats" aria-label="Platform overview">
      <article className="admin-stat"><span className="admin-stat-icon stat-all"><FaUsers /></span><div><small>Registered users</small><strong>{isLoading ? "…" : users.length}</strong></div></article>
      <article className="admin-stat"><span className="admin-stat-icon stat-learners"><FaGraduationCap /></span><div><small>Learners</small><strong>{isLoading ? "…" : learners}</strong></div></article>
      <article className="admin-stat"><span className="admin-stat-icon stat-employers"><FaBriefcase /></span><div><small>Employers</small><strong>{isLoading ? "…" : employers}</strong></div></article>
      <Link to="/Manager" className="admin-stat admin-stat-review" aria-label={`Posts to review: ${pending}. Open review queue`}><span className="admin-stat-icon stat-pending"><FaClipboardCheck /></span><div><small>Posts to review</small><strong>{pending}</strong><span className="admin-review-link">Open review queue <FaArrowRight /></span></div></Link>
    </section>
    <section className="admin-panel">
      <div className="admin-panel-heading"><div><div className="admin-eyebrow admin-eyebrow-dark">ACCOUNT DIRECTORY</div><h2>Registered users</h2><p>All accounts from the database. Passwords are never shown.</p></div><label className="admin-search"><FaMagnifyingGlass /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or phone" aria-label="Search registered users" /></label></div>
      {isLoading ? <div className="admin-state"><span className="admin-loading-spinner" /><strong>Loading database users…</strong></div> : loadError ? <div className="admin-state admin-state-error"><strong>Could not load users</strong><p>{loadError}</p><button type="button" onClick={() => setReload((value) => value + 1)}>Try again</button></div> : visibleUsers.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>User</th><th>Account type</th><th>Phone</th><th>Status</th></tr></thead><tbody>{visibleUsers.map((user) => <tr key={user.id}><td><div className="admin-person"><span className={`person-avatar avatar-${user.role}`}>{(user.name || user.email).slice(0, 1).toUpperCase()}</span><span><strong>{user.name || "Name not provided"}</strong><small>{user.email}</small></span></div></td><td><span className={`role-badge role-${user.role}`}>{user.role === "administrator" ? "Administrator" : user.role === "employer" ? "Employer" : "Learner"}</span></td><td>{user.phoneNumber || "—"}</td><td><span className="account-active"><i /> Database account</span></td></tr>)}</tbody></table></div> : <div className="admin-empty"><span><FaUsers /></span><strong>{query ? "No matching users" : "No registered accounts yet"}</strong><p>{query ? "Try another name, email or phone number." : "Learner and employer accounts will appear here after they register."}</p></div>}
    </section>
    
    <footer className="admin-footer"><span>ExcellenceHub · Admin</span><span>Administrator access is verified by the API.</span></footer>
  </div></main>;
}

export default AdminDashboard;
