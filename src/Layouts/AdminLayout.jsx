import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/Admin/AdminHeader/AdminHeader';
import './AdminLayout.scss';

const AdminLayout = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setSidebarOpen(!mobile);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="admin-layout">
      {/* For large: sidebar on left. For small: sidebar under header */}
      {!isMobile && <AdminSidebar isOpen={sidebarOpen} />}

      <div className="admin-main">
        <AdminHeader onToggle={() => setSidebarOpen(prev => !prev)} />

        {isMobile && sidebarOpen && <AdminSidebar isOpen={sidebarOpen} />}

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
