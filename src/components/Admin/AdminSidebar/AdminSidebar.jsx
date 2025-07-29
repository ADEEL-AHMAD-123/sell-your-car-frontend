import './AdminSidebar.scss';
import {
  FaUsers,
  FaQuoteRight,
  FaHome,
  FaCarCrash,
  FaCheckCircle,
  FaFileAlt,
  FaEnvelope,
  FaToolbox,
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ isOpen }) => {
  const { pathname } = useLocation();

  const isActive = (path) => pathname === path;

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav>
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
          <FaHome /> Dashboard
        </Link>

        <Link to="/dashboard/users" className={isActive('/dashboard/users') ? 'active' : ''}>
          <FaUsers /> Manage Users
        </Link>

        <Link to="/dashboard/quotes" className={isActive('/dashboard/quotes') ? 'active' : ''}>
          <FaQuoteRight /> Manage All Quotes
        </Link>

        <Link to="/dashboard/manual-quotes" className={isActive('/dashboard/manual-quotes') ? 'active' : ''}>
          <FaFileAlt /> Manual Quotes
        </Link>

        <Link to="/dashboard/accepted-manual-quotes" className={isActive('/dashboard/accepted-manual-quotes') ? 'active' : ''}>
          <FaCheckCircle /> Accepted Manual Quotes
        </Link>

        <Link to="/dashboard/vehicles" className={isActive('/dashboard/vehicles') ? 'active' : ''}>
          <FaCarCrash /> Vehicle Listings
        </Link>

        <Link to="/dashboard/messages" className={isActive('/dashboard/messages') ? 'active' : ''}>
          <FaEnvelope /> Customer Messages
        </Link>

        <Link to="/dashboard/settings" className={isActive('/dashboard/settings') ? 'active' : ''}>
          <FaToolbox /> Admin Settings
        </Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
