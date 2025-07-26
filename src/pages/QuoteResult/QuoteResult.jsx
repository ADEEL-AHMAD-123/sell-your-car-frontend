import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom"; 
import MessageCard from '../../components/common/MessageCard';
import { confirmQuote, resetConfirmStatus } from "../../redux/slices/quoteSlice";
import "./QuoteResult.scss";

const QuoteResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
const [checked, setChecked] = useState(false);
const [allowed, setAllowed] = useState(false);

  const {
    quote,
    confirmLoading,
    confirmError,
    confirmStatus,
  } = useSelector((state) => state.quote);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const hasPrice = !!quote?.estimatedScrapPrice;

  // Generate reference ID
  const generateReferenceId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SCR-${timestamp}-${random}`;
  };

  // Reset confirmStatus only when modal opens
  const handleOpenModal = () => {
    dispatch(resetConfirmStatus());
    setFormErrors({});
    setShowConfirm(true);
  };

  useEffect(() => {
    const fromQuote = location.state?.fromQuote;
    const allow = sessionStorage.getItem("allowQuoteResultPage");
  
    if (fromQuote && allow === "true") {
      sessionStorage.removeItem("allowQuoteResultPage");
      setAllowed(true);
    } else {
      setAllowed(false);
    }
  
    setChecked(true);
  }, [location.state]);


  useEffect(() => {
    if (confirmStatus === "succeeded") {
      const referenceId = generateReferenceId();
      const confirmationData = {
        quote,
        collectionDetails: {
          pickupDate,
          contactNumber,
          address,
        },
        referenceId,
      };

      navigate("/quote-confirmation", {
        state: { confirmationData },
        replace: true,
      });

      setTimeout(() => {
        dispatch(resetConfirmStatus());
      }, 100);
    }
  }, [confirmStatus, navigate, dispatch, quote, pickupDate, contactNumber, address]);

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 2); // Earliest: 2 days from now
  
    if (!pickupDate) {
      errors.pickupDate = "Please select a collection date.";
    } else {
      const selectedDate = new Date(pickupDate);
      if (selectedDate < new Date(minDate.setHours(0, 0, 0, 0))) {
        errors.pickupDate = "Select a date at least 2 days from today.";
      }
    }
  
    if (!contactNumber) {
      errors.contactNumber = "Contact number is required.";
    }
  
    if (!address) {
      errors.address = "Collection address is required.";
    }
  
    if (Object.keys(errors).length > 0) {
      errors.general = "Please correct the highlighted fields.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  

  const handleConfirm = async () => {
    if (!quote?._id) {
      setFormErrors({ general: "Invalid quote ID" });
      return;
    }

    if (!validateForm()) return;
  
    try {
      const result = await dispatch(
        confirmQuote({
          id: quote._id,
          data: { pickupDate, contactNumber, address },
        })
      ).unwrap();

      console.log("Confirm successful:", result);
    } catch (err) {
      console.error("Confirm failed:", err);
    }
  };

  if (!quote) {
    return (
      <div className="quote-result no-data">
        <p>No quote data found. Please go back and enter your details again.</p>
        <Link to="/" className="back-link">← Go Back</Link>
      </div>
    );
  }

  if (checked && !allowed) {
    return (
      <MessageCard
        title="Access Denied"
        message="You can't access the quote result page directly."
        buttons={[
          {
            label: 'Go Back',
            onClick: () => navigate(-1),
          },
          {
            label: 'Go to Home',
            onClick: () => navigate('/'),
          },
        ]}
      />
    );
  }
  

  return (
    <section className="quote-result">
      <div className="valuation-summary">
        <h2>Your Vehicle Valuation</h2>
        <div className="summary-box">
          <div><span>Registration</span><strong>{quote.regNumber || "N/A"}</strong></div>
          <div><span>Revenue Weight</span><strong>{quote.revenueWeight ?? "N/A"} kg</strong></div>
          <div><span>Estimated Price</span>
            <strong className="price">
              {hasPrice ? `£${quote.estimatedScrapPrice}` : "Unavailable"}
            </strong>
          </div>
        </div>

        {hasPrice ? (
          <>
           <div className="manual-options">
  <h4>{hasPrice ? "Think your vehicle is worth more?" : "We couldn't calculate a price automatically"}</h4>
  <p>{hasPrice
    ? "You can request a custom valuation or contact our team."
    : "You can still continue by selecting one of the following options:"}</p>

  <div className="option-buttons">
    <Link
      to="/manual-valuation"
      state={{
        reason: hasPrice ? "value-higher" : "no-auto-price",
        regNumber: quote.regNumber,
        make: quote.make,
        model: quote.model,
        fuelType: quote.fuelType,
        wheelPlan: quote.wheelPlan,
        colour: quote.colour,
        fromQuote: true
      }}
      className="option-card"
      onClick={() => {
        sessionStorage.setItem("allowManualPage", "true");
      }}
    >
      <span className="emoji">🛠️</span>
      <div>
        <strong>Request a Manual Valuation</strong>
        <p>Let us review your vehicle details manually.</p>
      </div>
    </Link>

    <Link to="/contact" className="option-card">
      <span className="emoji">📬</span>
      <div>
        <strong>Contact Us</strong>
        <p>Speak to our team about your vehicle or this offer.</p>
      </div>
    </Link>
  </div>
</div>
 

            <div className="accept-offer">
              <button
                onClick={handleOpenModal}
                className="accept-btn"
                disabled={confirmLoading}
              >
                ✅ {confirmLoading ? "Processing..." : "Accept & Arrange Collection"}
              </button>
            </div>
          </>
        ) : (
          <div className="manual-options">
            <h4>We couldn't calculate a price automatically</h4>
            <p>You can still continue by selecting one of the following:</p>
            <div className="option-buttons">
              <Link
                to="/manual-valuation"
                state={{
                  reason: "no-auto-price",
                  regNumber: quote.regNumber,
                  make: quote.make,
                  model: quote.model,
                  fuelType: quote.fuelType,
                  wheelPlan: quote.wheelPlan,
                  colour: quote.colour,
                  fromQuote: true
                }}
                className="option-card"
                onClick={() => {
                  sessionStorage.setItem("allowManualPage", "true");
                }}
              >
                <span className="emoji">📞</span>
                <div>
                  <strong>Request a Manual Valuation</strong>
                  <p>Let our team assess your vehicle details manually.</p>
                </div>
              </Link>

              <Link to="/contact" className="option-card">
      <span className="emoji">📬</span>
      <div>
        <strong>Contact Us</strong>
        <p>Speak to our team about your vehicle or this offer.</p>
      </div>
    </Link>
            </div>
          </div>
        )}
      </div>

      {/* Confirm + Collection Modal */}
      {showConfirm && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-card">
            <h3>Confirm Quote & Collection</h3>
            <p>
              You are accepting the offer of{" "}
              <strong>£{quote.estimatedScrapPrice}</strong>.
            </p>

            {formErrors.general && (
              <div className="error-text">❌ {formErrors.general}</div>
            )}
            {confirmError && (
              <div className="error-text">❌ {confirmError}</div>
            )}

            <div className="form">
            <label>
  Available From <small>(Earliest Collection Date)</small>
  <input
    type="date"
    value={pickupDate}
    onChange={(e) => setPickupDate(e.target.value)}
    min={new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // min = 2 days ahead
    disabled={confirmLoading}
  />
  <small className="helper-text">We'll arrange pickup on or after this date.</small>
  {formErrors.pickupDate && <small className="field-error">{formErrors.pickupDate}</small>}
</label>



              <label>
                Contact Number
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  placeholder="+44 ..."
                  disabled={confirmLoading}
                />
                {formErrors.contactNumber && <small className="field-error">{formErrors.contactNumber}</small>}
              </label>

              <label>
                Collection Address
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  disabled={confirmLoading}
                />
                {formErrors.address && <small className="field-error">{formErrors.address}</small>}
              </label>
            </div>

            <div className="confirm-buttons">
              <button
                className="yes"
                onClick={handleConfirm}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Confirming..." : "Confirm & Submit"}
              </button>
              <button
                className="no"
                onClick={() => setShowConfirm(false)}
                disabled={confirmLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="vehicle-info">
        <h3>Vehicle Details</h3>
        <ul className="info-grid">
          <li><span>Make:</span> {quote.make || "N/A"}</li>
          <li><span>Model:</span> {quote.model || "N/A"}</li>
          <li><span>Fuel Type:</span> {quote.fuelType || "N/A"}</li>
          <li><span>CO₂ Emissions:</span> {quote.co2Emissions ?? "N/A"} g/km</li>
          <li><span>Colour:</span> {quote.colour || "N/A"}</li>
          <li><span>Year:</span> {quote.year || "N/A"}</li>
          <li><span>Engine Capacity:</span> {quote.engineCapacity ?? "N/A"} cc</li>
          <li><span>Tax Status:</span> {quote.taxStatus || "N/A"}</li>
          <li><span>MOT Status:</span> {quote.motStatus || "N/A"}</li>
          <li><span>Euro Status:</span> {quote.euroStatus || "N/A"}</li>
          <li><span>RDE:</span> {quote.realDrivingEmissions || "N/A"}</li>
          <li><span>Wheel Plan:</span> {quote.wheelPlan || "N/A"}</li>
        </ul>
      </div>

      <Link to="/" className="back-link">← Back to Home</Link>
    </section>
  );
};

export default QuoteResult;
