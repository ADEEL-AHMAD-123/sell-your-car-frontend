import React, { useEffect, useState } from 'react';
import './QuoteDetailsModal.scss'

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
  
  if (!quote) return null;

  // Destructure from the updated schema
  const {
    vehicleRegistration,
    otherVehicleData,
    images = [],
    user,
    collectionDetails,
    rejectionReason,
    estimatedScrapPrice,
    finalPrice,
    clientDecision,
    type,
    createdAt,
    updatedAt,
    rejectedAt,
    userEstimatedPrice,
    userProvidedWeight,
    message,
    manualQuoteReason,
    lastManualRequestAt,
    adminMessage,
  } = quote;
  
  // Get the current status based on the quote data
  const getCurrentStatus = () => {
    if (collectionDetails?.collected) return 'Collected';
    if (clientDecision === 'accepted') return 'Accepted';
    if (clientDecision === 'rejected') return 'Rejected';
    return 'Pending';
  };

  // Get summary section title based on the quote data
  const getSummaryTitle = () => {
    const status = getCurrentStatus();
    if (status === 'Collected') return 'Final Summary';
    return 'Quote Summary';
  };
  
  const renderField = (label, value, unit = '', className = '', valueClassName = '') => {
    if (value === undefined || value === null || value === '') return null;
    
    // Format the value appropriately
    let formattedValue = String(value);
    
    // Handle boolean values
    if (typeof value === 'boolean') {
      formattedValue = value ? 'Yes' : 'No';
    }
    
    return (
      <p key={label} className={className}>
        <strong>{label}:</strong> <span className={valueClassName}>{formattedValue}{unit}</span>
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
  
  // Handle image loading error
  const handleImageError = (e) => {
    e.target.parentElement.style.display = 'none';
  };
  
  const renderVehicleDetailsSection = () => {
    const hasDVLAData = Object.values(vehicleRegistration || {}).some(Boolean);
    const hasOtherData = Object.values(otherVehicleData || {}).some(Boolean);
    
    if (!hasDVLAData && !hasOtherData) {
      return null;
    }

    return (
      <section className="details-section">
        <h3>Vehicle Details</h3>
        {hasDVLAData && (
          <div className="sub-section dvla-details">
            {/* Essential Vehicle Data from DVLA */}
            {renderField('Make', vehicleRegistration?.Make)}
            {renderField('Model', vehicleRegistration?.Model)}
            {renderField('Year of Manufacture', vehicleRegistration?.YearOfManufacture)}
            {renderField('Colour', vehicleRegistration?.Colour)}
            {renderField('Fuel Type', vehicleRegistration?.FuelType)}
            {renderField('Engine Capacity', vehicleRegistration?.EngineCapacity, ' cc')}
            {renderField('Revenue Weight', vehicleRegistration?.RevenueWeight, ' kg')}
            {renderField('CO₂ Emissions', vehicleRegistration?.Co2Emissions, ' g/km')}
            {renderField('Transmission', vehicleRegistration?.Transmission)}

            {/* Other DVLA Data (optional, based on availability) */}
            {renderField('Tax Status', vehicleRegistration?.TaxStatus)}
            {renderField('MOT Status', vehicleRegistration?.MotStatus)}
            {renderField('Tax Due Date', formatDate(vehicleRegistration?.TaxDueDate))}
            {renderField('MOT Expiry Date', formatDate(vehicleRegistration?.MotExpiryDate))}
            {renderField('Euro Status', otherVehicleData?.EuroStatus)}
            {renderField('Date of Last V5C Issued', formatDate(vehicleRegistration?.DateOfLastV5CIssued))}
          </div>
        )}
        {hasOtherData && (
          <div className="sub-section other-details">
            {/* Other relevant data from external APIs or user input */}
            {renderField('Wheel Plan', otherVehicleData?.WheelPlan)}
            {renderField('Body Style', otherVehicleData?.BodyStyle)}
            {renderField('Number of Doors', otherVehicleData?.NumberOfDoors)}
            {renderField('Number of Seats', otherVehicleData?.NumberOfSeats)}
{renderField('Number of Axles', otherVehicleData?.NumberOfAxles)}
          </div>
        )}
      </section>
    );
  };
  
  return (
    <>
      <div className="quote-details-modal" onClick={handleBackdropClick}>
        <div className="modal-content">
          <button className="close-btn" onClick={onClose} aria-label="Close modal">
            ×
          </button>
          
          <h2>{getModalTitle()}</h2>

          {/* New Quote Summary Section - Conditional rendering based on quote data */}
          <section className="details-section top-summary">
            <h3>{getSummaryTitle()}</h3>
            
            {/* Display Registration number first as requested */}
            {renderField('REG number', vehicleRegistration?.Vrm)}
            {renderField('Current Status', getCurrentStatus())}
            {renderField('Quote Type', type.charAt(0).toUpperCase() + type.slice(1))}
            {renderField('Generated At', formatDateTime(createdAt))}
            
            {/* Conditional fields based on client decision */}
            {(clientDecision === 'accepted' || clientDecision === 'pending' || type === 'manual') && otherVehicleData?.KerbWeight && (
              renderField('Kerb Weight', otherVehicleData.KerbWeight, ' kg', '', "badge")
            )}
            
            {clientDecision === 'accepted' && finalPrice && (
              // 💡 FIX: Applied the badge class to the valueClassName parameter.
              renderField('Final Price', formatCurrency(finalPrice), '', '', 'badge')
            )}
            
            {(clientDecision === 'rejected' && estimatedScrapPrice) && (
              renderField('Offered Price', formatCurrency(estimatedScrapPrice))
            )}
            
            {type === 'manual' && clientDecision === 'pending' && estimatedScrapPrice && (
              renderField('Offered Price', formatCurrency(estimatedScrapPrice ))
            )}

            {clientDecision === 'accepted' && (
              <>
                {renderField('Accepted At', formatDateTime(updatedAt))}
              </>
            )}

            {clientDecision === 'rejected' && (
              <>
                {renderField('Rejected At', formatDateTime(rejectedAt))}
                {renderField('Rejection Reason', rejectionReason)}
                {renderField('User Estimated Price', formatCurrency(userEstimatedPrice))}
              </>
            )}

            {type === 'manual' && clientDecision === 'pending' && (
              <>
                {renderField('Manual Request At', formatDateTime(lastManualRequestAt))}
                {renderField('Manual Request Reason', manualQuoteReason)}
                {renderField('User Estimated Price', formatCurrency(userEstimatedPrice))}
              </>
            )}
            
          </section>

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

          {/* Vehicle Details */}
          {renderVehicleDetailsSection()}

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
          {adminMessage && (
            <section className="details-section">
              <h3>Admin Notes</h3>
              {renderField('Admin Message', adminMessage)}
            </section>
          )}
          
          {/* Collection Details Section - Only show for accepted quotes with collection details */}
          {clientDecision === 'accepted' && collectionDetails && (
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
            <div className="keyboard-hint">
              Use ← → arrow keys to navigate
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteDetailsModal;
