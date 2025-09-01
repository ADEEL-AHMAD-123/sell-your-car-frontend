import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.scss';
import {
  FaBell,
  FaSearch,
  FaBars,
  FaExpand,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaGlobe, // Imported FaGlobe for a world/site icon
  FaExternalLinkAlt // An alternative icon for external links
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { logoutUser } from "../../../redux/slices/authSlice";
import { resetQuote as resetQuoteState } from "../../../redux/slices/quoteSlice";
import { resetAuthState } from "../../../redux/slices/authSlice";
import { resetState as resetAdminState } from "../../../redux/slices/adminSlice";
import { resetState as resetAdminQuoteState } from "../../../redux/slices/adminQuoteSlice";
import { persistor } from "../../../redux/store";
import { useDispatch } from 'react-redux';

const AdminHeader = ({ onToggle, sidebarCollapsed, sidebarOpen, isMobile }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationCount] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(state => state.auth?.user) || {};
  const { firstName, lastName, role } = user;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'light' : 'dark');
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      const result = await dispatch(logoutUser());
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(resetAuthState());
        dispatch(resetQuoteState());
        dispatch(resetAdminState());
        dispatch(resetAdminQuoteState());
        await persistor.purge();
        navigate('/');
      } else {
        console.error("Logout failed due to an API error. State was not reset.");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleGoToMainSite = () => {
    navigate('/');
    setProfileDropdownOpen(false); // Close dropdown after navigation
  };

  const getToggleTitle = () => {
    if (isMobile) {
      return sidebarOpen ? 'Close sidebar' : 'Open sidebar';
    }
    return sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar';
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button
          className={`admin-header__toggle ${sidebarOpen && !isMobile ? 'active' : ''}`}
          onClick={onToggle}
          aria-label={getToggleTitle()}
          title={getToggleTitle()}
        >
          <FaBars />
        </button>
        <div className="admin-header__breadcrumb">
          <h1 className="admin-header__title">
            SellYourCar
            <span className="admin-header__subtitle">Admin</span>
          </h1>
        </div>
      </div>
      <div className="admin-header__center">
        <div className={`admin-header__search ${searchFocused ? 'focused' : ''}`}>
          <FaSearch className="admin-header__search-icon" />
          <input
            type="text"
            placeholder="Search users, quotes, vehicles..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <div className="admin-header__search-shortcut">
            <span>⌘K</span>
          </div>
        </div>
      </div>
      <div className="admin-header__right">
        <div className="admin-header__actions">
          <button
            className="admin-header__action-btn"
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
          >
            <FaExpand />
          </button>
          <button
            className="admin-header__action-btn"
            onClick={toggleTheme}
            title="Toggle Theme"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <div className="admin-header__notification">
            <button className="admin-header__action-btn" title="Notifications">
              <FaBell />
              {notificationCount > 0 && (
                <span className="admin-header__notification-badge">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
        <div className="admin-header__profile">
          <button
            className={`admin-header__profile-btn ${profileDropdownOpen ? 'active' : ''}`}
            onClick={toggleProfileDropdown}
          >
            <div className="admin-header__profile-info">
              <span className="admin-header__profile-name">
                {firstName || 'Admin'}
              </span>
              <span className="admin-header__profile-role">{role}</span>
            </div>
            <div className="admin-header__avatar">
              <span className="admin-header__avatar-text">
                {(firstName?.[0] || 'A').toUpperCase()}
                {(lastName?.[0] || 'D').toUpperCase()}
              </span>
            </div>
            <FaChevronDown className={`admin-header__profile-chevron ${profileDropdownOpen ? 'rotated' : ''}`} />
          </button>

          {profileDropdownOpen && (
            <div className="admin-header__profile-dropdown">
              <div className="admin-header__dropdown-header">
                <div className="admin-header__dropdown-avatar">
                  <span>
                    {(firstName?.[0] || 'A').toUpperCase()}
                    {(lastName?.[0] || 'D').toUpperCase()}
                  </span>
                </div>
                <div className="admin-header__dropdown-info">
                  <span className="admin-header__dropdown-name">
                    {firstName} {lastName}
                  </span>
                  <span className="admin-header__dropdown-role">{role}</span>
                </div>
              </div>
              <div className="admin-header__dropdown-menu">
                {/* Button to navigate to main site with a globe icon */}
                <button className="admin-header__dropdown-item admin-header__main-site-item" onClick={handleGoToMainSite}>
                  <FaGlobe />
                  <span>Go to Main Site</span>
                </button>
                <button className="admin-header__dropdown-item admin-header__logout" onClick={handleLogout}>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header> 
  );
};

export default AdminHeader;