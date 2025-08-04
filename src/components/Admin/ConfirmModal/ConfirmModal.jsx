import React from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import './ConfirmModal.scss';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message, title = "Confirm Action", type = "default" }) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle className="modal-icon danger" />;
      case 'success':
        return <Check className="modal-icon success" />;
      default:
        return <AlertTriangle className="modal-icon default" />;
    }
  };

  return (
    <div className="confirm-modal-overlay" onClick={onCancel}>
      <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          {getIcon()}
          <h2 className="modal-title">{title}</h2>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-confirm" onClick={onConfirm}>
            Yes, Mark as Collected
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;