import './ManageQuotes.scss';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserQuotes } from '../../redux/slices/adminSlice';

const ManageQuotes = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { userQuotes, loading, error } = useSelector((state) => state.admin);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!email.trim()) return;
    dispatch(fetchUserQuotes(email));
    setHasSearched(true);
  };

  return (
    <div className="manage-quotes">
      <h1>Manage Quotes by Email</h1>
      <div className="search-bar">
        <input
          type="email"
          placeholder="Enter user email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Loading */}
      {loading && <p className="status-message">Loading...</p>}

      {/* Error */}
      {!loading && error && (
        <p className="status-message error">Error: {error}</p>
      )}

      {/* Empty State */}
      {!loading && hasSearched && Array.isArray(userQuotes) && userQuotes.length === 0 && !error && (
        <p className="status-message">No quotes found for this user.</p>
      )}

      {/* Quotes List */}
      {!loading && !error && Array.isArray(userQuotes) && userQuotes.length > 0 && (
        <div className="quotes-list">
          {userQuotes.map((q) => (
            <div className="quote-card" key={q._id}>
              <p><strong>Vehicle Reg:</strong> {q.vehicleReg}</p>
              <p><strong>Make:</strong> {q.vehicleMake}</p>
              <p><strong>Model:</strong> {q.vehicleModel}</p>
              <p><strong>Postcode:</strong> {q.postcode}</p>
              <p><strong>Status:</strong> {q.status}</p>
              <p><strong>Offered Price:</strong> £{q.price}</p>
              <p><strong>Created At:</strong> {new Date(q.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageQuotes;
