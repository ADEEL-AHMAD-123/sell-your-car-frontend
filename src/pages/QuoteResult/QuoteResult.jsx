import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import MessageCard from "../../components/common/MessageCard";
import {
  confirmQuote,
  resetConfirmStatus,
} from "../../redux/slices/quoteSlice";
import "./QuoteResult.scss";

const QuoteResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  const { quote, confirmLoading, confirmError, confirmStatus } = useSelector(
    (state) => state.quote
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [pickupDate, setPickupDate] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const hasPrice = !!quote?.estimatedScrapPrice;

  // Reset confirmStatus only when modal opens
  const handleOpenModal = () => {
    dispatch(resetConfirmStatus());
    setFormErrors({});
    setShowConfirm(true);
  };
  useEffect(() => {
    if (showConfirm) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showConfirm]);
  
  const trimmedData = {
    pickupDate,
    contactNumber: contactNumber.trim(),
    address: address.trim(),
  };
  

  useEffect(() => {
    const fromQuote = location.state?.fromQuote;
    const allow = sessionStorage.getItem("allowQuoteResultPage");

    const navEntry = performance.getEntriesByType("navigation")[0];
    const isReload = navEntry?.type === "reload";

    if (fromQuote) {
      // User is redirected from /quote — store a flag
      sessionStorage.setItem("allowQuoteResultPage", "true");
      sessionStorage.setItem("allowTime", Date.now().toString());
      setAllowed(true);
    } else if (allow === "true" && isReload) {
      // Allow access on reload only if redirected earlier
      setAllowed(true);
    } else {
      // Otherwise block (e.g., from back/forward)
      setAllowed(false);
    }

    setChecked(true);
  }, [location.state]);

  useEffect(() => {
    if (confirmStatus === "succeeded") {
      const confirmationData = {
        quote,
        collectionDetails: {
          pickupDate,
          contactNumber,
          address,
        },
      };

      navigate("/quote-confirmation", {
        state: { confirmationData },
        replace: true,
      });

      setTimeout(() => {
        dispatch(resetConfirmStatus());
      }, 100);
    }
  }, [
    confirmStatus,
    navigate,
    dispatch,
    quote,
    pickupDate,
    contactNumber,
    address,
  ]);

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 2);
    minDate.setHours(0, 0, 0, 0);
  
    const trimmedPhone = contactNumber.trim();
    const trimmedAddress = address.trim();
  
    // Validate pickup date
    if (!pickupDate) {
      errors.pickupDate = "Please select a collection date.";
    } else {
      const selectedDate = new Date(pickupDate);
      if (isNaN(selectedDate.getTime())) {
        errors.pickupDate = "Invalid date format.";
      } else if (selectedDate < minDate) {
        errors.pickupDate = "Select a date at least 2 days from today.";
      }
    }
  
    // Validate contact number with regex
    const phoneRegex = /^[+]?[\d\s()-]{7,20}$/;
    if (!trimmedPhone) {
      errors.contactNumber = "Contact number is required.";
    } else if (!phoneRegex.test(trimmedPhone)) {
      errors.contactNumber = "Invalid contact number format.";
    }
  
    // Validate address
    if (!trimmedAddress) {
      errors.address = "Collection address is required.";
    } else if (trimmedAddress.length < 10) {
      errors.address = "Address is too short.";
    }
  
    // Show general error if any field fails
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
        <Link to="/" className="back-link">
          ← Go Back
        </Link>
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
            label: "Go Back",
            onClick: () => navigate(-1),
          },
          {
            label: "Go to Home",
            onClick: () => navigate("/"),
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
          <div>
            <span>Registration</span>
            <strong>{quote.regNumber || "N/A"}</strong>
          </div>
          <div>
            <span>Revenue Weight</span>
            <strong>{quote.revenueWeight ?? "N/A"} kg</strong>
          </div>
          <div>
            <span>Estimated Price</span>
            <strong className="price">
              {hasPrice ? `£${quote.estimatedScrapPrice}` : "Unavailable"}
            </strong>
          </div>
        </div>

        {quote.status !== 'manual_reviewed' && (
  hasPrice ? (
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
  )
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
                  min={
                    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  } // min = 2 days ahead
                  disabled={confirmLoading}
                  className={formErrors.pickupDate ? "field-error-border" : ""}

                />
                <small className="helper-text">
                  We'll arrange pickup on or after this date.
                </small>
                {formErrors.pickupDate && (
                  <small className="field-error">{formErrors.pickupDate}</small>
                )}
              </label>

              <label>
  Contact Number
  <PhoneInput
    country={'gb'}
    value={contactNumber}
    onChange={(value) => setContactNumber(value)}
    inputProps={{
      name: 'phone',
      required: true,
      disabled: confirmLoading,
    }}
    inputStyle={{
      width: '100%',
      paddingLeft: '48px',
      height: '40px',
      borderColor: formErrors.contactNumber ? 'red' : '#ccc',
      borderRadius: '4px',
    }}
  />
  {formErrors.contactNumber && (
    <small className="field-error">
      {formErrors.contactNumber}
    </small>
  )}
</label>


              <label>
                Collection Address
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  disabled={confirmLoading}
                  className={formErrors.address ? "field-error-border" : ""}
                />
                {formErrors.address && (
                  <small className="field-error">{formErrors.address}</small>
                )}
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
          <li>
            <span>Make:</span> {quote.make || "N/A"}
          </li>
          <li>
            <span>Model:</span> {quote.model || "N/A"}
          </li>
          <li>
            <span>Fuel Type:</span> {quote.fuelType || "N/A"}
          </li>
          <li>
            <span>CO₂ Emissions:</span> {quote.co2Emissions ?? "N/A"} g/km
          </li>
          <li>
            <span>Colour:</span> {quote.colour || "N/A"}
          </li>
          <li>
            <span>Year:</span> {quote.year || "N/A"}
          </li>
          <li>
            <span>Engine Capacity:</span> {quote.engineCapacity ?? "N/A"} cc
          </li>
          <li>
            <span>Tax Status:</span> {quote.taxStatus || "N/A"}
          </li>
          <li>
            <span>MOT Status:</span> {quote.motStatus || "N/A"}
          </li>
          <li>
            <span>Euro Status:</span> {quote.euroStatus || "N/A"}
          </li>
          <li>
            <span>RDE:</span> {quote.realDrivingEmissions || "N/A"}
          </li>
          <li>
            <span>Wheel Plan:</span> {quote.wheelPlan || "N/A"}
          </li>
        </ul>
      </div>

      <Link to="/" className="back-link">
        ← Back to Home
      </Link>
    </section>
  );
};

export default QuoteResult;
