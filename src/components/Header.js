import React from 'react';
import './main.css';
import { Link } from "react-router-dom";

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

                <Link to="/" className="logo">
                    Excellence<span>Hub</span>
                </Link>

                <div className="mobile-menu-btn">
                    <i className="fas fa-bars"></i>
                </div>

                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/About">About</Link></li>
                        <li><Link to="/Dashboard">Services</Link></li>

                        <li><a href="#media">Media</a></li>
                        <li><a href="#events">Events</a></li>
                        <li><a href="#contact">Contact</a></li>

                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onOpenSignUp();
                                }}
                            >
                                Sign up
                            </a>
                        </li>

                        <li>
                            <a
                                href="#"
                                onClick={handleLoginClick}
                                className="btnlogin"
                            >
                                Login
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;