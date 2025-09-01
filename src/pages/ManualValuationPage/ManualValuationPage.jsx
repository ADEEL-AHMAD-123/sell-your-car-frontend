import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestManualQuote, resetManualState } from '../../redux/slices/quoteSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import MessageCard from '../../components/common/MessageCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './ManualValuationPage.module.scss';
import { toast } from 'react-toastify';

const FormInput = ({ id, label, icon, placeholder, type = 'text', required = false, optional = false, formik, prefill, tooltip }) => {
  const hasValue = !!prefill?.[id];
  
  return (
    <div className={styles.formGroup}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
        {optional && <span className={styles.optional}>(Optional)</span>}
        {tooltip && (
          <span className={styles.tooltipWrapper} title={tooltip}>
            <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="m9,9 h0 m3.5,0 v6 m0,-3 h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className={styles.tooltipText}>{tooltip}</span>
          </span>
        )}
      </label>
      <div className={styles.inputWrapper}>
        <span className={styles.inputIcon}>{icon}</span>
        <input
          type={type}
          id={id}
          value={hasValue ? prefill[id] : undefined}
          placeholder={placeholder}
          readOnly={hasValue}
          className={`${styles.input} ${formik.touched[id] && formik.errors[id] ? styles.error : ''} ${hasValue ? styles.locked : ''}`}
          {...(!hasValue ? formik.getFieldProps(id) : {})}
        />
      </div>
      {formik.touched[id] && formik.errors[id] && (
        <div className={styles.errorMessage}>{formik.errors[id]}</div>
      )}
    </div>
  );
};

const ManualValuationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { manualError } = useSelector((state) => state.quote);

  const [messageCard, setMessageCard] = useState({ isVisible: false, title: '', message: '', type: 'info', buttons: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isAccessChecked, setIsAccessChecked] = useState(false);
  
  const prefill = location.state || {};

  useEffect(() => {
    if (!location.state?.fromQuote) {
      setMessageCard({
        isVisible: true,
        title: 'Access Denied',
        message: "Please go through the quote process first.",
        type: 'error',
        buttons: [{ label: 'Go to Home', onClick: () => navigate('/') }],
      });
    }
    setIsAccessChecked(true);
  }, [location.state, navigate]);

  useEffect(() => {
    if (manualError) {
      setMessageCard({
        isVisible: true,
        title: 'Submission Failed',
        message: manualError,
        type: 'error',
        buttons: [
          { label: 'OK', onClick: handleCloseMessage },
          { label: 'Go to Home', onClick: () => navigate('/') },
        ],
      });
    }
  }, [manualError, navigate]);

  const handleCloseMessage = () => {
    setMessageCard({ isVisible: false, title: '', message: '', type: 'info', buttons: null });
    dispatch(resetManualState());
  };

  const formik = useFormik({
    initialValues: {
      regNumber: prefill.regNumber || '',
      make: prefill.make || '',
      model: prefill.model || '',
      fuelType: prefill.fuelType || '',
      wheelPlan: prefill.wheelPlan || '',
      weight: prefill.weight || '',
      userEstimatedPrice: '',
      year: prefill.year || '',
      message: '',
      images: [],
    },
    validationSchema: Yup.object({
      regNumber: Yup.string().required('Registration number is required'),
      make: Yup.string().required('Make is required'),
      model: Yup.string().required('Model is required'),
      fuelType: Yup.string().required('Fuel type is required'),
      wheelPlan: Yup.string().required('Wheel plan is required'),
      year: Yup.number()
        .typeError('Year must be a number')
        .min(1900, 'Year must be after 1900')
        .max(new Date().getFullYear(), 'Year cannot be in the future')
        .required('Year is required'),
      weight: Yup.number().nullable().typeError('Weight must be a number'),
      userEstimatedPrice: Yup.number().typeError('Price must be a number').positive('Must be positive'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        const formData = new FormData();
        
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'images') {
            selectedImages.forEach((file) => formData.append('images', file));
          } else if (key === 'weight') {
            if (!prefill.weight && value !== '' && value !== null && !isNaN(value)) {
              formData.append('weight', value);
            }
          } else {
            formData.append(key, value ?? '');
          }
        });

        const result = await dispatch(requestManualQuote({ data: formData }));
        
        if (requestManualQuote.fulfilled.match(result)) {
          const { status } = result.payload.data;
          const messages = {
            manual_info_appended: 'Quote submitted successfully. Our team will review and contact you shortly.',
            manual_pending_review: 'Request already pending review. We\'ll contact you once complete.',
            manual_reviewed: 'Quote already reviewed. Please check your email for details.',
            manual_accepted_pending_collection: 'Quote accepted. Collection is being arranged.',
            manual_accepted_collected: 'Vehicle already collected. Submit a new request if needed.',
            auto_accepted_not_collected: 'Auto quote already accepted. Collection being arranged.',
            auto_accepted_collected: 'Vehicle already collected after auto quote acceptance.',
          };
          
          setMessageCard({
            isVisible: true,
            title: status.includes('accepted') || status.includes('collected') ? 'Quote Status' : 'Quote Submitted',
            message: messages[status] || 'Request processed successfully.',
            type: 'info',
            buttons: [{ label: 'Go to Home', onClick: () => navigate('/') }],
          });
        } else {
          const errorMsg = result?.payload?.message || 'Submission failed. Please try again.';
          toast.error(errorMsg);
          setMessageCard({
            isVisible: true,
            title: 'Submission Failed',
            message: errorMsg,
            type: 'error',
            buttons: [{ label: 'OK', onClick: handleCloseMessage }],
          });
        }
      } catch (error) {
        setMessageCard({
          isVisible: true,
          title: 'Error',
          message: 'Something went wrong. Please try again.',
          type: 'error',
          buttons: [{ label: 'OK', onClick: handleCloseMessage }],
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.slice(0, 6 - selectedImages.length);
    if (newFiles.length === 0) return;

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    formik.setFieldValue('images', [...selectedImages, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    const updatedFiles = selectedImages.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(updatedFiles);
    setImagePreviews(updatedPreviews);
    formik.setFieldValue('images', updatedFiles);
  };

  if (!isAccessChecked) {
    return <div className={styles.loader}>Loading...</div>;
  }

  return (
    <div className={styles.manualValuationPage}>
      {(messageCard.isVisible || manualError) && (
        <MessageCard
          title={messageCard.title}
          message={messageCard.message || manualError}
          type={messageCard.type || 'error'}
          buttons={messageCard.buttons || [
            { label: 'OK', onClick: handleCloseMessage },
            { label: 'Go to Home', onClick: () => navigate('/') },
          ]}
        />
      )}

      {!messageCard.isVisible && (
        <div className={styles.container}>
          <div className={styles.header}>
            <div className={styles.headerIcon}>
              <svg className={styles.valuationIcon} viewBox="0 0 24 24" fill="none">
                <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M8 21L9.5 17.5L13 19L9.5 20.5L8 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M19 12L20.5 8.5L24 10L20.5 11.5L19 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className={styles.title}>
              {prefill.reason === 'value-higher' ? 'Request Better Offer' : 'Manual Vehicle Valuation'}
            </h1>
            <p className={styles.subtitle}>
              {prefill.reason === 'value-higher' 
                ? 'Think your car is worth more? Submit a custom request and our team will review it for a better offer.'
                : 'No instant quote available? Our valuation experts will personally assess your vehicle and provide accurate pricing within 24-48 hours.'}
            </p>
            <div className={styles.features}>
              {prefill.reason === 'value-higher' ? (
                <>
                  <div className={styles.feature}><span className={styles.featureIcon}>📈</span>Send Your Price Expectation</div>
                  <div className={styles.feature}><span className={styles.featureIcon}>🔍</span>Manual Expert Review</div>
                  <div className={styles.feature}><span className={styles.featureIcon}>💬</span>Personal Admin Feedback</div>
                </>
              ) : (
                <>
                  <div className={styles.feature}><span className={styles.featureIcon}>✨</span>Expert Assessment</div>
                  <div className={styles.feature}><span className={styles.featureIcon}>⚡</span>24-48 Hour Response</div>
                  <div className={styles.feature}><span className={styles.featureIcon}>🛡️</span>No Hidden Fees</div>
                </>
              )}
            </div>
          </div>

          <form className={styles.form} onSubmit={formik.handleSubmit} noValidate>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Vehicle Information</h3>
              <div className={styles.grid}>
                <FormInput id="regNumber" label="Registration Number" icon="🚗" placeholder="e.g., ABC-123" required formik={formik} prefill={prefill} />
                <FormInput id="make" label="Make" icon="🏭" placeholder="e.g., Toyota" required formik={formik} prefill={prefill} />
                <FormInput id="model" label="Model" icon="🚙" placeholder="e.g., Camry" required formik={formik} prefill={prefill} />
                <FormInput id="fuelType" label="Fuel Type" icon="⛽" placeholder="e.g., Petrol" required formik={formik} prefill={prefill} />
                <FormInput id="year" label="Year of Manufacture" icon="📅" placeholder="e.g., 2019" type="number" required formik={formik} prefill={prefill} />
                <FormInput id="wheelPlan" label="Wheel Plan" icon="🛞" placeholder="e.g., AWD" required formik={formik} prefill={prefill} tooltip="Drive configuration: 2WD, 4WD, AWD" />
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Additional Details</h3>
              <FormInput id="weight" label="Kerb Weight (kg)" icon="⚖️" placeholder="e.g., 1500" type="number" optional formik={formik} prefill={prefill} tooltip="Vehicle's kerb weight helps us provide the best possible offer" />
              <FormInput id="userEstimatedPrice" label="Your Expected Price in GBP" icon="£" placeholder="e.g., 15000" type="number" optional formik={formik} prefill={prefill} />
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Message <span className={styles.optional}>(Optional)</span></label>
                <textarea
                  className={styles.textarea}
                  rows="4"
                  placeholder="Condition, service history, modifications..."
                  {...formik.getFieldProps('message')}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Photos <span className={styles.optional}>(Optional, max 6)</span></label>
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={imagePreviews.length >= 6}
                    className={styles.fileInput}
                  />
                  <label htmlFor="images" className={styles.uploadLabel}>
                    <div className={styles.uploadIcon}>📷</div>
                    <span>Click to upload photos</span>
                    <small>PNG, JPG (Max 5MB each)</small>
                  </label>
                </div>
                
                {imagePreviews.length > 0 && (
                  <div className={styles.imageGrid}>
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className={styles.imagePreview}>
                        <img src={src} alt={`Preview ${idx}`} />
                        <button type="button" onClick={() => handleRemoveImage(idx)} className={styles.removeBtn}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? <span className={styles.spinner}></span> : 'Submit Request'}
              </button>
              <p className={styles.securityNote}>🔒 Your information is secure</p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManualValuationPage;