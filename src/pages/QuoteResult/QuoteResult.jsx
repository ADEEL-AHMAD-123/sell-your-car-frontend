import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import MessageCard from "../../components/common/MessageCard";
import {
  confirmQuote,
  rejectQuote,
  // Using the actions to clear the state
  resetConfirmStatus,
  resetRejectStatus,
} from "../../redux/slices/quoteSlice";
import "./QuoteResult.scss";

const QuoteResult = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { 
    quote, 
    quoteStatus, 
    confirmLoading, 
    confirmError, 
    confirmStatus,
    rejectLoading,
    rejectError,
    rejectStatus
  } = useSelector((state) => state.quote);

  const [hasAccess, setHasAccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectFormError, setRejectFormError] = useState("");

  const [messageCardState, setMessageCardState] = useState({
    isVisible: false,
    title: '',
    message: '',
    buttons: null,
    type: 'error',
  });

  const [collectionDetails, setCollectionDetails] = useState({
    pickupDate: "",
    contactNumber: "",
    address: "",
  });

  useEffect(() => {
    const fromQuote = location.state?.fromQuote;
    if (fromQuote && quote) {
      setHasAccess(true);
    } else {
      setHasAccess(false);
      setMessageCardState({
        isVisible: true,
        title: "Access Denied",
        message: "You can't access the quote result page directly. Please go through the quote process first.",
        buttons: [
          { label: "Go to Home", onClick: () => navigate("/") },
        ],
        type: 'error',
      });
    }
  }, [location.state, navigate, quote]);

  useEffect(() => {
    if (confirmStatus === "succeeded") {
      const confirmationData = {
        quote,
        collectionDetails,
      };

      navigate("/quote-confirmation", {
        state: { confirmationData },
        replace: true,
      });
      dispatch(resetConfirmStatus());
    }
  }, [confirmStatus, navigate, dispatch, quote, collectionDetails]);

  useEffect(() => {
    if (rejectStatus === "succeeded") {
      if (window.showToast) {
        window.showToast("Quote rejected successfully", "success");
      }
      setShowRejectModal(false);
      setRejectionReason("");
      setRejectFormError("");
      dispatch(resetRejectStatus());
      navigate("/", { replace: true });
    }
  }, [rejectStatus, dispatch, navigate]);

  // Handle confirm error and show MessageCard with an "OK" button
  useEffect(() => {
    if (confirmError) {
      setMessageCardState({
        isVisible: true,
        title: "Submission Failed",
        message: confirmError,
        buttons: [
          {
            label: "OK",
            onClick: () => {
              setMessageCardState(prev => ({ ...prev, isVisible: false }));
              // Dispatch the existing action to clear the error and status
              dispatch(resetConfirmStatus());
            }
          },
        ],
        type: 'error',
      });
    }
  }, [confirmError, dispatch]);

  // Handle reject error and show MessageCard with an "OK" button
  useEffect(() => {
    if (rejectError) {
      setMessageCardState({
        isVisible: true,
        title: "Rejection Failed",
        message: rejectError,
        buttons: [
          {
            label: "OK",
            onClick: () => {
              setMessageCardState(prev => ({ ...prev, isVisible: false }));
              // Dispatch the existing action to clear the error and status
              dispatch(resetRejectStatus());
            }
          },
        ],
        type: 'error',
      });
      setShowRejectModal(false);
    }
  }, [rejectError, dispatch]);

  const handleOpenModal = () => {
    dispatch(resetConfirmStatus());
    setFormErrors({});
    setShowConfirmModal(true);
  };

  const handleOpenRejectModal = () => {
    dispatch(resetRejectStatus());
    setRejectionReason("");
    setShowRejectModal(true);
  };

  useEffect(() => {
    if (showConfirmModal || showRejectModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [showConfirmModal, showRejectModal]);

  const validateForm = () => {
    const errors = {};
    const today = new Date();
    const minDate = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    minDate.setHours(0, 0, 0, 0);
  
    const trimmedPhone = collectionDetails.contactNumber.trim();
    const trimmedAddress = collectionDetails.address.trim();
  
    if (!collectionDetails.pickupDate) {
      errors.pickupDate = "Please select a collection date.";
    } else {
      const selectedDate = new Date(collectionDetails.pickupDate);
      if (isNaN(selectedDate.getTime())) {
        errors.pickupDate = "Invalid date format.";
      } else if (selectedDate < minDate) {
        errors.pickupDate = "Select a date at least 2 days from today.";
      }
    }
  
    const phoneRegex = /^\+?[\d\s()-]{7,20}$/;
    if (!trimmedPhone) {
      errors.contactNumber = "Contact number is required.";
    } else if (!phoneRegex.test(trimmedPhone)) {
      errors.contactNumber = "Invalid contact number format.";
    }
  
    if (!trimmedAddress) {
      errors.address = "Collection address is required.";
    } else if (trimmedAddress.length < 10) {
      errors.address = "Address is too short.";
    }
  
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRejectForm = () => {
    const trimmedReason = rejectionReason.trim();
    
    if (!trimmedReason) {
      setRejectFormError("Please provide a reason for rejection.");
      return false;
    }
    
    if (trimmedReason.length < 10) {
      setRejectFormError("Rejection reason must be at least 10 characters long.");
      return false;
    }

    setRejectFormError("");
    return true;
  };

  const handleConfirm = async () => {
    if (!quote?._id) {
      setMessageCardState({
        isVisible: true,
        title: "Invalid Quote",
        message: "The quote ID is missing. Please try getting a new quote.",
        buttons: [{ label: "Go to Home", onClick: () => navigate("/") }],
        type: 'error',
      });
      return;
    }

    if (!validateForm()) {
      return; 
    }

    try {
      await dispatch(
        confirmQuote({
          id: quote._id,
          data: collectionDetails,
        })
      ).unwrap();
    } catch (err) {
      console.error("Confirm failed:", err);
    }
  };

  const handleReject = async () => {
    if (!quote?._id) {
      setMessageCardState({
        isVisible: true,
        title: "Invalid Quote",
        message: "The quote ID is missing. Please try getting a new quote.",
        buttons: [{ label: "Go to Home", onClick: () => navigate("/") }],
        type: 'error',
      });
      setShowRejectModal(false);
      return;
    }

    if (!validateRejectForm()) {
      return;
    }

    try {
      await dispatch(
        rejectQuote({
          id: quote._id,
          data: { rejectionReason: rejectionReason.trim() },
        })
      ).unwrap();
    } catch (err) {
      console.error("Reject failed:", err);
    }
  };
  
  if (!quote) {
    return (
      <MessageCard
        title="No Quote Data Found"
        message="Please go back and enter your details again to get a quote."
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
        type="error"
      />
    );
  }

  if (messageCardState.isVisible) {
    return (
      <MessageCard
        title={messageCardState.title}
        message={messageCardState.message}
        buttons={messageCardState.buttons}
        type={messageCardState.type}
      />
    );
  }
  
  const hasPrice = !!quote?.estimatedScrapPrice;
  const isManualReviewed = quoteStatus === "manual_reviewed";
  const hasAdminOfferPrice = !!quote?.adminOfferPrice;
  const isManualPreviouslyRejected = quoteStatus === "manual_previously_rejected";

  const priceToDisplay = (isManualReviewed || isManualPreviouslyRejected) && hasAdminOfferPrice
    ? quote.adminOfferPrice
    : hasPrice
    ? quote.estimatedScrapPrice
    : null;

  const priceLabel = isManualPreviouslyRejected ? "Offered Price"
    : isManualReviewed && hasAdminOfferPrice ? "Admin Offered Price"
    : "Estimated Price";

  const renderManualOptions = () => (
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
            regNumber: quote?.regNumber,
            make: quote?.make,
            model: quote?.model,
            fuelType: quote?.fuelType,
            wheelPlan: quote?.wheelPlan,
            colour: quote?.colour,
            fromQuote: true,
            year: quote?.year,
            weight: quote?.revenueWeight
          }}
          className="option-card"
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
  );

  const renderAcceptRejectButtons = () => (
    <div className="accept-reject-buttons">
      <button
        onClick={handleOpenModal}
        className="accept-btn"
        disabled={confirmLoading || rejectLoading}
      >
        ✅ {confirmLoading ? "Processing..." : "Accept & Arrange Collection"}
      </button>
      <button
        onClick={handleOpenRejectModal}
        className="reject-btn"
        disabled={confirmLoading || rejectLoading}
      >
        ❌ {rejectLoading ? "Processing..." : "Reject Offer"}
      </button>
    </div>
  );

  const renderAcceptButton = () => (
    <div className="accept-offer">
      <button
        onClick={handleOpenModal}
        className="accept-btn"
        disabled={confirmLoading}
      >
        ✅ {confirmLoading ? "Processing..." : "Accept & Arrange Collection"}
      </button>
    </div>
  );

  return (
    <section className="quote-result">
      <div className="valuation-summary">
        <h2>Your Vehicle Valuation</h2>
        <div className="summary-box">
          <div>
            <span>Registration</span>
            <strong>{quote?.regNumber || "N/A"}</strong>
          </div>
          <div>
            <span>Revenue Weight</span>
            <strong>{quote?.revenueWeight ?? "N/A"} kg</strong>
          </div>
          <div>
            <span>{priceLabel}</span>
            <strong className="price">
              {priceToDisplay ? `£${priceToDisplay}` : "Unavailable"}
            </strong>
          </div>
        </div>

        {isManualPreviouslyRejected && hasAdminOfferPrice ? (
          <>
            <div className="manual-options">
              <h4>Offer Still Available</h4>
              <p>
                Our team previously offered a price for your vehicle, which you rejected. However, if you've changed your mind, this offer is still available for you to accept.
              </p>
            </div>
            {renderAcceptButton()}
          </>
        ) : isManualReviewed ? (
          hasAdminOfferPrice ? (
            <>
              <div className="manual-options">
                <h4>✅ Manual Valuation Complete</h4>
                <p>
                  Great news! Our team has completed the manual review of your vehicle and is pleased to offer you the price shown above.
                </p>
              </div>
              {renderAcceptRejectButtons()}
            </>
          ) : (
            <div className="manual-options">
              <h4>Manual Review Completed</h4>
              <p>
                Your manual valuation request has been reviewed by our team. Please contact us for further details.
              </p>
              {quote?.adminMessage && (
                <div className="admin-message">
                  <p><strong>Admin Note:</strong> {quote.adminMessage}</p>
                </div>
              )}
              <div className="option-buttons">
                <Link to="/contact" className="option-card">
                  <span className="emoji">📬</span>
                  <div>
                    <strong>Contact Us</strong>
                    <p>Speak to our team about your vehicle valuation.</p>
                  </div>
                </Link>
              </div>
            </div>
          )
        ) : (
          hasPrice ? (
            <>
              {renderManualOptions()}
              {renderAcceptButton()}
            </>
          ) : (
            renderManualOptions()
          )
        )}
      </div>

      <div className="vehicle-info">
        <h3>Vehicle Details</h3>
        <ul className="info-grid">
          <li>
            <span>Make:</span> {quote?.make || "N/A"}
          </li>
          <li>
            <span>Model:</span> {quote?.model || "N/A"}
          </li>
          <li>
            <span>Fuel Type:</span> {quote?.fuelType || "N/A"}
          </li>
          <li>
            <span>CO₂ Emissions:</span> {quote?.co2Emissions ?? "N/A"} g/km
          </li>
          <li>
            <span>Colour:</span> {quote?.colour || "N/A"}
          </li>
          <li>
            <span>Year:</span> {quote?.year || "N/A"}
          </li>
          <li>
            <span>Engine Capacity:</span> {quote?.engineCapacity ?? "N/A"} cc
          </li>
          <li>
            <span>Tax Status:</span> {quote?.taxStatus || "N/A"}
          </li>
          <li>
            <span>MOT Status:</span> {quote?.motStatus || "N/A"}
          </li>
          <li>
            <span>Euro Status:</span> {quote?.euroStatus || "N/A"}
          </li>
          <li>
            <span>RDE:</span> {quote?.realDrivingEmissions || "N/A"}
          </li>
          <li>
            <span>Wheel Plan:</span> {quote?.wheelPlan || "N/A"}
          </li>
        </ul>
      </div>

      <Link to="/" className="back-link">
        ← Back to Home
      </Link>

      {/* Confirm + Collection Modal */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-card">
            <h3>Confirm Quote & Collection</h3>
            <p>
              You are accepting the offer of{" "}
              <strong>
                £{priceToDisplay || "0"}
              </strong>.
            </p>

            <div className="form">
              <label>
                Available From <small>(Earliest Collection Date)</small>
                <input
                  type="date"
                  value={collectionDetails.pickupDate}
                  onChange={(e) => setCollectionDetails(prev => ({ ...prev, pickupDate: e.target.value }))}
                  min={
                    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
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
                  value={collectionDetails.contactNumber}
                  onChange={(value) => setCollectionDetails(prev => ({ ...prev, contactNumber: value }))}
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
                  value={collectionDetails.address}
                  onChange={(e) => setCollectionDetails(prev => ({ ...prev, address: e.target.value }))}
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
                onClick={() => setShowConfirmModal(false)}
                disabled={confirmLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-card">
            <h3>Reject Quote</h3>
            <p>
              Please provide a reason for rejecting the offer of{" "}
              <strong>
                £{priceToDisplay || "0"}
              </strong>.
            </p>

            {rejectFormError && (
              <div className="error-text">
                {rejectFormError}
              </div>
            )}

            <div className="form">
              <label>
                Rejection Reason
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  disabled={rejectLoading}
                  placeholder="Please explain why you're rejecting this offer..."
                  className={rejectFormError ? "field-error-border" : ""}
                />
                <small className="helper-text">
                  Minimum 10 characters required.
                </small>
              </label>
            </div>

            <div className="confirm-buttons">
              <button
                className="reject-confirm"
                onClick={handleReject}
                disabled={rejectLoading}
              >
                {rejectLoading ? "Submitting..." : "Submit Rejection"}
              </button>
              <button
                className="no"
                onClick={() => setShowRejectModal(false)}
                disabled={rejectLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuoteResult;
