import React from 'react';
import './MessageCard.scss';

const MessageCard = ({ title, message, buttons = [], onClose }) => {
  return (
    <div className="message-card-overlay" onClick={onClose}>
      <div className="message-card-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose} aria-label="Close modal">×</button>
        {title && <h2>{title}</h2>}
        {message && <p>{message}</p>}

        {buttons.length > 0 && (
          <div className="button-group">
            {buttons.map((btn, index) => (
              <button key={index} onClick={btn.onClick}>
                {btn.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCard;
