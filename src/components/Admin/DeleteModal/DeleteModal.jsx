import React from 'react';
import Spinner from '../../common/Spinner';
import './DeleteModal.scss';

const DeleteModal = ({
  title,
  vehicle,
  status,
  onClose,
  onConfirm,
  loading = false,
  error = null
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onClose();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="delete-modal-overlay" onClick={handleBackdropClick}>
      <div className="delete-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="delete-modal__header">
          <h2 id="modal-title" className="delete-modal__title">{title}</h2>
          <button 
            className="delete-modal__close" 
            onClick={onClose}
            aria-label="Close modal"
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        <div className="delete-modal__body">
          <p className="delete-modal__message">
            Are you sure you want to delete this quote? This action cannot be undone.
          </p>
          
          <div className="delete-modal__details">
            <div className="detail-item">
              <span className="detail-label">Vehicle:</span>
              <span className="detail-value">{vehicle || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{status || 'N/A'}</span>
            </div>
          </div>
          
          {loading && (
            <div className="delete-modal__loading">
              <Spinner />
              <p>Deleting quote...</p>
            </div>
          )}
          
          {error && (
            <div className="delete-modal__error" role="alert">
              <span className="error-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="delete-modal__actions">
          <button
            className="btn btn--secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Quote'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;