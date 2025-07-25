import './ManageUsers.scss';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers } from '../../redux/slices/adminSlice';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users = [], loading, error } = useSelector((state) => state.admin);

  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [minChecks, setMinChecks] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!users || !Array.isArray(users)) return;

    let filtered = [...users];

    if (query.trim()) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(query.toLowerCase()) ||
          u.email?.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    if (minChecks) {
      const min = parseInt(minChecks);
      if (!isNaN(min)) {
        filtered = filtered.filter((u) => u.checksLeft >= min);
      }
    }

    setFilteredUsers(filtered);
  }, [query, roleFilter, minChecks, users]);

  const handleDelete = (id) => {
    const updated = filteredUsers.filter((u) => u._id !== id);
    setFilteredUsers(updated);
    // Optionally dispatch a delete thunk
  };

  return (
    <div className="manage-users">
      <h1>Manage Users</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
        </select>
        <input
          type="number"
          placeholder="Min Checks Left"
          value={minChecks}
          onChange={(e) => setMinChecks(e.target.value)}
        />
      </div>

      <div className="user-table">
        {loading ? (
          <div className="status-message">Loading users...</div>
        ) : error ? (
          <div className="status-message error">Error loading users: {error}</div>
        ) : (
          <>
            {users.length === 0 ? (
              <div className="status-message">No users available.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Checks Left</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.checksLeft}</td>
                        <td>{u.role}</td>
                        <td>
                          <button className="edit">Edit</button>
                          <button className="delete" onClick={() => handleDelete(u._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="status-message">
                        No users match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
