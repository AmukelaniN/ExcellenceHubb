import React from 'react';
import { Link } from "react-router-dom";
import { FaGraduationCap, FaBriefcase, FaCalendarDays, FaFileLines, FaArrowRight, FaArrowUpRightFromSquare, FaMagnifyingGlass } from "react-icons/fa6";
import './home.css';

const pathways = [
  { icon: <FaGraduationCap />, number: "01", title: "Find funding", text: "Explore bursaries and scholarships that can help make your studies possible.", label: "Browse bursaries" },
  { icon: <FaBriefcase />, number: "02", title: "Build experience", text: "Discover entry-level jobs, internships and learnerships to grow your skills.", label: "Explore opportunities" },
  { icon: <FaFileLines />, number: "03", title: "Plan after matric", text: "Compare universities, courses, application dates and prospectuses.", label: "Plan your studies" },
];

function Home({ onOpenSignUp, onOpenLearnerHub, onOpenEmployer }) {
  return (
    <main className="home-page">
      <div className="home-wrap">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <div className="home-eyebrow"><span className="eyebrow-mark">✳</span> YOUR NEXT STEP STARTS HERE</div>
            <h1 id="home-title">Your future has<br />more than <em>one path.</em></h1>
            <p>Find opportunities, plan for university, and take the next step with confidence — all in one place.</p>
            <div className="home-actions">
              <button type="button" className="home-primary" onClick={onOpenLearnerHub}>Explore the Learner Hub <FaArrowRight /></button>
              <button type="button" className="home-secondary" onClick={onOpenSignUp}>Join as a student</button>
            </div>
            <div className="home-trust"><span className="trust-dot" /> Made for learners finding their next step</div>
          </div>
          <div className="hero-visual" aria-label="Study and career opportunities">
            <div className="visual-sun">✳</div><div className="visual-ring ring-a"/><div className="visual-ring ring-b"/>
            <div className="visual-note note-funding"><span className="note-icon note-orange"><FaGraduationCap /></span><span><strong>Funding</strong><small>Bursaries &amp; scholarships</small></span><span className="note-arrow">↗</span></div>
            <div className="visual-note note-work"><span className="note-icon note-green"><FaBriefcase /></span><span><strong>Work experience</strong><small>Internships &amp; learnerships</small></span><span className="note-arrow">↗</span></div>
            <div className="visual-note note-study"><span className="note-icon note-lilac"><FaCalendarDays /></span><span><strong>Study planning</strong><small>Courses, dates &amp; prospectuses</small></span><span className="note-arrow">↗</span></div>
            <div className="visual-caption">OPPORTUNITY MEETS POSSIBILITY <span>✦</span></div>
          </div>
          <div className="hero-footnote">EXCELLENCEHUB <span>·</span> LEARN. GROW. GO FURTHER.</div>
        </section>

        <section className="home-pathways" aria-labelledby="pathways-title">
          <div className="pathway-heading"><div><div className="home-eyebrow eyebrow-dark">A PLACE TO BEGIN</div><h2 id="pathways-title">Where would you like to go?</h2></div><p>Whatever your next step looks like, start exploring here.</p></div>
          <div className="home-pathway-grid">{pathways.map((pathway) => <article className="home-pathway-card" key={pathway.number}>
            <div className="pathway-card-top"><span className="pathway-icon">{pathway.icon}</span><span className="pathway-number">{pathway.number}</span></div>
            <h3>{pathway.title}</h3><p>{pathway.text}</p><button type="button" onClick={onOpenLearnerHub}>{pathway.label} <FaArrowRight /></button>
          </article>)}</div>
        </section>

        <section className="home-planning" aria-label="Study planning resources">
          <div className="planning-art"><div className="planning-circle"><FaFileLines /></div><span className="planning-star">✳</span><span className="planning-line" /></div>
          <div className="planning-copy"><div className="home-eyebrow eyebrow-dark">FOR GRADE 12 &amp; FUTURE STUDENTS</div><h2>Make your post-school plan feel possible.</h2><p>Get a head start on university applications with course guidance, prospectuses, key dates and funding information.</p><button type="button" className="home-text-link" onClick={onOpenLearnerHub}>Explore study options <FaArrowUpRightFromSquare /></button></div>
          <div className="planning-stamp"><FaMagnifyingGlass /><span>YOUR NEXT<br/>CHAPTER</span></div>
        </section>

        <section className="home-join"><div><span className="join-spark">✳</span><div><div className="home-eyebrow">YOUR NEXT STEP IS WAITING</div><h2>Start exploring today.</h2><p>Join the hub and find the opportunities that fit your goals.</p></div></div><button type="button" onClick={onOpenSignUp}>Join as a student <FaArrowRight /></button></section>
        <footer className="home-footer"><span>ExcellenceHub <b>·</b> Find your next step.</span><div className="home-portal-links"><button type="button" onClick={onOpenEmployer}>Employer portal</button><Link to="/Manager">Manager review demo</Link></div><span>Explore opportunities. Plan with confidence.</span></footer>
      </div>
    </main>
  );
}

export default Home;




