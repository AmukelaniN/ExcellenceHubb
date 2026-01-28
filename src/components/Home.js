import React from 'react';
import { FcGraduationCap } from "react-icons/fc";
import { FaBriefcase } from "react-icons/fa";
import { FaRegHandshake } from "react-icons/fa6";
import './main.css';

function Home() {
  return (
    <main>
      <section className="hero" role="region" aria-label="Hero">
        <div className="hero-overlay" />
        <div className="hero-inner">
          <h1>Bridging Academia and Industry for Future Leaders</h1>
          <p className="lead">Empowering students, connecting professionals, and building partnerships that drive success in education and career development.</p>

          <div className="hero-ctas">
            <button className="cta btn-primary">Join as Student</button>
            <button className="cta btn-cta">Join as Company</button>
            <button className="cta btn-accent">Partner With Us</button>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <h2>What We Offer</h2>
        <div className="cards">
          <div className="card">
            <div className="card-icon"><FcGraduationCap /></div>
            <h4>Student Programs</h4>
            <p>Hands-on training, mentorship, and internship placement to build industry-ready skills.</p>
          </div>

          <div className="card">
            <div className="card-icon"><FaBriefcase /></div>
            <h4>Company Partnerships</h4>
            <p>Partner with universities to access talent pipelines and co-create curriculum aligned with industry needs.</p>
          </div>

          <div className="card">
            <div className="card-icon"><FaRegHandshake /></div>
            <h4>Community & Events</h4>
            <p>Networking, workshops, and events that bring together educators, students and employers.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
