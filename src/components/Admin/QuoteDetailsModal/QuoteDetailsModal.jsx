import React, { useEffect } from 'react';
import './QuoteDetailsModal.scss';

const QuoteDetailsModal = ({ quote, onClose, pageType = 'manual', customTitle = null }) => {
  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Get dynamic title based on page type
  const getModalTitle = () => {
    if (customTitle) return customTitle;
    
    switch (pageType) {
      case 'manual':
        return 'Manual Quote Request Details';
      case 'accepted':
        return 'Accepted Quote Details';
      case 'pending':
        return 'Pending Quote Details';
      case 'rejected':
        return 'Rejected Quote Details';
      case 'completed':
        return 'Completed Quote Details';
      default:
        return 'Quote Details';
    }
  };

  // Get summary section title based on page type
  const getSummaryTitle = () => {
    switch (pageType) {
      case 'manual':
        return 'Request Summary';
      case 'accepted':
        return 'Quote Summary';
      case 'pending':
        return 'Quote Summary';
      case 'rejected':
        return 'Quote Summary';
      case 'completed':
        return 'Final Summary';
      default:
        return 'Summary';
    }
  };

  if (!quote) return null;

  const {
    // DVLA fields
    regNumber, make, model, year, fuelType, colour, wheelPlan, engineCapacity,
    revenueWeight, co2Emissions, taxStatus, motStatus, euroStatus, realDrivingEmissions,
    typeApproval, markedForExport, artEndDate, taxDueDate, monthOfFirstRegistration,
    yearOfManufacture, dateOfLastV5CIssued, dvlaFetchedAt, lastUpdatedAt,

    // App-specific fields
    estimatedScrapPrice, images = [], userEstimatedPrice, userProvidedWeight,
    manualQuoteReason, message, user,
  } = quote;

  const renderField = (label, value, unit = '') => {
    if (value === undefined || value === null || value === '') return null;
    
    // Format the value appropriately
    let formattedValue = String(value);
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      formattedValue = value ? 'Yes' : 'No';
    }
    
    // Handle dates
    if (label.toLowerCase().includes('date') && value && typeof value === 'string') {
      try {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          formattedValue = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        }
      } catch (e) {
        // Keep original value if date parsing fails
      }
    }

    return (
      <p key={label}>
        <strong>{label}:</strong> {formattedValue}{unit}
      </p>
    );
  };

  const formatCurrency = (amount) => {
    if (!amount) return null;
    return `£${parseFloat(amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="quote-details-modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <button className="close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        
        <h2>{getModalTitle()}</h2>

        {/* Group 0: Key Summary Info */}
        <section className="details-section top-summary">
          <h3>{getSummaryTitle()}</h3>
          {renderField('Registration Number', regNumber)}
          {renderField('Manual Quote Reason', manualQuoteReason)}
          {renderField('Revenue Weight', revenueWeight, ' kg')}
          {renderField('Offered Price', formatCurrency(estimatedScrapPrice))}
        </section>

        {/* Group 1: Client Info */}
        {(user?.firstName || user?.lastName || user?.email || user?.phone) && (
          <section className="details-section">
            <h3>Client Information</h3>
            {(user?.firstName || user?.lastName) && (
              <p><strong>Client Name:</strong> {`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}</p>
            )}
            {user?.email && (
              <p><strong>Email:</strong> {user.email}</p>
            )}
            {user?.phone && (
              <p><strong>Phone:</strong> {user.phone}</p>
            )}
          </section>
        )}

        {/* Group 2: Vehicle Info */}
        <section className="details-section">
          <h3>Vehicle Details</h3>
          {renderField('Make', make)}
          {renderField('Model', model)}
          {renderField('Year', year)}
          {renderField('Fuel Type', fuelType)}
          {renderField('Colour', colour)}
          {renderField('Wheel Plan', wheelPlan)}
          {renderField('Engine Capacity', engineCapacity, ' cc')}
          {renderField('CO₂ Emissions', co2Emissions, ' g/km')}
          {renderField('Tax Status', taxStatus)}
          {renderField('MOT Status', motStatus)}
          {renderField('Euro Status', euroStatus)}
          {renderField('Real Driving Emissions', realDrivingEmissions)}
          {renderField('Type Approval', typeApproval)}
          {renderField('Marked for Export', markedForExport)}
          {renderField('Tax Due Date', taxDueDate)}
          {renderField('ART End Date', artEndDate)}
          {renderField('Month of First Registration', monthOfFirstRegistration)}
          {renderField('Year of Manufacture', yearOfManufacture)}
          {renderField('Date of Last V5C Issued', dateOfLastV5CIssued)}
          {renderField('DVLA Fetched At', formatDateTime(dvlaFetchedAt))}
          {renderField('Last Updated At', formatDateTime(lastUpdatedAt))}
        </section>

        {/* Group 3: User Submitted Info */}
        {(userEstimatedPrice || userProvidedWeight || message) && (
          <section className="details-section">
            <h3>User Provided Information</h3>
            {renderField('User Estimated Price', formatCurrency(userEstimatedPrice))}
            {renderField('User Provided Weight', userProvidedWeight, ' kg')}
            {renderField('Client Message', message)}
          </section>
        )}

        {/* Group 4: Uploaded Images */}
        <section className="images-section">
          <h3>Uploaded Images</h3>
          {images.length === 0 ? (
            <p>No images uploaded for this quote request.</p>
          ) : (
            <div className="image-grid">
              {images.map((src, i) => (
                <img 
                  key={i} 
                  src={src} 
                  alt={`Vehicle image ${i + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default QuoteDetailsModal;