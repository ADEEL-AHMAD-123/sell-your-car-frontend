import React from 'react';
import './MessageCard.scss';

const MessageCard = ({ title, message, buttons = [], onClose }) => {
  return (
    <div className="message-card" onClick={onClose}>
      <div className="message-content" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p>{message}</p>

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
