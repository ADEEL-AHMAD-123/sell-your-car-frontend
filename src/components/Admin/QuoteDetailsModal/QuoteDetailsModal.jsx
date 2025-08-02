import React from 'react';
import './QuoteDetailsModal.scss';

const QuoteDetailsModal = ({ quote, onClose }) => {
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
    return (
      <p>
        <strong>{label}:</strong> {String(value)}{unit}
      </p>
    );
  };

  return (
    <div className="quote-details-modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Manual Quote Request Details</h2>

        {/* Group 0: Key Summary Info */}
        <section className="details-section top-summary">
          <h3>Summary</h3>
          {renderField('Registration Number', regNumber)}
          {renderField('Manual Quote Reason', manualQuoteReason)}
          {renderField('Revenue Weight', revenueWeight, ' kg')}
          {renderField('Offered Price', estimatedScrapPrice, '£')}
        </section>

        {/* Group 1: Client Info */}
        <section className="details-section">
          <h3>Client Info</h3>
          {user?.firstName || user?.lastName ? (
            <p><strong>Client:</strong> {user?.firstName} {user?.lastName}</p>
          ) : null}
          {user?.email || user?.phone ? (
            <p><strong>Contact:</strong> {user?.email} {user?.phone && `| ${user.phone}`}</p>
          ) : null}
        </section>

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
          {renderField('Marked for Export', markedForExport ? 'Yes' : 'No')}
          {renderField('Tax Due Date', taxDueDate)}
          {renderField('Art End Date', artEndDate)}
          {renderField('Month of First Registration', monthOfFirstRegistration)}
          {renderField('Year of Manufacture', yearOfManufacture)}
          {renderField('Date of Last V5C Issued', dateOfLastV5CIssued)}
          {renderField('DVLA Fetched At', dvlaFetchedAt && new Date(dvlaFetchedAt).toLocaleString())}
          {renderField('Last Updated At', lastUpdatedAt && new Date(lastUpdatedAt).toLocaleString())}
        </section>

        {/* Group 3: User Submitted Info */}
        <section className="details-section">
          <h3>User Provided Information</h3>
          {renderField('User Estimated Price', userEstimatedPrice && `£${userEstimatedPrice}`)}
          {renderField('User Provided Weight', userProvidedWeight, ' kg')}
          {renderField('Client Message', message)}
        </section>

        {/* Group 4: Uploaded Images */}
        <section className="images-section">
          <h3>Uploaded Images</h3>
          {images.length === 0 ? (
            <p>No images uploaded.</p>
          ) : (
            <div className="image-grid">
              {images.map((src, i) => (
                <img key={i} src={src} alt={`upload-${i}`} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default QuoteDetailsModal;
