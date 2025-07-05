import React, { useState } from 'react';
import './Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__container">
        {/* Logo */}
        <div className="header__logo">
          <h1>SellYourCar</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="header__nav">
          <ul className="header__nav-list">
            <li><a href="#home" className="header__nav-link">Home</a></li>
            <li><a href="#about" className="header__nav-link">About</a></li>
            <li><a href="#how-it-works" className="header__nav-link">How It Works</a></li>
            <li><a href="#faqs" className="header__nav-link">FAQs</a></li>
            <li><a href="#contact" className="header__nav-link">Contact</a></li>
          </ul>
        </nav>

        {/* Checks Left - Desktop */}
        <div className="header__checks header__checks--desktop">
          <span className="checks-text">Checks Left: <strong>2</strong></span>
        </div>

        {/* Mobile Menu Button */}
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
        {/* Checks Left - Mobile (top) */}
        <div className="header__checks header__checks--mobile">
          <span className="checks-text">Checks Left: <strong>2</strong></span>
        </div>

        {/* Mobile Navigation */}
        <nav className="header__mobile-nav">
          <ul className="header__mobile-nav-list">
            <li><a href="#home" className="header__mobile-nav-link" onClick={closeMobileMenu}>Home</a></li>
            <li><a href="#about" className="header__mobile-nav-link" onClick={closeMobileMenu}>About</a></li>
            <li><a href="#how-it-works" className="header__mobile-nav-link" onClick={closeMobileMenu}>How It Works</a></li>
            <li><a href="#faqs" className="header__mobile-nav-link" onClick={closeMobileMenu}>FAQs</a></li>
            <li><a href="#contact" className="header__mobile-nav-link" onClick={closeMobileMenu}>Contact</a></li>
          </ul>
        </nav>

        {/* Social Links - Mobile/Tablet Only */}
        <div className="header__social-icons">
  <a href="#" className="header__social-icon" aria-label="Facebook">
    <FontAwesomeIcon icon={faFacebookF} />
  </a>
  <a href="#" className="header__social-icon" aria-label="Twitter">
    <FontAwesomeIcon icon={faTwitter} />
  </a>
  <a href="#" className="header__social-icon" aria-label="Instagram">
    <FontAwesomeIcon icon={faInstagram} />
  </a>
  <a href="#" className="header__social-icon" aria-label="LinkedIn">
    <FontAwesomeIcon icon={faLinkedinIn} />
  </a>
</div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="header__overlay" onClick={closeMobileMenu}></div>
      )}
    </header>
  );
};

export default Header;