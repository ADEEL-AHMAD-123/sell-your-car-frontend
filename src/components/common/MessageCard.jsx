import React from 'react';
import './MessageCard.scss'; 

const MessageCard = ({ title, message, onConfirm, confirmLabel = "OK" }) => {
  return (
    <div className="message-card">
      <div className="message-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div> 
  );
};

export default MessageCard;
