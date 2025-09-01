import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

import MessageCard from "../../components/common/MessageCard";
import VehicleDetails from "./VehicleDetails.jsx";
import QuoteModals from "./QuoteModals.jsx";

import {
  confirmQuote,
  rejectQuote,
  resetConfirmStatus,
  resetRejectStatus,
} from "../../redux/slices/quoteSlice";

import styles from "./QuoteResult.module.scss";

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
    rejectStatus,
  } = useSelector((state) => state.quote);

  const [hasAccess, setHasAccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [collectionDetails, setCollectionDetails] = useState({
    pickupDate: "",
    contactNumber: "",
    address: "",
  });
  const [rejectionReason, setRejectionReason] = useState("");
  const [messageCardState, setMessageCardState] = useState({
    isVisible: false,
    title: "",
    message: "",
    buttons: null,
    type: "error",
  });
  const [formErrors, setFormErrors] = useState({});
  const [rejectFormError, setRejectFormError] = useState("");

  useEffect(() => {
    const fromQuote = location.state?.fromQuote;
    if (fromQuote && quote) {
      setHasAccess(true);
    } else {
      setHasAccess(false);
      setMessageCardState({
        isVisible: true,
        title: "Access Denied",
        message:
          "You can't access the quote result page directly. Please go through the quote process first.",
        buttons: [{ label: "Go to Home", onClick: () => navigate("/") }],
        type: "error",
      });
    }
  }, [location.state, navigate, quote]);

  useEffect(() => {
    if (confirmStatus === "succeeded") {
      navigate("/quote-confirmation", {
        state: { confirmationData: { quote, collectionDetails } },
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
              setMessageCardState((prev) => ({ ...prev, isVisible: false }));
              dispatch(resetConfirmStatus());
            },
          },
        ],
        type: "error",
      });
    }
  }, [confirmError, dispatch]);

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
              setMessageCardState((prev) => ({ ...prev, isVisible: false }));
              dispatch(resetRejectStatus());
            },
          },
        ],
        type: "error",
      });
      setShowRejectModal(false);
    }
  }, [rejectError, dispatch]);

  const validateConfirmForm = useCallback(() => {
    // ... validation logic from original component
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
  }, [collectionDetails]);

  const validateRejectForm = useCallback(() => {
    // ... validation logic from original component
    const trimmedReason = rejectionReason.trim();

    if (!trimmedReason) {
      setRejectFormError("Please provide a reason for rejection.");
      return false;
    }

    if (trimmedReason.length < 10) {
      setRejectFormError(
        "Rejection reason must be at least 10 characters long."
      );
      return false;
    }

    setRejectFormError("");
    return true;
  }, [rejectionReason]);

  const handleConfirm = async () => {
    if (!quote?._id) {
      setMessageCardState({
        isVisible: true,
        title: "Invalid Quote",
        message: "The quote ID is missing. Please try getting a new quote.",
        buttons: [{ label: "Go to Home", onClick: () => navigate("/") }],
        type: "error",
      });
      return;
    }

    if (!validateConfirmForm()) {
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
        type: "error",
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

  const hasPrice = !!quote?.estimatedScrapPrice;
  const isManualReviewed = quoteStatus === "manual_reviewed";
  const hasAdminOfferPrice = !!quote?.adminOfferPrice;
  const isManualPreviouslyRejected =
    quoteStatus === "manual_previously_rejected";

  const priceToDisplay =
    (isManualReviewed || isManualPreviouslyRejected) && hasAdminOfferPrice
      ? quote.adminOfferPrice
      : hasPrice
      ? quote.estimatedScrapPrice
      : null;

  const priceLabel = isManualPreviouslyRejected
    ? "Offered Price"
    : isManualReviewed && hasAdminOfferPrice
    ? "Admin Offered Price"
    : "Estimated Price";

  if (!quote) {
    return (
      <MessageCard
        title="No Quote Data Found"
        message="Please go back and enter your details again to get a quote."
        buttons={[
          { label: "Go Back", onClick: () => navigate(-1) },
          { label: "Go to Home", onClick: () => navigate("/") },
        ]}
        type="error"
      />
    );
  }

  if (messageCardState.isVisible) {
    return <MessageCard {...messageCardState} />;
  }

  const renderManualOptions = () => (
    <div className={styles["manual-options"]}>
      <h4>
        {hasPrice
          ? "Think your vehicle is worth more?"
          : "We couldn't calculate a price automatically"}
      </h4>
      <p>
        {hasPrice
          ? "You can request a custom valuation or contact our team."
          : "You can still continue by selecting one of the following options:"}
      </p>
      <div className={styles["option-buttons"]}>
        <Link
          to="/manual-valuation"
          state={{
            reason: hasPrice ? "value-higher" : "no-auto-price",
            regNumber: quote?.vehicleRegistration?.Vrm,
            make: quote?.vehicleRegistration?.Make,
            model: quote?.vehicleRegistration?.Model,
            fuelType: quote?.vehicleRegistration?.FuelType,
            wheelPlan: quote?.vehicleRegistration?.WheelPlan,
            colour: quote?.vehicleRegistration?.Colour,
            fromQuote: true,
            year: quote?.vehicleRegistration?.YearOfManufacture,
            weight: quote?.otherVehicleData?.KerbWeight,
          }}
          className={styles["option-card"]}
        >
          <span className={styles["emoji"]}>🛠️</span>
          <div>
            <strong>Request a Manual Valuation</strong>
            <p>Let us review your vehicle details manually.</p>
          </div>
        </Link>
        <Link to="/contact" className={styles["option-card"]}>
          <span className={styles["emoji"]}>📬</span>
          <div>
            <strong>Contact Us</strong>
            <p>Speak to our team about your vehicle or this offer.</p>
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <section className={styles["quote-result"]}>
      <div className={styles["valuation-summary"]}>
        <h2>Your Vehicle Valuation</h2>
        <div className={styles["summary-box"]}>
          <div>
            <span>Registration</span>
            <strong>{quote?.vehicleRegistration?.Vrm || "N/A"}</strong>
          </div>
          <div>
            <span>Kerb Weight</span>
            <strong>{quote?.otherVehicleData?.KerbWeight ?? "N/A"} kg</strong>
          </div>
          <div>
            <span>{priceLabel}</span>
            <strong className={styles.price}>
              {priceToDisplay ? `£${priceToDisplay}` : "Unavailable"}
            </strong>
          </div>
        </div>

        {isManualPreviouslyRejected && hasAdminOfferPrice ? (
          <>
            <div className={styles["manual-options"]}>
              <h4>Offer Still Available</h4>
              <p>
                Our team previously offered a price for your vehicle, which you
                rejected. However, if you've changed your mind, this offer is
                still available for you to accept.
              </p>
            </div>
            <div className={styles["accept-offer"]}>
              <button
                onClick={() => setShowConfirmModal(true)}
                className={styles["accept-btn"]}
                disabled={confirmLoading}
              >
                ✅ {confirmLoading ? "Processing..." : "Accept & Arrange Collection"}
              </button>
            </div>
          </>
        ) : isManualReviewed ? (
          hasAdminOfferPrice ? (
            <>
              <div className={styles["manual-options"]}>
                <h4>✅ Manual Valuation Complete</h4>
                <p>
                  Great news! Our team has completed the manual review of your
                  vehicle and is pleased to offer you the price shown above.
                </p>
              </div>
              <div className={styles["accept-reject-buttons"]}>
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className={styles["accept-btn"]}
                  disabled={confirmLoading || rejectLoading}
                >
                  ✅ {confirmLoading ? "Processing..." : "Accept & Arrange Collection"}
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className={styles["reject-btn"]}
                  disabled={confirmLoading || rejectLoading}
                >
                  ❌ {rejectLoading ? "Processing..." : "Reject Offer"}
                </button>
              </div>
            </>
          ) : (
            <div className={styles["manual-options"]}>
              <h4>Manual Review Completed</h4>
              <p>
                Your manual valuation request has been reviewed by our team.
                Please contact us for further details.
              </p>
              {quote?.adminMessage && (
                <div className={styles["admin-message"]}>
                  <p>
                    <strong>Admin Note:</strong> {quote.adminMessage}
                  </p>
                </div>
              )}
              <div className={styles["option-buttons"]}>
                <Link to="/contact" className={styles["option-card"]}>
                  <span className={styles["emoji"]}>📬</span>
                  <div>
                    <strong>Contact Us</strong>
                    <p>Speak to our team about your vehicle valuation.</p>
                  </div>
                </Link>
              </div>
            </div>
          )
        ) : hasPrice ? (
          <>
            {renderManualOptions()}
            <div className={styles["accept-offer"]}>
              <button
                onClick={() => setShowConfirmModal(true)}
                className={styles["accept-btn"]}
                disabled={confirmLoading}
              >
                ✅ {confirmLoading ? "Processing..." : "Accept & Arrange Collection"}
              </button>
            </div>
          </>
        ) : (
          renderManualOptions()
        )}
      </div>

      <VehicleDetails quote={quote} />
      <Link to="/" className={styles["back-link"]}>
        ← Back to Home
      </Link>
      <QuoteModals
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        showRejectModal={showRejectModal}
        setShowRejectModal={setShowRejectModal}
        priceToDisplay={priceToDisplay}
        collectionDetails={collectionDetails}
        setCollectionDetails={setCollectionDetails}
        rejectionReason={rejectionReason}
        setRejectionReason={setRejectionReason}
        handleConfirm={handleConfirm}
        handleReject={handleReject}
        confirmLoading={confirmLoading}
        rejectLoading={rejectLoading}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        rejectFormError={rejectFormError}
        setRejectFormError={setRejectFormError}
      />
    </section>
  );
};

export default QuoteResult;