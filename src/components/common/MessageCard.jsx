import React from 'react';
import './MessageCard.scss';

const MessageCard = ({ title, message, buttons = [] }) => {
  return (
    <div className="message-card">
      <div className="message-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="button-group">
          {buttons.map((btn, index) => (
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
