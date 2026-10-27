import React, { useState } from 'react';
import './main.css';
import './Header.css';
import { Link, NavLink, useLocation } from "react-router-dom";
import { FaBars, FaXmark } from "react-icons/fa6";

function Header({ onOpenLogin, onOpenSignUp, isLoggedIn, accountRole, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const closeMenu = () => setMenuOpen(false);
    const dashboardPath = accountRole === 'administrator' ? '/Admin' : accountRole === 'employer' ? '/Recruiter' : '/Dashboard';
    const dashboardLabel = accountRole === 'administrator' ? 'Admin Dashboard' : accountRole === 'employer' ? 'Employer dashboard' : 'Learner Hub';
    const dashboardLink = <NavLink to={dashboardPath} end className={({ isActive }) => isActive || (accountRole === 'administrator' && location.pathname === '/Manager') ? 'active' : undefined} onClick={closeMenu}>{dashboardLabel}</NavLink>;

    return (
        <header className="site-header">
            <div className="container header-container">
                <Link to="/" className="logo" onClick={closeMenu}>Excellence<span>Hub</span></Link>
                <button type="button" className="mobile-menu-btn" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <FaXmark /> : <FaBars />}</button>
                <nav className={menuOpen ? "site-nav show" : "site-nav"} aria-label="Main navigation">
                    <ul>
                        <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined} onClick={closeMenu}>Home</NavLink></li>
                        <li><Link to="/About" onClick={closeMenu}>About</Link></li>
                        <li>{isLoggedIn ? dashboardLink : null}</li>
                        <li><a href="#media" onClick={closeMenu}>Media</a></li>
                        <li><a href="#events" onClick={closeMenu}>Events</a></li>
                        <li><a href="#contact" onClick={closeMenu}>Contact</a></li>
                        {isLoggedIn ? <li><button type="button" onClick={() => { closeMenu(); onLogout(); }} className="btnlogin">Log out</button></li> : <>
                            <li><button type="button" className="nav-action" onClick={() => { closeMenu(); onOpenSignUp(); }}>Sign up</button></li>
                            <li><button type="button" onClick={() => { closeMenu(); onOpenLogin(); }} className="btnlogin">Login</button></li>
                        </>}
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Header;






