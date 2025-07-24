import './ManageQuotes.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const dummyQuotes = [
  {
    _id: '1',
    vehicleReg: 'AB12 CDE',
    postcode: 'SW1A 1AA',
    vehicleMake: 'Toyota',
    vehicleModel: 'Corolla',
    status: 'Pending',
    price: '£1,200',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    vehicleReg: 'XY34 ZYX',
    postcode: 'E1 6AN',
    vehicleMake: 'Ford',
    vehicleModel: 'Focus',
    status: 'Completed',
    price: '£850',
    createdAt: new Date().toISOString(),
  },
];

const ManageQuotes = () => {
  const [userId, setUserId] = useState('');
  const [quotes, setQuotes] = useState(dummyQuotes);

  const fetchQuotes = async () => {
    try {
      const res = await axios.get(`/api/admin/quotes/${userId}`);
      setQuotes(res.data.data.quotes);
    } catch (err) {
      console.error(err);
      alert('Failed to fetch quotes.');
    }
  };

  return (
    <div className="manage-quotes">
      <h1>Manage User Quotes</h1>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <button onClick={fetchQuotes}>Fetch Quotes</button>
      </div>

      <div className="quote-list">
        {quotes.length === 0 ? (
          <p>No quotes found.</p>
        ) : (
          quotes.map((q) => (
            <div className="quote-card" key={q._id}>
              <p><strong>Vehicle Reg:</strong> {q.vehicleReg}</p>
              <p><strong>Make:</strong> {q.vehicleMake}</p>
              <p><strong>Model:</strong> {q.vehicleModel}</p>
              <p><strong>Postcode:</strong> {q.postcode}</p>
              <p><strong>Status:</strong> {q.status}</p>
              <p><strong>Offered Price:</strong> {q.price}</p>
              <p><strong>Created At:</strong> {new Date(q.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ManageQuotes;
