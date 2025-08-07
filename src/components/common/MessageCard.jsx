import React from 'react';
import './MessageCard.scss';

// Add type prop to change card's visual style.
const MessageCard = ({ title, message, buttons, type = 'info' }) => {
  return (
    <div className="message-card-overlay">
      <div className={`message-card card-${type}`}>
        <div className="card-header">
          {type === 'error' && <span className="icon">⚠️</span>}
          {type === 'success' && <span className="icon">✅</span>}
          <h3>{title}</h3>
        </div>
        <p>{message}</p>
        <div className="card-buttons">
          {buttons &&
            buttons.map((btn, index) => (
              <button key={index} onClick={btn.onClick}>
                {btn.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MessageCard;

