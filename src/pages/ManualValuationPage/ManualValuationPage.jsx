import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestManualQuote, resetManualState } from '../../redux/slices/quoteSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import MessageCard from '../../components/common/MessageCard';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Tooltip } from 'react-tooltip';
import './ManualValuationPage.scss';
import { toast } from 'react-toastify';

const ManualValuationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Hooks
  const dispatch = useDispatch();
  const { manualStatus, manualError } = useSelector((state) => state.quote);
  const [quoteButtons, setQuoteButtons] = useState(null);

  const [quoteMessage, setQuoteMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [showError, setShowError] = useState(false);
  const [denied, setDenied] = useState(false);

  const prefill = location.state || {};

  const handleCloseMessage = () => {
    setQuoteMessage('');
    dispatch(resetManualState());
  };

  // useEffect(() => {
  //   const fromQuote = location.state?.fromQuote;
  //   const allow = sessionStorage.getItem("allowManualPage");

  //   if (fromQuote && allow === "true") {
  //     sessionStorage.removeItem("allowManualPage");
  //     setAllowed(true);
  //   } else {
  //     setAllowed(false);
  //     setDenied(true);
  //   }

  //   setChecked(true);
  // }, [location.state, navigate]);





  const formik = useFormik({
    initialValues: {
      regNumber: prefill.regNumber || '',
      make: prefill.make || '',
      model: prefill.model || '',
      fuelType: prefill.fuelType || '',
      wheelPlan: prefill.wheelPlan || '',
      weight: '',
      userEstimatedPrice: '',
      year: '',
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
      userEstimatedPrice: Yup.number()
        .typeError('Estimated price must be a number')
        .positive('Must be positive')
,
      message: Yup.string(),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setUploadError(null);
    
      try {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
          if (key === 'images') {
            selectedImages.forEach((file) => formData.append('images', file));
          } else {
            formData.append(key, value ?? '');
          }
        });
    
        const resultAction = await dispatch(requestManualQuote({ data: formData }));
    
        if (requestManualQuote.fulfilled.match(resultAction)) {
          const { status, quote } = resultAction.payload.data;
    
          switch (status) {
            case 'manual_submitted':
              setQuoteMessage(
                'Your manual quote request has been submitted successfully. Our team will review it and contact you shortly.'
              );
              setQuoteButtons([
                {
                  label: 'Go Back',
                  onClick: () => navigate(-1),
                },
                {
                  label: 'Go to Home',
                  onClick: () => navigate('/'),
                },
              ]);
              break;
            
          
            case 'manual_pending_review':
              setQuoteMessage(
                'We’ve already received a manual quote request for this vehicle. Our team is currently reviewing it. We’ll contact you once the review is complete—please stay in touch.'
              );
              break;
          
            case 'manual_reviewed':
              setQuoteMessage(
                'We’ve already reviewed your manual quote request for this vehicle. Please check your email for the details—we’ve already sent the response.'
              );
              break;
          
              case 'manual_accepted_pending_collection':
                setQuoteMessage(
                  'You’ve already accepted the quote for this vehicle. Collection is currently being arranged. Our team will contact you shortly with further details.'
                );
                break;
              
              case 'manual_accepted_collected':
                setQuoteMessage(
                  'You accepted the quote and this vehicle has already been collected. If you want to get a new quote, please submit a new request.'
                );
                break;
              
          
            default:
              setQuoteMessage(
                'An unexpected status was received. Please contact support for assistance.'
              );
              break;
          }
          
        } else {
          const errorMsg =
            resultAction?.payload?.message ||
            resultAction?.error?.message ||
            'Manual quote submission failed.';
          toast.error(errorMsg);
          setShowError(true);
        }
      } catch (error) {
        setQuoteMessage("Something went wrong while submitting. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
    
  });

  // if (!checked) {
  //   return (
  //     <div className="manual-page-loader">
  //       <p>Loading...</p>
  //     </div>
  //   );
  // }

  if (denied) {
    return (
      <div className="manual-page-wrapper">
        <MessageCard
          title="Access Denied"
          message="You can't access the manual valuation page directly. Please go through the quote process first."
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
      </div>
    );
  }

  

  const handleErrorDismiss = () => {
    setShowError(false);
    dispatch(resetManualState());
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxImages = 6;

    const newFiles = files.slice(0, maxImages - selectedImages.length);
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

  return (
    <div className="manual-valuation-page">
    {quoteMessage && (
  <MessageCard
    title="Quote Submitted"
    message={quoteMessage}
    buttons={
      quoteButtons || [
        {
          label: 'OK',
          onClick: handleCloseMessage,
        },
        {
          label: 'Go to Home',
          onClick: () => navigate('/'),
        },
      ]
    }
  />
)}


{manualError && !quoteMessage && (
            <MessageCard
              message={manualError}
              buttons={[
                {
                  label: 'OK',
                  onClick: handleCloseMessage,
                },
              ]}
            />
          )}


      {showError && (
        <div className="overlay-error">
          <div className="error-card">
            <div className="error-content">
              <h3>Something went wrong</h3>
              <p>{manualError || "Please try again later."}</p>
              <button onClick={handleErrorDismiss}>OK</button>
            </div>
          </div>
        </div>
      )}

     




      <div className="container">
        {/* Header Section */}
        <div className="page-header">
  <div className="header-content">
    <div className="icon-wrapper">
      <svg className="valuation-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 21L9.5 17.5L13 19L9.5 20.5L8 21Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M19 12L20.5 8.5L24 10L20.5 11.5L19 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </div>

    <h1>
      {prefill.reason === 'value-higher'
        ? 'Request a Better Offer'
        : 'Manual Vehicle Valuation'}
    </h1>

    <p className="subheading">
      {prefill.reason === 'value-higher' ? (
        <>
          Think your car is worth more? Submit a custom request and our team will review it for a better offer.
        </>
      ) : (
        <>
          No instant quote available? Our valuation experts will personally assess your vehicle and provide you with an accurate price within 24–48 hours.
        </>
      )}
    </p>

    <div className="features">
      {prefill.reason === 'value-higher' ? (
        <>
          <div className="feature"><span className="feature-icon">📈</span><span>Send Your Price Expectation</span></div>
          <div className="feature"><span className="feature-icon">🔍</span><span>We’ll Review Manually</span></div>
          <div className="feature"><span className="feature-icon">💬</span><span>Personal Feedback from Admin</span></div>
        </>
      ) : (
        <>
          <div className="feature"><span className="feature-icon">✓</span><span>Expert Assessment</span></div>
          <div className="feature"><span className="feature-icon">✓</span><span>24–48 Hour Response</span></div>
          <div className="feature"><span className="feature-icon">✓</span><span>No Hidden Fees</span></div>
        </>
      )}
    </div>
  </div>
</div>


        {/* Form Section */}
        <div className="form-card">
          <div className="form-header">
            <h2>Vehicle Details</h2>
            <p>Please fill in the information below for accurate valuation</p>
          </div>

          <form className="manual-form" onSubmit={formik.handleSubmit} noValidate>
            {/* Section 1: Basic Information */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-number">1</span>
                Basic Information
              </h3>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="regNumber">
                    Registration Number <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="regNumber" 
                      placeholder="e.g., ABC-123"
                      className={formik.touched.regNumber && formik.errors.regNumber ? 'error' : ''}
                      {...formik.getFieldProps('regNumber')} 
                    />
                    <div className="input-icon">🚗</div>
                  </div>
                  {formik.touched.regNumber && formik.errors.regNumber && (
                    <div className="error-message">{formik.errors.regNumber}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="make">
                    Make <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="make" 
                      placeholder="e.g., Toyota"
                      className={formik.touched.make && formik.errors.make ? 'error' : ''}
                      {...formik.getFieldProps('make')} 
                    />
                    <div className="input-icon">🏭</div>
                  </div>
                  {formik.touched.make && formik.errors.make && (
                    <div className="error-message">{formik.errors.make}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="model">
                    Model <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="model" 
                      placeholder="e.g., Camry"
                      className={formik.touched.model && formik.errors.model ? 'error' : ''}
                      {...formik.getFieldProps('model')} 
                    />
                    <div className="input-icon">🚙</div>
                  </div>
                  {formik.touched.model && formik.errors.model && (
                    <div className="error-message">{formik.errors.model}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="fuelType">
                    Fuel Type <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="fuelType" 
                      placeholder="e.g., Petrol"
                      className={formik.touched.fuelType && formik.errors.fuelType ? 'error' : ''}
                      {...formik.getFieldProps('fuelType')} 
                    />
                    <div className="input-icon">⛽</div>
                  </div>
                  {formik.touched.fuelType && formik.errors.fuelType && (
                    <div className="error-message">{formik.errors.fuelType}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="year">
                    Year <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      id="year" 
                      placeholder="e.g., 2019"
                      className={formik.touched.year && formik.errors.year ? 'error' : ''}
                      {...formik.getFieldProps('year')} 
                    />
                    <div className="input-icon">📅</div>
                  </div>
                  {formik.touched.year && formik.errors.year && (
                    <div className="error-message">{formik.errors.year}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Technical Specifications */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-number">2</span>
                Technical Specifications
              </h3>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="wheelPlan">
                    Wheel Plan <span className="required">*</span>
                    <span className="info-icon" data-tooltip-id="wheelplan-tip">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="m9,9 h0 m3.5,0 v6 m0,-3 h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <Tooltip id="wheelplan-tip" place="top" content="Drive configuration: 2WD (Front/Rear), 4WD, AWD" />
                  </label>
                  <div className="input-wrapper">
                    <input 
                      type="text" 
                      id="wheelPlan" 
                      placeholder="e.g., AWD"
                      className={formik.touched.wheelPlan && formik.errors.wheelPlan ? 'error' : ''}
                      {...formik.getFieldProps('wheelPlan')} 
                    />
                    <div className="input-icon">🛞</div>
                  </div>
                  {formik.touched.wheelPlan && formik.errors.wheelPlan && (
                    <div className="error-message">{formik.errors.wheelPlan}</div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="weight">
                    Estimated Weight (kg)
                    <span className="optional">(Optional)</span>
                    <span className="info-icon" data-tooltip-id="weight-tip">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="m9,9 h0 m3.5,0 v6 m0,-3 h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <Tooltip id="weight-tip" place="top" content="Vehicle's approximate weight helps calculate accurate value. Check vehicle manual or online specs." />
                  </label>
                  <div className="input-wrapper">
                    <input 
                      type="number" 
                      id="weight" 
                      placeholder="e.g., 1500"
                      className={formik.touched.weight && formik.errors.weight ? 'error' : ''}
                      {...formik.getFieldProps('weight')} 
                    />
                    <div className="input-icon">⚖️</div>
                  </div>
                  {formik.touched.weight && formik.errors.weight && (
                    <div className="error-message">{formik.errors.weight}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: Additional Information */}
            <div className="form-section">
              <h3 className="section-title">
                <span className="section-number">3</span>
                Additional Information
              </h3>

              <div className="form-group full-width">
                <label htmlFor="message">
                  Additional Details <span className="optional">(Optional)</span>
                </label>
                <textarea 
                  id="message" 
                  rows="4" 
                  placeholder="Provide condition, history, or modifications..."
                  {...formik.getFieldProps('message')} 
                />
              </div>

               {/* Image Upload Section  */}
      <div className="form-group full-width">
        <label htmlFor="images">
          Upload Vehicle Photos <span className="optional">(Optional)</span>
        </label>
        <div className="file-upload-area">
        <input
  type="file"
  id="images"
  accept="image/*"
  multiple
  onChange={handleImageChange}
  disabled={imagePreviews.length >= 6}
/>

          <div className="upload-content">
            <div className="upload-icon">
            <svg viewBox="0 0 24 24" fill="none">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <polyline points="7,10 12,5 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <line x1="12" y1="5" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
            </div>
            <p className="upload-text"><strong>Click to upload</strong> or drag and drop</p>
            <p className="upload-subtext">PNG, JPG or JPEG (Max 5MB each)</p>
          </div>
        </div>

        {imagePreviews.length > 0 && (
  <div className="image-preview-gallery">
    {imagePreviews.map((src, idx) => (
      <div key={idx} className="image-preview-wrapper">
        <img src={src} alt={`Preview ${idx}`} className="image-thumb" />
        <button
          type="button"
          className="remove-image-btn"
          onClick={() => handleRemoveImage(idx)}
        >
          &times;
        </button>
      </div>
    ))}
  </div>
)}

      </div>

            </div>

            {/* SECTION 4: Estimated Price */}
            <div className="form-section">
            <h3 className="section-title">
                <span className="section-number">4</span>
                Expected Price
              </h3>
  <div className="form-group full-width">
    <label htmlFor="expectedPrice">
      Your Expected Price in GBP <span className="optional">(Optional)</span>
      <span className="info-icon" data-tooltip-id="priceTip">
                      <svg viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                        <path d="m9,9 h0 m3.5,0 v6 m0,-3 h2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </span>
                    <Tooltip id="priceTip" place="top" content="Please enter the amount you expect to receive (in GBP £) " />
    </label>
    <div className="input-wrapper">
      <input
        type="number"
        id="userEstimatedPrice"
        placeholder="e.g., £15000"
        className={formik.touched.userEstimatedPrice && formik.errors.userEstimatedPrice ? 'error' : ''}
  {...formik.getFieldProps('userEstimatedPrice')}
      />
      <div className="input-icon">£</div>
    </div>
    {formik.touched.userEstimatedPrice && formik.errors.userEstimatedPrice && (
  <div className="error-message">{formik.errors.userEstimatedPrice}</div>
)}

  </div>
</div>



            {/* Submit */}
            <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
  {isSubmitting ? (
    <span className="loading-spinner"></span>
  ) : (
    <>
      <span className="btn-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polygon points="22,2 15,22 11,13 2,9 22,2" fill="currentColor"/>
        </svg>
      </span>
      Submit Valuation Request
    </>
  )}
</button>
{uploadError && <div className="error-message">{uploadError}</div>}

              <p className="submit-note">🔒 Your information is secure and will only be used for valuation purposes</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManualValuationPage;
