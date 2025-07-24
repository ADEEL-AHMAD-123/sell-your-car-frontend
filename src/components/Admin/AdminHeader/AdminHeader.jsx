import './AdminHeader.scss';
import { FaBell, FaSearch, FaUserCircle } from 'react-icons/fa';

const AdminHeader = ({ onToggle }) => {
  return (
    <header className="admin-header">
      <div className="left-section">
        <button className="toggle-btn" onClick={onToggle}>
          ☰
        </button>
        <span className="logo-text">SellYourCar</span>

      </div>
      <div className="search-bar">
        <FaSearch />
        <input type="text" placeholder="Search here..." />
      </div>
      <div className="header-actions">
        <FaBell className="icon" />
        <FaUserCircle className="icon avatar" />
      </div>
    </header>
  );
};

export default AdminHeader;
