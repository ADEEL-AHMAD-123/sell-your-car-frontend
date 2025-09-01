import React, { useEffect } from "react";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from "./QuoteModals.module.scss"; // Import the SCSS module

const QuoteModals = ({
  showConfirmModal,
  setShowConfirmModal,
  showRejectModal,
  setShowRejectModal,
  priceToDisplay,
  collectionDetails,
  setCollectionDetails,
  rejectionReason,
  setRejectionReason,
  handleConfirm,
  handleReject,
  confirmLoading,
  rejectLoading,
  formErrors,
  rejectFormError,
}) => {
  useEffect(() => {
    if (showConfirmModal || showRejectModal) {
      document.body.classList.add(styles["modal-open"]);
    } else {
      document.body.classList.remove(styles["modal-open"]);
    }
    return () => {
      document.body.classList.remove(styles["modal-open"]);
    };
  }, [showConfirmModal, showRejectModal]);

  return (
    <>
      {/* Confirm + Collection Modal */}
      {showConfirmModal && (
        <div className={styles["confirm-modal-overlay"]}>
          <div className={styles["confirm-modal-card"]}>
            <h3>Confirm Quote & Collection</h3>
            <p>
              You are accepting the offer of{" "}
              <strong>£{priceToDisplay || "0"}</strong>.
            </p>

            <div className={styles.form}>
              <label>
                Available From <small>(Earliest Collection Date)</small>
                <input
                  type="date"
                  value={collectionDetails.pickupDate}
                  onChange={(e) =>
                    setCollectionDetails((prev) => ({
                      ...prev,
                      pickupDate: e.target.value,
                    }))
                  }
                  min={
                    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  disabled={confirmLoading}
                  className={formErrors.pickupDate ? styles["field-error-border"] : ""}
                />
                <small className={styles["helper-text"]}>
                  We'll arrange pickup on or after this date.
                </small>
                {formErrors.pickupDate && (
                  <small className={styles["field-error"]}>{formErrors.pickupDate}</small>
                )}
              </label>

              <label>
                Contact Number
                <PhoneInput
                  country={'gb'}
                  value={collectionDetails.contactNumber}
                  onChange={(value) =>
                    setCollectionDetails((prev) => ({
                      ...prev,
                      contactNumber: value,
                    }))
                  }
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
                  // Using classNames instead of inline styles for better modularity
                  containerClass={styles["phone-input-container"]}
                  inputClass={styles["phone-input-field"]}
                  buttonClass={styles["phone-input-button"]}
                />
                {formErrors.contactNumber && (
                  <small className={styles["field-error"]}>
                    {formErrors.contactNumber}
                  </small>
                )}
              </label>

              <label>
                Collection Address
                <textarea
                  value={collectionDetails.address}
                  onChange={(e) =>
                    setCollectionDetails((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={3}
                  disabled={confirmLoading}
                  className={formErrors.address ? styles["field-error-border"] : ""}
                />
                {formErrors.address && (
                  <small className={styles["field-error"]}>{formErrors.address}</small>
                )}
              </label>
            </div>

            <div className={styles["confirm-buttons"]}>
              <button
                className={styles.yes}
                onClick={handleConfirm}
                disabled={confirmLoading}
              >
                {confirmLoading ? "Confirming..." : "Confirm & Submit"}
              </button>
              <button
                className={styles.no}
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
        <div className={styles["confirm-modal-overlay"]}>
          <div className={styles["confirm-modal-card"]}>
            <h3>Reject Quote</h3>
            <p>
              Please provide a reason for rejecting the offer of{" "}
              <strong>£{priceToDisplay || "0"}</strong>.
            </p>

            {rejectFormError && (
              <div className={styles["error-text"]}>
                {rejectFormError}
              </div>
            )}

            <div className={styles.form}>
              <label>
                Rejection Reason
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  disabled={rejectLoading}
                  className={rejectFormError ? styles["field-error-border"] : ""}
                />
              </label>
            </div>

            <div className={styles["confirm-buttons"]}>
              <button
                className={styles["reject-confirm"]}
                onClick={handleReject}
                disabled={rejectLoading}
              >
                {rejectLoading ? "Rejecting..." : "Reject Offer"}
              </button>
              <button
                className={styles.no}
                onClick={() => setShowRejectModal(false)}
                disabled={rejectLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteModals;