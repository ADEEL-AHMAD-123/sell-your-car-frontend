import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader/AdminHeader';
import './AdminLayout.scss';

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkDeviceType = () => {
      const mobile = window.innerWidth <= 768;
      const tablet = window.innerWidth <= 1024;
      
      setIsMobile(mobile);
      
      if (mobile) {
        // On mobile, sidebar is hidden by default
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      } else if (tablet) {
        // On tablet, sidebar is collapsed by default
        setSidebarOpen(true);
        setSidebarCollapsed(true);
      } else {
        // On desktop, sidebar is fully open by default
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      }
    };

    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  // Single toggle function for all devices
  const toggleSidebar = () => {
    if (isMobile) {
      // On mobile: toggle visibility (overlay mode)
      setSidebarOpen(prev => !prev);
    } else {
      // On desktop/tablet: toggle between collapsed and expanded
      if (!sidebarOpen) {
        setSidebarOpen(true);
        setSidebarCollapsed(false);
      } else if (!sidebarCollapsed) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    }
  };

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Determine main content classes
  const getMainClasses = () => {
    let classes = 'admin-main';
    
    if (isMobile) {
      classes += ' mobile';
    } else if (sidebarCollapsed) {
      classes += ' sidebar-collapsed';
    } else {
      classes += ' sidebar-expanded';
    }
    
    return classes;
  };

  return (
    <div className="admin-layout">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="admin-backdrop"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        onClose={closeSidebar}
      />

      {/* Main Content */}
      <div className={getMainClasses()}>
        <AdminHeader 
          onToggle={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
          sidebarOpen={sidebarOpen}
          isMobile={isMobile}
        />
        
        <main className="admin-content">
          <div className="admin-content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;