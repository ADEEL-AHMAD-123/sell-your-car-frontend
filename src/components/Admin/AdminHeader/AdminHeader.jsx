import './AdminHeader.scss';
import { 
  FaBell, 
  FaSearch, 
  FaUserCircle, 
  FaBars,
  FaExpand,
  FaMoon,
  FaSun,
  FaCog
} from 'react-icons/fa';
import { useState } from 'react';

const AdminHeader = ({ onToggle, sidebarCollapsed, isMobile }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [notificationCount] = useState(3);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Here you would implement theme switching logic
  };

  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <button 
          className="admin-header__toggle"
          onClick={onToggle}
          aria-label={isMobile ? "Toggle sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>
        
        {!isMobile && (
          <div className="admin-header__breadcrumb">
            <h1 className="admin-header__title">
              SellYourCar <span className="admin-header__subtitle">Admin</span>
            </h1>
          </div>
        )}
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
          
          <button 
            className="admin-header__action-btn"
            title="Settings"
          >
            <FaCog />
          </button>
          
          <div className="admin-header__notification">
            <button className="admin-header__action-btn">
              <FaBell />
              {notificationCount > 0 && (
                <span className="admin-header__notification-badge">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="admin-header__profile">
          <div className="admin-header__profile-info">
            <span className="admin-header__profile-name">John Doe</span>
            <span className="admin-header__profile-role">Administrator</span>
          </div>
          <div className="admin-header__avatar">
            <FaUserCircle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;