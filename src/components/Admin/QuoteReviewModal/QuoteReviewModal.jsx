import React, { useEffect, useState } from 'react';
import './QuoteReviewModal.scss'
const QuoteReviewModal = ({ quoteId, onClose, onSubmitReview, loading, error }) => {
    const [adminOfferPrice, setPrice] = useState('');
    const [adminMessage, setMessage] = useState('');
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmitReview({ adminOfferPrice, adminMessage });
    };
  
    return (
      <div className="quote-review-modal">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>Submit Admin Review</h2>
  
          <form onSubmit={handleSubmit}>
            <label>Offer Price</label>
            <input
              type="number"
              value={adminOfferPrice}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
  
            <label>Message</label>
            <textarea
              value={adminMessage}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
  
            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default QuoteReviewModal;
  