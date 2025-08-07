import React, { useEffect } from 'react';
import Logo from '../common/Logo/Logo';
import './MessageCard.scss';

const MessageCard = ({ title, message, buttons, type = 'info', onClose }) => {
  
  // Prevent browser navigation and interactions
  useEffect(() => {
    const handlePopState = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.history.pushState(null, null, window.location.pathname);
      return false;
    };

    const handleKeyDown = (e) => {
      // Disable ALL keyboard interactions
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const handleClick = (e) => {
      // Only allow clicks on the message card itself
      if (!e.target.closest('.message-card')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }
    };

    const handleMouseDown = (e) => {
      if (!e.target.closest('.message-card')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleTouchStart = (e) => {
      if (!e.target.closest('.message-card')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    // Add event listeners with capture phase for maximum control
    window.addEventListener('popstate', handlePopState, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyDown, true);
    document.addEventListener('keypress', handleKeyDown, true);
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('touchstart', handleTouchStart, true);
    window.addEventListener('beforeunload', handleBeforeUnload, true);
    
    // Push current state multiple times to prevent back navigation
    window.history.pushState(null, null, window.location.pathname);
    window.history.pushState(null, null, window.location.pathname);
    
    // Prevent scrolling and interactions on body and document
    document.body.style.overflow = 'hidden';
    document.body.style.pointerEvents = 'none';
    document.documentElement.style.overflow = 'hidden';
    
    // Add blur effect to everything except our modal
    const rootElement = document.getElementById('root') || document.body;
    rootElement.classList.add('message-card-blur-background');

    return () => {
      // Cleanup
      window.removeEventListener('popstate', handlePopState, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyDown, true);
      document.removeEventListener('keypress', handleKeyDown, true);
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('touchstart', handleTouchStart, true);
      window.removeEventListener('beforeunload', handleBeforeUnload, true);
      
      document.body.style.overflow = 'unset';
      document.body.style.pointerEvents = 'auto';
      document.documentElement.style.overflow = 'unset';
      rootElement.classList.remove('message-card-blur-background');
    };
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <div className="card-icon error-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
              <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'success':
        return (
          <div className="card-icon success-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
        );
      case 'warning':
        return (
          <div className="card-icon warning-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="17" r="1" fill="currentColor"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="card-icon info-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="16" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="8" r="1" fill="currentColor"/>
            </svg>
          </div>
        );
    }
  };

  const handleButtonClick = (buttonAction) => {
    if (buttonAction) {
      buttonAction();
    }
  };

  return (
    <div 
      className="message-card-overlay" 
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="message-card-backdrop"></div>
      <div className={`message-card card-${type}`} style={{ pointerEvents: 'auto' }}>
        
        {/* Card Header with Logo */}
        <div className="card-header">
          <div className="card-logo">
            <Logo />
          </div>
          <div className="card-icon-container">
            {getIcon()}
          </div>
        </div>

        {/* Card Content */}
        <div className="card-content">
          <h2 className="card-title">{title}</h2>
          <p className="card-message">{message}</p>
        </div>

        {/* Card Actions */}
        <div className="card-actions">
          {buttons && buttons.length > 0 && (
            <div className="button-group">
              {buttons.map((btn, index) => (
                <button
                  key={index}
                  className={`card-button ${index === 0 ? 'primary' : 'secondary'}`}
                  onClick={() => handleButtonClick(btn.onClick)}
                  type="button"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="card-decoration">
          <div className="decoration-circle decoration-1"></div>
          <div className="decoration-circle decoration-2"></div>
          <div className="decoration-circle decoration-3"></div>
        </div>
      </div>
    </div>
  );
};

export default MessageCard;