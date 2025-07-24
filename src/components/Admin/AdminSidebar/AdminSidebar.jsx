import './AdminSidebar.scss';
import { FaUsers, FaQuoteRight, FaHome } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isOpen }) => {
  const { pathname } = useLocation();

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav>
        <Link to="/dashboard" className={pathname === '/dashboard' ? 'active' : ''}>
          <FaHome /> Dashboard
        </Link>
        <Link to="/dashboard/users" className={pathname === '/dashboard/users' ? 'active' : ''}>
          <FaUsers /> Manage Users
        </Link>
        <Link to="/dashboard/quotes" className={pathname === '/dashboard/quotes' ? 'active' : ''}>
          <FaQuoteRight /> Manage Quotes
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
