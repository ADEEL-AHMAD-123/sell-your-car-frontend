import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./QuoteConfirmation.scss";

const QuoteConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  
  // Get confirmation data from navigation state
  const confirmationData = location.state?.confirmationData;

  // Redirect if no confirmation data
  useEffect(() => {
    if (!confirmationData) {
      navigate("/");
    }
  }, [confirmationData, navigate]);

  if (!confirmationData) {
    return null;
  }

  // Destructure from the new schema
  const { quote, collectionDetails, referenceId } = confirmationData;
  const { estimatedScrapPrice, vehicleRegistration } = quote;

  const handleCopyQuote = async () => {
    const quoteText = `
VEHICLE SCRAP QUOTE - ${quote._id}
=====================================
Registration: ${vehicleRegistration?.Vrm}
Vehicle: ${vehicleRegistration?.Make} ${vehicleRegistration?.Model} (${vehicleRegistration?.YearOfManufacture})
Estimated Price: £${estimatedScrapPrice}
Kerb Weight: ${quote?.otherVehicleData?.KerbWeight} kg

Collection Details:
- Date: ${collectionDetails.pickupDate}
- Address: ${collectionDetails.address}
- Contact: ${collectionDetails.contactNumber}

Status: CONFIRMED - Awaiting Collection
Generated: ${new Date().toLocaleDateString()}
=====================================
    `;

    try {
      // Use document.execCommand('copy') for better compatibility in iframes
      const textarea = document.createElement('textarea');
      textarea.value = quoteText.trim();
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleGoHome = () => {
    // Clear the current history entry to prevent going back to this page
    window.history.replaceState(null, "", "/");
    navigate("/", { replace: true });
  };

  return (
    <div className="quote-confirmation">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">✅</div>
          <h1>Quote Confirmed Successfully!</h1>
          <p className="success-subtitle">
            Your vehicle collection has been scheduled. We'll be in touch soon!
          </p>
        </div>

        {/* Reference Card */}
        <div className="reference-card">
          <div className="reference-header">
            <h3>Your Reference ID</h3>
            <span className="reference-id">{quote._id}</span>
          </div>
          <p className="reference-note">
            📋 Keep this reference ID for your records and any future communication
          </p>
        </div>

        {/* Quote Summary */}
        <div className="quote-summary-card">
          <div className="card-header">
            <h3>Quote Summary</h3>
            <button 
              className="copy-btn"
              onClick={handleCopyQuote}
              title="Copy quote details"
            >
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          </div>
          
          <div className="quote-details">
            <div className="detail-row highlight">
              <span className="label">Agreed Price</span>
              <span className="value price">£{estimatedScrapPrice}</span>
            </div>
            <div className="detail-row">
              <span className="label">Vehicle</span>
              <span className="value">{vehicleRegistration?.Make} {vehicleRegistration?.Model} ({vehicleRegistration?.YearOfManufacture})</span>
            </div>
            <div className="detail-row">
              <span className="label">Registration</span>
              <span className="value">{vehicleRegistration?.Vrm}</span>
            </div>
            <div className="detail-row">
              <span className="label">Kerb Weight</span>
              <span className="value">{quote?.otherVehicleData?.KerbWeight} kg</span>
            </div>
          </div>
        </div>
        {/* Collection Card  */}
        <div className="collection-card">
          <h3>📅 Collection Details</h3>
          <div className="collection-info">
            <div className="info-item">
              <div className="info-left">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <strong>Available From (Earliest Collection Date)</strong>
                  <p>{new Date(collectionDetails.pickupDate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                  <small className="note">
                    We’ll collect your vehicle on or after this date. Our team will confirm the exact time.
                  </small>
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-left">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <strong>Collection Address</strong>
                  <p>{collectionDetails.address}</p>
                </div>
              </div>
            </div>

            <div className="info-item">
              <div className="info-left">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <strong>Contact Number</strong>
                  <p>{collectionDetails.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Next Steps */}
        <div className="next-steps-card">
          <h3>🚀 What Happens Next?</h3>
          <div className="steps-timeline">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Quote Confirmed</h4>
                <p>Your quote has been successfully submitted and confirmed</p>
              </div>
            </div>
            <div className="step pending">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>We'll Contact You</h4>
                <p>Our team will reach out via email or phone within 24 hours to confirm collection details</p>
              </div>
            </div>
            <div className="step pending">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Vehicle Collection</h4>
                <p>We'll collect your vehicle on the scheduled date and process payment on-site</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="important-notes">
          <h4>📋 Important Information</h4>
          <ul>
            <li>💳 <strong>Payment:</strong> You'll receive payment at the time of collection</li>
            <li>📧 <strong>Contact:</strong> We'll email and call you to confirm final details</li>
            <li>🆔 <strong>Documents:</strong> Please have your V5C (log book) ready for collection</li>
            <li>🔑 <strong>Keys:</strong> Ensure all keys and remote controls are available</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="btn btn-primary btn-large"
            onClick={handleGoHome}
          >
            🏠 Return to Home
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            🖨️ Print Quote
          </button>
        </div>

        {/* Contact Support */}
        <div className="support-section">
          <p>Need help or have questions?</p>
          <div className="support-buttons">
            <Link to="/contact" className="btn btn-outline btn-small">
              📞 Contact Support
            </Link>
            <Link to="/faqs" className="btn btn-outline btn-small">
              ❓ View FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteConfirmation;
