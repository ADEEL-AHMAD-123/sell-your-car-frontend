import React from 'react';
import { X, AlertTriangle, Check, Package } from 'lucide-react';
import './ConfirmModal.scss';

const ConfirmModal = ({ 
  isOpen = false, 
  onConfirm, 
  onCancel, 
  message, 
  title = "Confirm Action", 
  type = "default",
  loading = false,
  error = null 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="modal-icon danger" size={32} />;
      case 'success':
        return <Package className="modal-icon success" size={32} />;
      default:
        return <Check className="modal-icon default" size={32} />;
    }
  };

  const getConfirmButtonText = () => {
    if (loading) return 'Processing...';
    switch (type) {
      case 'success':
        return 'Yes, Mark as Collected';
      case 'danger':
        return 'Yes, Delete';
      default:
        return 'Confirm';
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} disabled={loading}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          {getIcon()}
          <h2 className="modal-title">{title}</h2>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
          {error && (
            <div className="modal-error">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="btn btn-cancel" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className={`btn btn-confirm ${type}`} 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <div className="btn-spinner"></div>}
            {getConfirmButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;