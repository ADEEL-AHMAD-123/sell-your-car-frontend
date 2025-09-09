import React, { useState, useEffect, useCallback } from 'react';
import './ClientContactModal.scss';

const ClientContactModal = ({ quote, onClose }) => {
  const [copyMessage, setCopyMessage] = useState('');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    const timer = copyMessage ? setTimeout(() => setCopyMessage(''), 3000) : null;
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (timer) clearTimeout(timer);
    };
  }, [handleKeyDown, copyMessage]);

  const copyToClipboard = async (text, type) => {
    if (!text || text === 'N/A') return;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage(`${type} copied successfully!`);
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopyMessage(`${type} copied successfully!`);
    }
  };

  const contact = {
    name: quote?.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A',
    email: quote?.user?.email || 'N/A',
    phone: quote?.user?.phone || 'N/A',
  };

  return (
    <div className="client-modal-overlay" onClick={handleBackdropClick}>
      <div 
        className="client-modal" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="client-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="client-modal__header">
          <h2 id="client-modal-title" className="client-modal__title">
            Client Contact
          </h2>
          <button 
            className="client-modal__close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="client-modal__body">
          {/* Name Section */}
          <div className="contact-row">
            <div className="contact-info">
              <span className="contact-label">Name</span>
              <span className={`contact-value ${contact.name === 'N/A' ? 'unavailable' : ''}`}>
                {contact.name}
              </span>
            </div>
            {contact.name !== 'N/A' && (
              <button 
                className="btn-copy" 
                onClick={() => copyToClipboard(contact.name, 'Name')}
                aria-label="Copy name"
              >
                Copy
              </button>
            )}
          </div>

          {/* Email Section */}
          <div className="contact-row">
            <div className="contact-info">
              <span className="contact-label">Email</span>
              <span className={`contact-value ${contact.email === 'N/A' ? 'unavailable' : ''}`}>
                {contact.email}
              </span>
            </div>
            {contact.email !== 'N/A' && (
              <div className="contact-actions">
                <button 
                  className="btn-copy" 
                  onClick={() => copyToClipboard(contact.email, 'Email')}
                  aria-label="Copy email"
                >
                  Copy
                </button>
                <a
                  href={`mailto:${contact.email}`}
                  className="btn-action"
                  aria-label="Send email"
                >
                  Email
                </a>
              </div>
            )}
          </div>

          {/* Phone Section */}
          <div className="contact-row">
            <div className="contact-info">
              <span className="contact-label">Phone</span>
              <span className={`contact-value ${contact.phone === 'N/A' ? 'unavailable' : ''}`}>
                {contact.phone}
              </span>
            </div>
            {contact.phone !== 'N/A' && (
              <div className="contact-actions">
                <button 
                  className="btn-copy" 
                  onClick={() => copyToClipboard(contact.phone, 'Phone')}
                  aria-label="Copy phone"
                >
                  Copy
                </button>
                <a
                  href={`tel:${contact.phone}`}
                  className="btn-action"
                  aria-label="Call phone"
                >
                  Call
                </a>
              </div>
            )}
          </div>

          {copyMessage && (
            <div className="copy-notification" role="status" aria-live="polite">
              ✓ {copyMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientContactModal;