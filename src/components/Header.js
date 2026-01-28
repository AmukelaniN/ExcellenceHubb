import React from 'react';
import './main.css';

function Header({ onOpenLogin, onOpenSignUp }) {
    const handleLoginClick = (e) => {
        if (onOpenLogin) {
            e.preventDefault();
            onOpenLogin();
        }
    }

    return(
        <header>
  <div className="container header-container">
    <a href="#" className="logo">
      Excellence<span>Hub</span>
    </a>

    <div className="mobile-menu-btn">
      <i className="fas fa-bars"></i>
    </div>

    <nav>
      <ul>
        <li><a href="">Home</a></li>
        <li><a href="About">About</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#media">Media</a></li>
        <li><a href="#events">Events</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#" onClick={(e) => { e.preventDefault(); onOpenSignUp(); }}>Sign up</a></li>
        <li><a href="#" onClick={handleLoginClick} className="btnlogin">Login</a></li>
      </ul>
    </nav>
  </div>
</header>

    )
}
export default Header;