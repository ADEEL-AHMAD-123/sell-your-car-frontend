import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Car, Settings, FileText, Ruler, ChevronDown } from 'lucide-react';

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

  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    technical: false,
    registration: false,
    dimensions: false
  });
  
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  

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
            regNumber: quote?.vehicleRegistration?.Vrm, // Updated to new schema
            make: quote?.vehicleRegistration?.Make,
            model: quote?.vehicleRegistration?.Model,
            fuelType: quote?.vehicleRegistration?.FuelType,
            wheelPlan: quote?.vehicleRegistration?.WheelPlan,
            colour: quote?.vehicleRegistration?.Colour,
            fromQuote: true,
            year: quote?.vehicleRegistration?.YearOfManufacture,
            weight: quote?.otherVehicleData?.KerbWeight
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
            <strong>{quote?.vehicleRegistration?.Vrm || "N/A"}</strong>
          </div>
          <div>
            <span>Kerb Weight</span>
            <strong>{quote?.otherVehicleData?.KerbWeight ?? "N/A"} kg</strong>
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
{/* Vehicle Info Section */}
<div className="min-h-screen bg-white p-4">
  <div className="max-w-6xl mx-auto">
    <div className="vehicle-info">
      <h3 className="text-3xl font-bold text-slate-800 text-center mb-8">Vehicle Details</h3>

      {/* ==================== Basic Information ==================== */}
      <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
        <div
          className="section-header bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border-b-2 border-slate-300"
          onClick={() => toggleSection('basic')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-700">Basic Information</h4>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.basic ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        {expandedSections.basic && (
          <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-slate-50/80">
            <div className="info-item bg-amber-50 border-2 border-amber-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-amber-700 mb-1">Registration</div>
              <div className="text-lg font-bold text-amber-900">{quote?.vehicleRegistration?.Vrm || "N/A"}</div>
            </div>
            <div className="info-item bg-amber-50 border-2 border-amber-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-amber-700 mb-1">Make</div>
              <div className="text-lg font-bold text-amber-900">{quote?.vehicleRegistration?.Make || "N/A"}</div>
            </div>
            <div className="info-item bg-amber-50 border-2 border-amber-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-amber-700 mb-1">Model</div>
              <div className="text-lg font-bold text-amber-900">{quote?.vehicleRegistration?.Model || "N/A"}</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Gross Weight</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.GrossWeight ?? "N/A"} kg</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Max Permissible Mass</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.MaxPermissibleMass ?? "N/A"}</div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== Technical Specifications ==================== */}
      <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
        <div
          className="section-header bg-gradient-to-r from-orange-50 to-red-50 p-4 cursor-pointer hover:from-orange-100 hover:to-red-100 transition-all duration-300 border-b-2 border-slate-300"
          onClick={() => toggleSection('technical')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-700">Technical Specifications</h4>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.technical ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        {expandedSections.technical && (
          <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-orange-50/30">
            <div className="info-item bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-emerald-700 mb-1">Kerb Weight</div>
              <div className="text-lg font-bold text-emerald-900">{quote?.otherVehicleData?.KerbWeight ?? "N/A"} kg</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Engine Capacity</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.EngineCapacity ?? "N/A"} cc</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">CO₂ Emissions</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.Co2Emissions ?? "N/A"} g/km</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Euro Status</div>
              <div className="text-lg font-bold text-slate-800">{quote?.otherVehicleData?.EuroStatus || "N/A"}</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Engine Number</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.EngineNumber || "N/A"}</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Transmission</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.Transmission || "N/A"}</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Transmission Type</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.TransmissionType || "N/A"}</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Transmission Code</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.TransmissionCode || "N/A"}</div>
            </div>
            <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
              <div className="text-sm font-medium text-slate-600 mb-1">Gear Count</div>
              <div className="text-lg font-bold text-slate-800">{quote?.vehicleRegistration?.GearCount ?? "N/A"}</div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== Registration & Legal ==================== */}
      <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
        <div
          className="section-header bg-gradient-to-r from-purple-50 to-pink-50 p-4 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border-b-2 border-slate-300"
          onClick={() => toggleSection('registration')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-700">Registration & Legal</h4>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.registration ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        {expandedSections.registration && (
          <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-purple-50/30">
            {[
              { label: "First Registered", value: quote?.vehicleRegistration?.DateFirstRegistered ? new Date(quote.vehicleRegistration.DateFirstRegistered).toLocaleDateString() : "N/A" },
              { label: "First Registered UK", value: quote?.vehicleRegistration?.DateFirstRegisteredUk ? new Date(quote.vehicleRegistration.DateFirstRegisteredUk).toLocaleDateString() : "N/A" },
              { label: "VIN", value: quote?.vehicleRegistration?.Vin || "N/A", break: true },
              { label: "VIN Last 5", value: quote?.vehicleRegistration?.VinLast5 || "N/A" },
              { label: "Vehicle Class", value: quote?.vehicleRegistration?.VehicleClass || "N/A" },
              { label: "Exported", value: quote?.vehicleRegistration?.Exported !== undefined ? (quote.vehicleRegistration.Exported ? "Yes" : "No") : "N/A" },
              { label: "Date Exported", value: quote?.vehicleRegistration?.DateExported ? new Date(quote.vehicleRegistration.DateExported).toLocaleDateString() : "N/A" },
              { label: "Imported", value: quote?.vehicleRegistration?.Imported !== undefined ? (quote.vehicleRegistration.Imported ? "Yes" : "No") : "N/A" }
            ].map((item, idx) => (
              <div key={idx} className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                <div className="text-sm font-medium text-slate-600 mb-1">{item.label}</div>
                <div className={`text-lg font-bold text-slate-800 ${item.break ? "break-all" : ""}`}>{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==================== Physical Specifications ==================== */}
      <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
        <div
          className="section-header bg-gradient-to-r from-green-50 to-teal-50 p-4 cursor-pointer hover:from-green-100 hover:to-teal-100 transition-all duration-300 border-b-2 border-slate-300"
          onClick={() => toggleSection('dimensions')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Ruler className="w-5 h-5 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-slate-700">Physical Specifications</h4>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.dimensions ? 'rotate-180' : ''}`}
            />
          </div>
        </div>
        {expandedSections.dimensions && (
          <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-green-50/30">
            {[
              { label: "Body Style", value: quote?.otherVehicleData?.BodyStyle || "N/A" },
              { label: "Number of Doors", value: quote?.otherVehicleData?.NumberOfDoors ?? "N/A" },
              { label: "Door Plan", value: quote?.vehicleRegistration?.DoorPlan || "N/A" },
              { label: "Door Plan Literal", value: quote?.vehicleRegistration?.DoorPlanLiteral || "N/A" },
              { label: "Wheel Plan", value: quote?.vehicleRegistration?.WheelPlan || "N/A" },
              { label: "Number of Axles", value: quote?.otherVehicleData?.NumberOfAxles ?? "N/A" },
              { label: "Seating Capacity", value: quote?.vehicleRegistration?.SeatingCapacity ?? "N/A" },
              { label: "Gross Weight", value: `${quote?.vehicleRegistration?.GrossWeight ?? "N/A"} kg` },
              { label: "Max Permissible Mass", value: quote?.vehicleRegistration?.MaxPermissibleMass ?? "N/A" }
            ].map((item, idx) => (
              <div key={idx} className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                <div className="text-sm font-medium text-slate-600 mb-1">{item.label}</div>
                <div className="text-lg font-bold text-slate-800">{item.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
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
