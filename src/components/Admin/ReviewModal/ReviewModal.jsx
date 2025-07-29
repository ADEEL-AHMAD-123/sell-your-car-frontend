import React, { useState } from 'react';
import './ReviewModal.scss';

const ReviewModal = ({ quote, onSubmit, onClose, loading, error }) => {
  const [adminOfferPrice, setAdminOfferPrice] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ adminOfferPrice, adminMessage });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Review Quote for {quote?.regNumber}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder="Admin Offer Price"
            value={adminOfferPrice}
            onChange={(e) => setAdminOfferPrice(e.target.value)}
            required
          />
          <textarea
            placeholder="Admin Message"
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            required
          ></textarea>

          {error && <p className="error-text">{error}</p>}

          <div className="actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
