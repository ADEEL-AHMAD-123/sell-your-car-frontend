import React, { useState, useEffect } from 'react';
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
  FaChevronDown,
  FaInfoCircle,
  FaPencilAlt, 
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './AdminSidebar.scss';

const AdminSidebar = ({ isOpen, isCollapsed, isMobile, onClose }) => {
  const { pathname } = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});
  const { firstName, lastName, role } = useSelector(state => state.auth.user);

  const isActive = (path) => pathname === path;
  const isParentActive = (paths) => paths.some(path => pathname.startsWith(path));

  // Auto-expand active parent menu
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.submenu && isParentActive(item.submenu.map(sub => sub.path))) {
        setExpandedMenus(prev => ({
          ...prev,
          [item.key]: true
        }));
      }
    });
  }, [pathname]);

  const toggleSubmenu = (menuKey, e) => {
    e.preventDefault();
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const menuItems = [
    {
      key: 'dashboard',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      path: '/dashboard'
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
      path: '/dashboard/users'
    },
    {
      key: 'quotes',
      icon: FaQuoteRight,
      label: 'Quote Management',
      submenu: [
        { label: 'All Quotes', path: '/dashboard/quotes' },
        { label: 'Pending Manual Quotes', path: '/dashboard/manual-quotes' },
        { label: 'Pending Auto Quotes', path: '/dashboard/pending-auto-quotes' },
        { label: 'Accepted Quotes', path: '/dashboard/accepted-quotes' },
        { label: 'Collected Quotes', path: '/dashboard/collected-quotes' },
        { label: 'Rejected Quotes', path: '/dashboard/rejected-quotes' }
      ]
    },
    {
      key: 'blog',
      icon: FaPencilAlt,
      label: 'Blog Management',
      submenu: [
        { label: 'All Posts', path: '/dashboard/blog' },
        { label: 'Create New', path: '/dashboard/blog/create' }
      ]
    },
    {
      key: 'emails', // <-- NEW MENU ITEM
      icon: FaEnvelope,
      label: 'Promotional Emails',
      path: '/dashboard/promo-email'
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

  const adminName = `${firstName || 'Admin'} ${lastName || ''}`.trim();

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
      {/* Header */}
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <FaHome />
          </div>
          {!isCollapsed && (
            <div className="admin-sidebar__brand-text">
              <h3>SellYourCar</h3>
              <span>Admin Panel</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar__nav">
        <div className="admin-sidebar__menu">
          {menuItems.map((item) => (
            <div key={item.key} className="admin-sidebar__menu-item">
              {item.submenu ? (
                // Submenu item
                <div className={`admin-sidebar__submenu-wrapper ${expandedMenus[item.key] ? 'expanded' : ''}`}>
                  <button
                    className={`admin-sidebar__link admin-sidebar__submenu-toggle ${
                      isParentActive(item.submenu.map(sub => sub.path)) ? 'active' : ''
                    }`}
                    onClick={(e) => toggleSubmenu(item.key, e)}
                    title={isCollapsed ? item.label : ''}
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
                  
                  {!isCollapsed && expandedMenus[item.key] && (
                    <div className="admin-sidebar__submenu">
                      {item.submenu.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.path}
                          className={`admin-sidebar__sublink ${isActive(subItem.path) ? 'active' : ''}`}
                          onClick={handleLinkClick}
                        >
                          <div className="admin-sidebar__sublink-indicator" />
                          <span>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : item.isFutureFeature ? (
                // Future feature item
                <div
                  className="admin-sidebar__link admin-sidebar__future-feature"
                  title={isCollapsed ? `${item.label} (Coming Soon)` : 'This feature will be implemented in the future.'}
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
                // Regular menu item
                <Link
                  to={item.path}
                  className={`admin-sidebar__link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={handleLinkClick}
                  title={isCollapsed ? item.label : ''}
                >
                  <div className="admin-sidebar__link-content">
                    <item.icon className="admin-sidebar__icon" />
                    {!isCollapsed && (
                      <>
                        <span className="admin-sidebar__label">{item.label}</span>
                        {item.badge && (
                          <span className={`admin-sidebar__badge ${item.badge.toLowerCase()}`}>
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {isCollapsed && item.badge && (
                    <div className="admin-sidebar__badge-collapsed">
                      <div className="admin-sidebar__badge-dot"></div>
                    </div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user-profile">
            <div className="admin-sidebar__user-avatar">
              <span>
                {(firstName?.[0] || 'A').toUpperCase()}
                {(lastName?.[0] || 'D').toUpperCase()}
              </span>
            </div>
            <div className="admin-sidebar__user-info">
              <span className="admin-sidebar__user-name">{adminName}</span>
              <span className="admin-sidebar__user-role">{role}</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default AdminSidebar;