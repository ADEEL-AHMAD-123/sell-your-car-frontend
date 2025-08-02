// src/components/common/ConfirmModal.jsx
import React from 'react';
import './ConfirmModal.scss';

const ConfirmModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal">
        <h2>Confirm Action</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="btn-cancel" onClick={onCancel}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm}>Yes, Mark as Collected</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
