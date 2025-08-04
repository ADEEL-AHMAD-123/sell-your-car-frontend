import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader/AdminHeader';
import './AdminLayout.scss';

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
        setSidebarCollapsed(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  return (
    <div className="admin-layout">
      {/* Backdrop for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div 
          className="admin-backdrop" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar 
        isOpen={sidebarOpen} 
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className={`admin-main ${sidebarCollapsed && !isMobile ? 'sidebar-collapsed' : ''}`}>
        <AdminHeader 
          onToggle={toggleSidebar}
          sidebarCollapsed={sidebarCollapsed}
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