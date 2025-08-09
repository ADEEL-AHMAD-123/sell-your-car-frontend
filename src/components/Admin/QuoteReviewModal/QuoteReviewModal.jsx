import React, { useEffect, useState } from 'react';
import './QuoteReviewModal.scss';

const QuoteReviewModal = ({ quoteId, quote, onClose, onSubmitReview, loading, error }) => {
  const [adminOfferPrice, setPrice] = useState('');
  const [adminMessage, setMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [priceError, setPriceError] = useState('');

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (showConfirmation) {
          setShowConfirmation(false);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, showConfirmation]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Validate form
  useEffect(() => {
    const price = parseFloat(adminOfferPrice);
    const isValidPrice = adminOfferPrice && !isNaN(price) && price > 0;
    
    setIsFormValid(isValidPrice);
    
    // Price validation
    if (adminOfferPrice && (isNaN(price) || price <= 0)) {
      setPriceError('Please enter a valid price greater than £0');
    } else if (adminOfferPrice && price > 50000) {
      setPriceError('Price seems unusually high. Please double-check.');
    } else {
      setPriceError('');
    }
  }, [adminOfferPrice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      setShowConfirmation(true);
    }
  };

  const handleConfirmSubmit = () => {
    onSubmitReview({ 
      adminOfferPrice: parseFloat(adminOfferPrice), 
      adminMessage: adminMessage.trim() 
    });
    setShowConfirmation(false);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      if (showConfirmation) {
        setShowConfirmation(false);
      } else {
        onClose();
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return `£${parseFloat(amount).toLocaleString('en-GB', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    // Allow empty string or valid decimal numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };

  return (
    <>
      <div className="quote-review-modal" onClick={handleBackdropClick}>
        <div className="modal-content">
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
          
          <div className="modal-header">
            <h2>Submit Admin Review</h2>
            <div className="quote-info">
              {quote?.regNumber && (
                <span className="reg-number">{quote.regNumber}</span>
              )}
              {quote?.make && quote?.model && (
                <span className="vehicle-info">{quote.make} {quote.model}</span>
              )}
            </div>
          </div>

          <div className="important-notice">
            <div className="notice-icon">⚠️</div>
            <div className="notice-content">
              <strong>Important:</strong> After submitting this review, the client will automatically receive an email with your offer details. Please double-check all information before submitting.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="review-form">
            <div className="form-group">
              <label htmlFor="adminOfferPrice" className="required">
                Offer Price (£)
              </label>
              <div className="price-input-container">
                <span className="currency-symbol">£</span>
                <input
                  id="adminOfferPrice"
                  type="text"
                  value={adminOfferPrice}
                  onChange={handlePriceChange}
                  placeholder="0.00"
                  className={priceError ? 'error' : ''}
                  required
                />
              </div>
              {priceError && <span className="field-error">{priceError}</span>}
              {adminOfferPrice && !priceError && (
                <div className="price-preview">
                  Offer: {formatCurrency(adminOfferPrice)}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="adminMessage">
                Additional Message to Client
                <span className="optional">(Optional)</span>
              </label>
              <textarea
                id="adminMessage"
                value={adminMessage}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add any specific details, terms, or instructions for the client..."
                rows="4"
                maxLength="500"
              />
              <div className="char-counter">
                {adminMessage.length}/500 characters
              </div>
              <div className="message-help">
                💡 Only add a message if you need to provide specific details, terms, or special instructions to the client.
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">❌</span>
                {error}
              </div>
            )}

            <div className="form-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Submitting...
                  </>
                ) : (
                  'Review & Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="confirmation-overlay" onClick={handleBackdropClick}>
          <div className="confirmation-modal">
            <div className="confirmation-header">
              <h3>Confirm Quote Review</h3>
            </div>
            
            <div className="confirmation-content">
              <div className="confirmation-warning">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  <strong>Please double-check your details!</strong>
                  <p>Once submitted, the client will immediately receive an email with this offer.</p>
                </div>
              </div>

              <div className="review-summary">
                <h4>Review Summary:</h4>
                <div className="summary-item">
                  <span className="label">Vehicle:</span>
                  <span className="value">
                    {quote?.regNumber} - {quote?.make} {quote?.model}
                  </span>
                </div>
                <div className="summary-item price-item">
                  <span className="label">Your Offer:</span>
                  <span className="value price-value">
                    {formatCurrency(adminOfferPrice)}
                  </span>
                </div>
                {adminMessage.trim() && (
                  <div className="summary-item">
                    <span className="label">Message:</span>
                    <span className="value message-preview">
                      "{adminMessage.trim()}"
                    </span>
                  </div>
                )}
              </div>

              <div className="email-notice">
                <div className="notice-icon">📧</div>
                <p>The client will receive an email containing:</p>
                <ul>
                  <li>Your offer price</li>
                  <li>Vehicle details</li>
                  <li>Next steps for acceptance</li>
                  {adminMessage.trim() && <li>Your additional message</li>}
                </ul>
              </div>
            </div>

            <div className="confirmation-actions">
              <button 
                type="button" 
                className="back-btn" 
                onClick={() => setShowConfirmation(false)}
              >
                ← Go Back to Edit
              </button>
              <button 
                type="button" 
                className="confirm-btn"
                onClick={handleConfirmSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  '✓ Confirm & Send to Client'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteReviewModal;