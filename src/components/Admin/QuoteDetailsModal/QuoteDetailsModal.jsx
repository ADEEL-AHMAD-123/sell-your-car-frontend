import React, { useEffect, useState } from 'react';
import './QuoteDetailsModal.scss';

const QuoteDetailsModal = ({ quote, onClose, pageType, customTitle = null }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (selectedImageIndex !== null) {
          setSelectedImageIndex(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose, selectedImageIndex]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Handle gallery backdrop click
  const handleGalleryBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      setSelectedImageIndex(null);
    }
  };

  // Handle keyboard navigation in gallery
  useEffect(() => {
    if (selectedImageIndex === null) return;

    const handleKeyNavigation = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevImage();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyNavigation);
    return () => document.removeEventListener('keydown', handleKeyNavigation);
  }, [selectedImageIndex, quote.images]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Navigation functions for image gallery
  const goToPrevImage = () => {
    if (quote.images && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (quote.images && selectedImageIndex < quote.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

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
    estimatedScrapPrice, finalPrice, images = [], userEstimatedPrice, userProvidedWeight,
    manualQuoteReason, message, user, collectionDetails, adminMessage, rejectionReason,
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
    if (!amount && amount !== 0) return null;
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

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Determine which price to show based on page type
  const getPriceToShow = () => {
    if (pageType === 'accepted' && finalPrice) {
      return formatCurrency(finalPrice);
    }
    return formatCurrency(estimatedScrapPrice);
  };

  const getPriceLabel = () => {
    if (pageType === 'accepted' && finalPrice) {
      return 'Final Price';
    }
    return 'Offered Price';
  };

  // Handle image loading error
  const handleImageError = (e) => {
    e.target.parentElement.style.display = 'none';
  };

  return (
    <>
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
            {renderField(getPriceLabel(), getPriceToShow())}
          </section>

          {/* Collection Details Section - Only show for accepted quotes with collection details */}
          {pageType === 'accepted' && collectionDetails && (
            <section className="details-section collection-details-section">
              <h3>Collection Details</h3>
              {collectionDetails.pickupDate && (
                <p><strong>Pickup Date:</strong> {formatDate(collectionDetails.pickupDate)}</p>
              )}
              {collectionDetails.contactNumber && (
                <p><strong>Contact Number:</strong> {collectionDetails.contactNumber}</p>
              )}
              {collectionDetails.address && (
                <p><strong>Collection Address:</strong> {collectionDetails.address}</p>
              )}
              <p>
                <strong>Collection Status:</strong> 
                <span className={`collection-status ${collectionDetails.collected ? 'collected' : 'pending'}`}>
                  {collectionDetails.collected ? 'Collected' : 'Pending Collection'}
                </span>
              </p>
            </section>
          )}

          {/* Client Info */}
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

          {/* Vehicle Info */}
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

          {/* User Submitted Info */}
          {(userEstimatedPrice || userProvidedWeight || message) && (
            <section className="details-section">
              <h3>User Provided Information</h3>
              {renderField('User Estimated Price', formatCurrency(userEstimatedPrice))}
              {renderField('User Provided Weight', userProvidedWeight, ' kg')}
              {renderField('Client Message', message)}
            </section>
          )}

          {/* Admin Messages */}
          {(adminMessage || rejectionReason) && (
            <section className="details-section">
              <h3>Admin Notes</h3>
              {renderField('Admin Message', adminMessage)}
              {renderField('Rejection Reason', rejectionReason)}
            </section>
          )}

          {/* Uploaded Images - Improved Section */}
          <section className="images-section">
            <h3>Vehicle Images</h3>
            {images.length === 0 ? (
              <div className="no-images">
                <div className="no-images-icon">📸</div>
                <p>No images uploaded for this quote request</p>
              </div>
            ) : (
              <>
                <div className="images-header">
                  <span className="image-count">{images.length} image{images.length !== 1 ? 's' : ''}</span>
                  <button 
                    className="view-all-btn"
                    onClick={() => setSelectedImageIndex(0)}
                  >
                    📱 View Gallery
                  </button>
                </div>
                
                <div className="image-grid">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="image-thumbnail"
                      onClick={() => setSelectedImageIndex(i)}
                    >
                      <div className="image-container">
                        <img 
                          src={src} 
                          alt={`Vehicle image ${i + 1}`}
                          loading="lazy"
                          onError={handleImageError}
                        />
                        <div className="image-overlay">
                          <span className="zoom-icon">🔍</span>
                          <span className="image-number">{i + 1}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      {/* Enhanced Image Gallery Modal */}
      {selectedImageIndex !== null && images.length > 0 && (
        <div className="image-gallery-modal" onClick={handleGalleryBackdropClick}>
          <div className="gallery-content">
            <div className="gallery-header">
              <div className="gallery-title">Vehicle Images</div>
              <div className="gallery-counter">
                {selectedImageIndex + 1} of {images.length}
              </div>
              <button 
                className="gallery-close" 
                onClick={() => setSelectedImageIndex(null)}
                aria-label="Close gallery"
              >
                ✕
              </button>
            </div>
            
            <div className="gallery-main">
              {images.length > 1 && (
                <button
                  className="gallery-nav prev"
                  onClick={goToPrevImage}
                  disabled={selectedImageIndex === 0}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}
              
              <div className="gallery-image-container">
                <img
                  className="gallery-image"
                  src={images[selectedImageIndex]}
                  alt={`Vehicle image ${selectedImageIndex + 1}`}
                  onError={(e) => {
                    console.error('Failed to load image:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
                <div className="image-loading-spinner" style={{display: 'none'}}>
                  Loading...
                </div>
              </div>
              
              {images.length > 1 && (
                <button
                  className="gallery-nav next"
                  onClick={goToNextImage}
                  disabled={selectedImageIndex === images.length - 1}
                  aria-label="Next image"
                >
                  ›
                </button>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="gallery-thumbnails">
                <div className="thumbnails-container">
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className={`thumbnail ${i === selectedImageIndex ? 'active' : ''}`}
                      onClick={() => setSelectedImageIndex(i)}
                    >
                      <img
                        src={src}
                        alt={`Thumbnail ${i + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="gallery-controls">
              <span className="keyboard-hint">
                Use ← → arrow keys to navigate
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteDetailsModal;