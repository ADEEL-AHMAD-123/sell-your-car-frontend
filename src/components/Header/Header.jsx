import React, { useState, useEffect } from 'react';
import './Header.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCircle,
  faBars,
  faTimes,
  faInfoCircle,
  faCheckCircle,
  faTachometerAlt,
  faSignOutAlt // Added logout icon
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../components/common/Logo/Logo';
import { logoutUser } from '../../redux/slices/authSlice';
import { persistor } from '../../redux/store';

// New Modal Component - No changes needed here, as it correctly uses props.
const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Confirm Logout</h3>
        <p className="modal-message">Are you sure you want to log out?</p>
        <div className="modal-actions">
          <button onClick={onClose} className="modal-btn modal-btn--cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="modal-btn modal-btn--confirm">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};


const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showChecksTooltip, setShowChecksTooltip] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // New state for profile dropdown
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // New state for modal
  
  const { isAuthenticated, user } = useSelector((state) => state.auth); 
  const dispatch = useDispatch();
  const checksLeft = user?.checksLeft ?? 0;
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);

    try {
      await dispatch(logoutUser());
      await persistor.purge();
      
      console.log('Successfully logged out and cleared all data.');

    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const getChecksStatusClass = (checks) => {
    if (checks >= 5) return 'header__checks--high';
    if (checks >= 2) return 'header__checks--medium';
    return 'header__checks--low';
  };

  const renderChecksIndicator = () => {
    // Check for isAuthenticated and user
    if (!isAuthenticated || !user || user.role === 'admin') return null;

    return (
      <div className="header__checks-wrapper">
        <div
          className={`header__checks ${getChecksStatusClass(checksLeft)}`}
          onMouseEnter={() => setShowChecksTooltip(true)}
          onMouseLeave={() => setShowChecksTooltip(false)}
          onClick={() => setShowChecksTooltip(!showChecksTooltip)}
        >
          <FontAwesomeIcon icon={faCheckCircle} className="header__checks-icon" />
          <span className="header__checks-count">{checksLeft}</span>
          <FontAwesomeIcon icon={faInfoCircle} className="header__checks-info" />
        </div>

        {showChecksTooltip && (
  <div className="header__checks-tooltip">
    <div className="header__tooltip-header">
      <FontAwesomeIcon icon={faCheckCircle} />
      <h4>Number of Checks Remaining</h4>
    </div>

    <div className="header__tooltip-content">
      <p className="header__tooltip-main">
        You have <strong>{checksLeft} checks</strong> remaining to get instant quotes for your vehicle.
      </p>

      <ul className="header__tooltip-features">
        <li className="header__tooltip-feature">
          These checks are limited and allow you to get quotes for new vehicle registration numbers.
        </li>
        <li className="header__tooltip-feature">
          A check is used only when you search for a vehicle you haven't searched before.
        </li>
        <li className="header__tooltip-feature">
          If you recheck a vehicle you've already searched recently, your check will not decrease.
        </li>
        <li className="header__tooltip-feature">
          Each check provides detailed vehicle information used to calculate your quote instantly.
        </li>
      </ul>

      {checksLeft <= 1 && (
        <button className="header__tooltip-btn">Get More Checks</button>
      )}
    </div>
  </div>
)}


      </div>
    );
  };

  const renderUserSection = () => {
    // 💡 CHANGE: Use only isAuthenticated for the main check
    if (isAuthenticated) {
      return (
        <div className="header__user-section">
          {/* We must check if user exists before accessing user.role, as it could be null for a brief moment */}
          {user?.role === 'admin' ? ( 
            <Link to="/dashboard" className="header__dashboard-btn">
              <FontAwesomeIcon icon={faTachometerAlt} /> 
              Dashboard
            </Link>
          ) : (
            renderChecksIndicator()
          )}
  
          {/* This is the new wrapper for the CSS-only hover effect */}
          <div className="header__profile-menu-container">
            <span className="header__user-profile">
              <FontAwesomeIcon icon={faUserCircle} className="header__user-avatar" />
              {/* Use optional chaining to safely access user properties */}
              <span className="header__user-name">
                {user?.firstName} {user?.lastName}
              </span>
            </span>
            <div className="header__profile-dropdown">
              <button 
                onClick={() => setIsLogoutModalOpen(true)} 
                className="header__logout-btn"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="header__auth-buttons">
          <Link to="/login" className="header__login-btn">Login</Link>
          <Link to="/signup" className="header__signup-btn">Sign Up</Link>
        </div>
      );
    }
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <div className="header__content">
            <Logo className="header__logo" />
            <nav className="header__nav">
              <ul className="header__nav-list">
                <li><Link to="/" className={`header__nav-link ${isActiveLink('/') ? 'header__nav-link--active' : ''}`}>Home</Link></li>
                <li><Link to="/about" className={`header__nav-link ${isActiveLink('/about') ? 'header__nav-link--active' : ''}`}>About</Link></li>
                <li><Link to="/how-it-works" className={`header__nav-link ${isActiveLink('/how-it-works') ? 'header__nav-link--active' : ''}`}>How It Works</Link></li>
                <li><Link to="/faqs" className={`header__nav-link ${isActiveLink('/faqs') ? 'header__nav-link--active' : ''}`}>FAQs</Link></li>
                <li><Link to="/contact" className={`header__nav-link ${isActiveLink('/contact') ? 'header__nav-link--active' : ''}`}>Contact</Link></li>
              </ul>
            </nav>
            <div className="header__auth-area">
              {renderUserSection()}
            </div>
            <div className="header__mobile-controls">
              {/* 💡 CHANGE: Use isAuthenticated and optional chaining for the checks */}
              {isAuthenticated && user?.role !== 'admin' && (
                <div className="header__mobile-checks">
                  {renderChecksIndicator()}
                </div>
              )}
              <button
                onClick={toggleMobileMenu}
                className={`header__menu-btn ${isMobileMenuOpen ? 'header__menu-btn--active' : ''}`}
                aria-label="Toggle mobile menu"
              >
                <span className="header__hamburger"></span>
                <span className="header__hamburger"></span>
                <span className="header__hamburger"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="header__overlay" onClick={closeMobileMenu} />
      )}

      <div className={`header__mobile-menu ${isMobileMenuOpen ? 'header__mobile-menu--open' : ''}`}>
        <div className="header__mobile-content">
          {/* 💡 CHANGE: Use only isAuthenticated for the main check */}
          {isAuthenticated ? (
            <div className="header__mobile-user">
              <div className="header__mobile-user-info">
                <FontAwesomeIcon icon={faUserCircle} className="header__mobile-user-avatar" />
                <div>
                  {/* Use optional chaining */}
                  <p className="header__mobile-user-name">Welcome, {user?.firstName} {user?.lastName}!</p>
                  <p className="header__mobile-user-subtitle">
                    {/* Use optional chaining */}
                    {user?.role === 'admin' ? 'Admin Access' : 'Manage your account'}
                  </p>
                </div>
              </div>

              {/* Use optional chaining */}
              {user?.role === 'admin' && (
                <Link to="/dashboard" className="header__mobile-dashboard-btn" onClick={closeMobileMenu}>
                  <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
                </Link>
              )}
              
              <button 
                onClick={() => {
                  closeMobileMenu();
                  setIsLogoutModalOpen(true);
                }} 
                className="header__mobile-logout-btn"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="header__mobile-auth">
              <Link to="/login" className="header__mobile-login" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/signup" className="header__mobile-signup" onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </div>
          )}
          <nav className="header__mobile-nav">
            <ul className="header__mobile-nav-list">
              <li><Link to="/" className={`header__mobile-nav-link ${isActiveLink('/') ? 'header__mobile-nav-link--active' : ''}`} onClick={closeMobileMenu}>Home</Link></li>
              <li><Link to="/about" className={`header__mobile-nav-link ${isActiveLink('/about') ? 'header__mobile-nav-link--active' : ''}`} onClick={closeMobileMenu}>About</Link></li>
              <li><Link to="/how-it-works" className={`header__mobile-nav-link ${isActiveLink('/how-it-works') ? 'header__mobile-nav-link--active' : ''}`} onClick={closeMobileMenu}>How It Works</Link></li>
              <li><Link to="/faqs" className={`header__mobile-nav-link ${isActiveLink('/faqs') ? 'header__mobile-nav-link--active' : ''}`} onClick={closeMobileMenu}>FAQs</Link></li>
              <li><Link to="/contact" className={`header__mobile-nav-link ${isActiveLink('/contact') ? 'header__mobile-nav-link--active' : ''}`} onClick={closeMobileMenu}>Contact</Link></li>
            </ul>
          </nav>
          <div className="header__social-icons">
            <a href="#" className="header__social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
            <a href="#" className="header__social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
            <a href="#" className="header__social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
            <a href="#" className="header__social-icon"><FontAwesomeIcon icon={faLinkedinIn} /></a>
          </div>
        </div>
      </div>

      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;