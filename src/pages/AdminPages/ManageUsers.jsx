import './ManageUsers.scss';
import { useEffect, useState } from 'react';

// Dummy user data
const dummyUsers = [
  { _id: '1', name: 'John Doe', email: 'john@example.com', checksLeft: 5, role: 'user' },
  { _id: '2', name: 'Jane Admin', email: 'jane@example.com', checksLeft: 10, role: 'admin' },
  { _id: '3', name: 'Ali Khan', email: 'ali@example.com', checksLeft: 0, role: 'user' },
  { _id: '4', name: 'Sara Smith', email: 'sara@example.com', checksLeft: 2, role: 'moderator' },
  { _id: '5', name: 'Dev Patel', email: 'dev@example.com', checksLeft: 8, role: 'admin' },
  // Add more if needed
];

const ManageUsers = () => {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [minChecks, setMinChecks] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const handleDelete = (id) => {
    const updated = filteredUsers.filter((u) => u._id !== id);
    setFilteredUsers(updated);
  };

  useEffect(() => {
    let users = [...dummyUsers];

    if (query.trim()) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      );
    }

    if (roleFilter) {
      users = users.filter((u) => u.role === roleFilter);
    }

    if (minChecks) {
      users = users.filter((u) => u.checksLeft >= parseInt(minChecks));
    }

    setFilteredUsers(users);
  }, [query, roleFilter, minChecks]);

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
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
