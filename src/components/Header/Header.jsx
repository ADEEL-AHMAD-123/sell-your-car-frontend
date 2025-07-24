import React, { useState } from 'react';
import './Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';

import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // if routing

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const checksLeft = user?.checksLeft ?? 0; // adjust if checksLeft is stored elsewhere

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderChecksArea = () => {
    if (isAuthenticated && user) {
      return (
        <div className="header__user-panel">
          <FontAwesomeIcon icon={faUserCircle} className="header__user-avatar" />
          <div className="header__user-details">
            <span className="header__user-name">{user.firstName || "User"}</span>
            <span className="header__checks">Checks: {user.checksLeft ?? 0}</span>
          </div>
        </div>
      );
    } else {
      return (
        <Link to="/login" className="header__login-modern">
          Login
        </Link>
      );
    }
  };
  

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__logo">
          <h1>SellYourCar</h1>
        </div>

        <nav className="header__nav">
          <ul className="header__nav-list"> 
            <li><a href="/" className="header__nav-link">Home</a></li>
            <li><a href="/about" className="header__nav-link">About</a></li>
            <li><a href="/how-it-works" className="header__nav-link">How It Works</a></li>
            <li><a href="/faqs" className="header__nav-link">FAQs</a></li>
            <li><a href="/contact" className="header__nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Desktop: Checks/Profile/Login */}
        <div className="header__auth-area header__auth-area--desktop">
          {renderChecksArea()}
        </div>

        <button 
          className="header__menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className="hamburger"></span>
          <span className="hamburger"></span>
          <span className="hamburger"></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`}>
        <div className="header__auth-area header__auth-area--mobile">
          {renderChecksArea()}
        </div>

        <nav className="header__mobile-nav">
          <ul className="header__mobile-nav-list">
            <li><a href="/" className="header__mobile-nav-link" onClick={closeMobileMenu}>Home</a></li>
            <li><a href="/about" className="header__mobile-nav-link" onClick={closeMobileMenu}>About</a></li>
            <li><a href="/how-it-works" className="header__mobile-nav-link" onClick={closeMobileMenu}>How It Works</a></li>
            <li><a href="/faqs" className="header__mobile-nav-link" onClick={closeMobileMenu}>FAQs</a></li>
            <li><a href="/contact" className="header__mobile-nav-link" onClick={closeMobileMenu}>Contact</a></li>
          </ul>
        </nav>

        <div className="header__social-icons">
          {/* Social icons as-is */}
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="header__overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
};

export default Header;
