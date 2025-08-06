import React, { useState } from 'react';
import {
  FaUsers,
  FaQuoteRight,
  FaHome,
  FaCarCrash,
  FaFileAlt,
  FaEnvelope,
  FaToolbox,
  FaChartBar,
  FaTachometerAlt,
  FaTimes,
  FaChevronDown,
  FaInfoCircle
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state
import './AdminSidebar.scss';

const AdminSidebar = ({ isOpen, isCollapsed, isMobile, onClose }) => {
  const { pathname } = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const { firstName, lastName, role } = useSelector(state => state.auth.user); // Fetch user data from the Redux state

  const isActive = (path) => pathname === path;
  const isParentActive = (paths) => paths.some(path => pathname.startsWith(path));

  const toggleSubmenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const futureFeatureTooltip = "This feature will be implemented in the future.";

  const menuItems = [
    {
      key: 'dashboard',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      path: '/dashboard',
      badge: null
    },
    {
      key: 'analytics',
      icon: FaChartBar,
      label: 'Analytics',
      path: '/dashboard/analytics',
      badge: 'New'
    },
    {
      key: 'users',
      icon: FaUsers,
      label: 'User Management',
      path: '/dashboard/users' // Single path, no submenu
    },
    {
      key: 'quotes',
      icon: FaQuoteRight,
      label: 'Quote Management',
      submenu: [
        { label: 'All Quotes', path: '/dashboard/quotes' },
        { label: 'Manual Quotes', path: '/dashboard/manual-quotes' },
        { label: 'Accepted Quotes', path: '/dashboard/accepted-quotes' },
        { label: 'Pending Review', path: '/dashboard/quotes/pending' }
      ]
    },
    {
      key: 'vehicles',
      icon: FaCarCrash,
      label: 'Vehicle Management',
      isFutureFeature: true
    },
    {
      key: 'messages',
      icon: FaEnvelope,
      label: 'Messages',
      isFutureFeature: true
    },
    {
      key: 'reports',
      icon: FaFileAlt,
      label: 'Reports',
      isFutureFeature: true
    },
    {
      key: 'settings',
      icon: FaToolbox,
      label: 'Settings',
      path: '/dashboard/settings'
    }
  ];

  const adminName = `${firstName || 'Admin'} ${lastName || ''}`;

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
        {/* Sidebar Header */}
        <div className="admin-sidebar__header">
          {isMobile && (
            <button className="admin-sidebar__close" onClick={onClose}>
              <FaTimes />
            </button>
          )}
          
          {!isCollapsed && (
            <div className="admin-sidebar__brand">
              <div className="admin-sidebar__logo">
                <FaHome />
              </div>
              <div className="admin-sidebar__brand-text">
                <h3>SellYourCar</h3>
                <span>Admin Panel</span>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="admin-sidebar__logo-collapsed">
              <FaHome />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="admin-sidebar__nav">
          <div className="admin-sidebar__menu">
            {menuItems.map((item) => (
              <div key={item.key} className="admin-sidebar__menu-item">
                {item.submenu ? (
                  <div className={`admin-sidebar__submenu-wrapper ${expandedMenus[item.key] ? 'expanded' : ''}`}>
                    <button
                      className={`admin-sidebar__link admin-sidebar__submenu-toggle ${
                        isParentActive(item.submenu.map(sub => sub.path)) ? 'active' : ''
                      }`}
                      onClick={() => toggleSubmenu(item.key)}
                    >
                      <div className="admin-sidebar__link-content">
                        <item.icon className="admin-sidebar__icon" />
                        {!isCollapsed && (
                          <>
                            <span className="admin-sidebar__label">{item.label}</span>
                            <FaChevronDown className={`admin-sidebar__chevron ${expandedMenus[item.key] ? 'rotated' : ''}`} />
                          </>
                        )}
                      </div>
                    </button>
                    
                    {!isCollapsed && (
                      <div className="admin-sidebar__submenu">
                        {item.submenu.map((subItem, index) => (
                          <Link
                            key={index}
                            to={subItem.path}
                            className={`admin-sidebar__sublink ${isActive(subItem.path) ? 'active' : ''}`}
                            onClick={isMobile ? onClose : undefined}
                          >
                            <div className="admin-sidebar__sublink-indicator" />
                            <span>{subItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.isFutureFeature ? (
                  <div
                    className={`admin-sidebar__link admin-sidebar__future-feature ${isCollapsed ? 'collapsed' : ''}`}
                    title={futureFeatureTooltip}
                  >
                    <div className="admin-sidebar__link-content">
                      <item.icon className="admin-sidebar__icon" />
                      {!isCollapsed && (
                        <>
                          <span className="admin-sidebar__label">{item.label}</span>
                          <FaInfoCircle className="admin-sidebar__info-icon" />
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`admin-sidebar__link ${isActive(item.path) ? 'active' : ''}`}
                    onClick={isMobile ? onClose : undefined}
                    title={isCollapsed ? item.label : ''}
                  >
                    <div className="admin-sidebar__link-content">
                      <item.icon className="admin-sidebar__icon" />
                      {!isCollapsed && (
                        <>
                          <span className="admin-sidebar__label">{item.label}</span>
                          {item.badge && (
                            <span className={`admin-sidebar__badge ${item.badge === 'New' ? 'new' : ''}`}>
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {isCollapsed && item.badge && (
                      <div className="admin-sidebar__badge-collapsed">
                        {item.badge === 'New' ? '!' : item.badge}
                      </div>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Sidebar Footer */}
        {!isCollapsed && (
          <div className="admin-sidebar__footer">
            <div className="admin-sidebar__footer-content">
              <div className="admin-sidebar__user-info">
                <div className="admin-sidebar__user-avatar">
                  <span>{(firstName?.[0] || 'A').toUpperCase()}{(lastName?.[0] || 'D').toUpperCase()}</span>
                </div>
                <div className="admin-sidebar__user-details">
                  <span className="admin-sidebar__user-name">{adminName}</span>
                  <span className="admin-sidebar__user-role">{role}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
