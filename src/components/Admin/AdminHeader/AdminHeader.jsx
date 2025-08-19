import React, { useState } from 'react';
import './AdminHeader.scss';
import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaBars,
  FaExpand,
  FaMoon,
  FaSun,
  FaCog,
  FaChevronDown
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const AdminHeader = ({ onToggle, sidebarCollapsed, sidebarOpen, isMobile }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationCount] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Assuming Redux state shape, but using placeholders for this example
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

  // Get toggle button state for better UX
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
            // onClick={toggleTheme}
            title="Toggle Theme"
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>

          <button
            className="admin-header__action-btn"
            title="Settings"
          >
            <FaCog />
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
                <a href="#profile" className="admin-header__dropdown-item">
                  <FaUserCircle />
                  <span>Profile</span>
                </a>
                <a href="#settings" className="admin-header__dropdown-item">
                  <FaCog />
                  <span>Settings</span>
                </a>
                <hr className="admin-header__dropdown-divider" />
                <button className="admin-header__dropdown-item admin-header__logout">
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
