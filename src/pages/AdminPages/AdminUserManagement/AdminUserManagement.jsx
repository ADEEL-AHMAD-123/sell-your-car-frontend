import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaSpinner, 
  FaUsers, 
  FaExclamationTriangle, 
  FaSearch, 
  FaFilter,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaRedo,
  FaEraser
} from 'react-icons/fa';
import './AdminUserManagement.scss';
import { fetchAllUsers, updateUser, deleteUser, refillUserChecks } from '../../../redux/slices/adminSlice'; 

const AdminUserManagement = () => {
  const dispatch = useDispatch();
  
  const adminState = useSelector((state) => state.admin);
  const { users, loading, error, currentPage, totalPages, totalUsers, limit } = useMemo(() => {
    return {
      users: adminState.users || [],
      loading: adminState.loading,
      error: adminState.error,
      currentPage: adminState.pagination?.currentPage || 1,
      totalPages: adminState.pagination?.totalPages || 1,
      totalUsers: adminState.pagination?.totalUsers || 0,
      limit: adminState.pagination?.limit || 10,
    };
  }, [adminState]);
  
  // State management
  const [page, setPage] = useState(1);
  const [currentLimit, setCurrentLimit] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Search states
  const [nameSearchQuery, setNameSearchQuery] = useState('');
  const [emailSearchQuery, setEmailSearchQuery] = useState('');
  const [emailSearchError, setEmailSearchError] = useState(null);
  
  // Debounce refs
  const nameSearchTimeoutRef = useRef(null);
  const emailSearchTimeoutRef = useRef(null);
  
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modal states
  const [editingUser, setEditingUser] = useState(null);
  const [confirmUpdate, setConfirmUpdate] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Refill states
  const [refillingUser, setRefillingUser] = useState(null);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [refillAmount, setRefillAmount] = useState(0);
  const [refillLocalError, setRefillLocalError] = useState(null);
  
  const [formData, setFormData] = useState({ firstName: '', lastName: '', role: '' });
  const [localError, setLocalError] = useState(null);

  // Fetch users effect
  useEffect(() => {
    setLocalError(null);
    dispatch(fetchAllUsers({
      params: { 
        page,
        limit: currentLimit,
        sort: sortField,
        order: sortOrder,
        nameSearch: nameSearchQuery,
        emailSearch: emailSearchQuery,
        role: roleFilter
      }
    }));
  }, [dispatch, page, currentLimit, sortField, sortOrder, nameSearchQuery, emailSearchQuery, roleFilter]);

  // Search handlers with debouncing
  const handleNameSearchChange = (e) => {
    const value = e.target.value;
    setNameSearchQuery(value);
    
    if (nameSearchTimeoutRef.current) {
      clearTimeout(nameSearchTimeoutRef.current);
    }
    
    nameSearchTimeoutRef.current = setTimeout(() => {
      setPage(1);
    }, 500);
  };

  const handleEmailSearchChange = (e) => {
    const value = e.target.value;
    setEmailSearchQuery(value);
    setEmailSearchError(null);

    if (emailSearchTimeoutRef.current) {
      clearTimeout(emailSearchTimeoutRef.current);
    }
    
    emailSearchTimeoutRef.current = setTimeout(() => {
      if (value && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
        setEmailSearchError("Please enter a valid email format");
        return;
      }
      setPage(1);
    }, 500);
  };

  // Filter and sort handlers
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setPage(1);
  };

  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleClearFilters = () => {
    setNameSearchQuery('');
    setEmailSearchQuery('');
    setRoleFilter('');
    setSortField('createdAt');
    setSortOrder('desc');
    setPage(1);
    setEmailSearchError(null);
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleLimitChange = (e) => {
    setCurrentLimit(parseInt(e.target.value, 10));
    setPage(1);
  };

  // CRUD handlers
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({ 
      firstName: user.firstName, 
      lastName: user.lastName, 
      role: user.role 
    });
    setLocalError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setLocalError("First Name and Last Name cannot be empty.");
      return;
    }
    setConfirmUpdate(true);
  };

  const handleConfirmUpdate = async () => {
    setConfirmUpdate(false);
    try {
      await dispatch(updateUser({ 
        id: editingUser._id, 
        data: { 
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          role: formData.role 
        } 
      })).unwrap();
      setEditingUser(null);
      // Refresh data
      dispatch(fetchAllUsers({
        params: { 
          page, limit: currentLimit, sort: sortField, order: sortOrder,
          nameSearch: nameSearchQuery, emailSearch: emailSearchQuery, role: roleFilter
        }
      }));
    } catch (err) {
      setLocalError(err.message || "Failed to update user. Please try again.");
    }
  };
  
  const handleDeleteClick = (user) => {
    setDeletingUser(user);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmDelete(false);
    try {
      await dispatch(deleteUser({ id: deletingUser._id })).unwrap();
      setDeletingUser(null);
      // Refresh data
      dispatch(fetchAllUsers({
        params: { 
          page, limit: currentLimit, sort: sortField, order: sortOrder,
          nameSearch: nameSearchQuery, emailSearch: emailSearchQuery, role: roleFilter
        }
      }));
    } catch (err) {
      setLocalError("Failed to delete user. Please try again.");
    }
  };

  // Refill handlers
  const handleRefillClick = (user) => {
    setRefillingUser(user);
    setRefillAmount(0);
    setRefillLocalError(null);
    setShowRefillModal(true);
  };

  const handleRefillAmountChange = (e) => {
    const value = Number(e.target.value);
    setRefillAmount(value);
    setRefillLocalError(null);
  };

  const handleConfirmRefill = async () => {
    if (refillAmount < 0 || !Number.isInteger(refillAmount)) {
      setRefillLocalError("Refill amount must be a non-negative integer.");
      return;
    }
    if (refillingUser.checksLeft + refillAmount > refillingUser.originalChecks) {
      setRefillLocalError(`Refill amount would exceed user's original checks (${refillingUser.originalChecks}). Max refill: ${refillingUser.originalChecks - refillingUser.checksLeft}.`);
      return;
    }

    setShowRefillModal(false);
    try {
      await dispatch(refillUserChecks({ 
        id: refillingUser._id, 
        data: { refillAmount: refillAmount } 
      })).unwrap();
      setRefillingUser(null);
      // Refresh data
      dispatch(fetchAllUsers({
        params: { 
          page, limit: currentLimit, sort: sortField, order: sortOrder,
          nameSearch: nameSearchQuery, emailSearch: emailSearchQuery, role: roleFilter
        }
      }));
    } catch (err) {
      setLocalError(err.message || "Failed to refill user checks. Please try again.");
    }
  };

  // Helper functions
  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? 
        <FaSortAmountUp className="sort-icon active" /> : 
        <FaSortAmountDown className="sort-icon active" />;
    }
    return <FaSort className="sort-icon" />;
  };

  const getSortLabel = () => {
    const fieldLabels = {
      'firstName': 'Name',
      'email': 'Email',
      'createdAt': 'Created Date'
    };
    const fieldName = fieldLabels[sortField] || sortField;
    const orderText = sortOrder === 'asc' ? 'A-Z' : 'Z-A';
    return `${fieldName} (${orderText})`;
  };

  // Error state
  if (error && !loading) {
    return (
      <div className="admin-user-management">
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-user-management">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">
              <FaUsers className="title-icon" />
              User Management
            </h1>
            <p className="page-subtitle">
              Manage user accounts with advanced filtering and search capabilities
            </p>
          </div>
          {totalUsers > 0 && (
            <div className="stats-card">
              <div className="stat-item">
                <span className="stat-value">{totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Section */}
      <div className="controls-section">
        <div className="controls-header">
          <h3 className="controls-title">
            <FaFilter className="section-icon" />
            Filters & Search
          </h3>
          <button 
            onClick={handleClearFilters} 
            className="btn btn-ghost btn-sm clear-filters-btn"
            title="Clear all filters"
          >
            <FaEraser />
            Clear All
          </button>
        </div>

        <div className="controls-grid">
          {/* Search Controls */}
          <div className="control-group search-group">
            <label className="control-label">Search by Name</label>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Enter first or last name..."
                value={nameSearchQuery}
                onChange={handleNameSearchChange}
                className="search-input"
              />
            </div>
          </div>

          <div className="control-group search-group">
            <label className="control-label">Search by Email</label>
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="email"
                placeholder="Enter email address..."
                value={emailSearchQuery}
                onChange={handleEmailSearchChange}
                className={`search-input ${emailSearchError ? 'error' : ''}`}
              />
            </div>
            {emailSearchError && (
              <span className="error-message">{emailSearchError}</span>
            )}
          </div>

          {/* Filter Controls */}
          <div className="control-group">
            <label className="control-label">Role Filter</label>
            <select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              className="select-input"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="control-group">
            <label className="control-label">Sort By</label>
            <div className="sort-controls">
              <select
                value={sortField}
                onChange={(e) => handleSortChange(e.target.value)}
                className="select-input"
              >
                <option value="firstName">Name</option>
                <option value="email">Email</option>
                <option value="createdAt">Created Date</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="btn btn-ghost btn-sm sort-order-btn"
                title={`Currently: ${getSortLabel()}`}
              >
                {getSortIcon(sortField)}
              </button>
            </div>
          </div>

          <div className="control-group">
            <label className="control-label">Per Page</label>
            <select
              value={currentLimit}
              onChange={handleLimitChange}
              className="select-input"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(nameSearchQuery || emailSearchQuery || roleFilter || sortField !== 'createdAt' || sortOrder !== 'desc') && (
          <div className="active-filters">
            <span className="active-filters-label">Active filters:</span>
            <div className="filter-tags">
              {nameSearchQuery && (
                <span className="filter-tag">
                  Name: "{nameSearchQuery}"
                </span>
              )}
              {emailSearchQuery && (
                <span className="filter-tag">
                  Email: "{emailSearchQuery}"
                </span>
              )}
              {roleFilter && (
                <span className="filter-tag">
                  Role: {roleFilter}
                </span>
              )}
              <span className="filter-tag">
                Sort: {getSortLabel()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {localError && (
        <div className="alert alert-error">
          <FaExclamationTriangle />
          {localError}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <FaSpinner className="spinner" />
            <span>Loading users...</span>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="table-section">
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Checks</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    <td className="name-cell">
                      <div className="user-name">
                        {user.firstName} {user.lastName}
                      </div>
                    </td>
                    <td className="email-cell">{user.email}</td>
                    <td>
                      <span className={`role-badge role-badge--${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="checks-cell">
                      <div className="checks-info">
                        <span className="checks-current">{user.checksLeft}</span>
                        <span className="checks-divider">/</span>
                        <span className="checks-total">{user.originalChecks}</span>
                      </div>
                    </td>
                    <td className="date-cell">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        <button 
                          onClick={() => handleEditClick(user)} 
                          className="btn btn-sm btn-primary"
                          title="Edit user"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleRefillClick(user)} 
                          className="btn btn-sm btn-secondary"
                          title="Refill checks"
                          disabled={user.checksLeft === user.originalChecks}
                        >
                          <FaRedo />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(user)} 
                          className="btn btn-sm btn-danger"
                          title="Delete user"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    <div className="no-data-content">
                      <FaUsers className="no-data-icon" />
                      <p>No users found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalUsers > 0 && totalPages > 1 && (
          <div className="pagination-section">
            <div className="pagination-info">
              Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
            </div>
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="btn btn-ghost btn-sm pagination-btn"
              >
                Previous
              </button>
              
              <div className="page-numbers">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn btn-sm pagination-btn ${pageNum === currentPage ? 'active' : 'btn-ghost'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
                className="btn btn-ghost btn-sm pagination-btn"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Edit User</h2>
              <button onClick={() => setEditingUser(null)} className="modal-close">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group form-group--full">
                  <label htmlFor="role">Role</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="form-hint">
                    Admin role grants access to all admin features
                  </p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setEditingUser(null)} className="btn btn-ghost">
                Cancel
              </button>
              <button 
                onClick={handleUpdate} 
                className="btn btn-primary"
                disabled={!formData.firstName.trim() || !formData.lastName.trim()}
              >
                <FaCheck /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmUpdate && (
        <div className="modal-overlay">
          <div className="modal modal-confirm">
            <div className="modal-header">
              <FaExclamationTriangle className="modal-icon" />
              <h2 className="modal-title">Confirm Changes</h2>
            </div>
            <div className="modal-body">
              <p>You are about to update <strong>{editingUser.email}</strong>:</p>
              <div className="changes-list">
                {editingUser.firstName !== formData.firstName && (
                  <div className="change-item">
                    <span className="change-label">First Name:</span>
                    <span className="change-value">
                      {editingUser.firstName} → {formData.firstName}
                    </span>
                  </div>
                )}
                {editingUser.lastName !== formData.lastName && (
                  <div className="change-item">
                    <span className="change-label">Last Name:</span>
                    <span className="change-value">
                      {editingUser.lastName} → {formData.lastName}
                    </span>
                  </div>
                )}
                {editingUser.role !== formData.role && (
                  <div className="change-item">
                    <span className="change-label">Role:</span>
                    <span className="change-value">
                      {editingUser.role} → {formData.role}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setConfirmUpdate(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleConfirmUpdate} className="btn btn-primary">
                <FaCheck /> Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal modal-confirm modal-danger">
            <div className="modal-header">
              <FaExclamationTriangle className="modal-icon" />
              <h2 className="modal-title">Confirm Deletion</h2>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{deletingUser.email}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setConfirmDelete(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-danger">
                <FaTrash /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefillModal && refillingUser && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Refill Checks</h2>
              <button onClick={() => setShowRefillModal(false)} className="modal-close">
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="refill-info">
                <h4>User: {refillingUser.email}</h4>
                <p>Current checks: <strong>{refillingUser.checksLeft}</strong> / {refillingUser.originalChecks}</p>
                <p>Maximum refill: <strong>{refillingUser.originalChecks - refillingUser.checksLeft}</strong></p>
              </div>
              <div className="form-group">
                <label htmlFor="refillAmount">Amount to Add</label>
                <input
                  type="number"
                  id="refillAmount"
                  name="refillAmount"
                  value={refillAmount}
                  onChange={handleRefillAmountChange}
                  min="0"
                  max={refillingUser.originalChecks - refillingUser.checksLeft}
                  className="form-input"
                />
                {refillLocalError && (
                  <span className="error-message">{refillLocalError}</span>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowRefillModal(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button 
                onClick={handleConfirmRefill} 
                className="btn btn-primary"
                disabled={refillAmount <= 0 || refillAmount > (refillingUser.originalChecks - refillingUser.checksLeft)}
              >
                <FaRedo /> Add Checks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;