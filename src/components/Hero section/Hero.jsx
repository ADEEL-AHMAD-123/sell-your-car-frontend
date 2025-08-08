import React, { useState } from 'react';
import './Hero.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getQuote, resetQuote } from '../../redux/slices/quoteSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import MessageCard from '../../components/common/MessageCard';
import { getLoggedInUser } from '../../redux/slices/authSlice';

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [messageCardState, setMessageCardState] = useState({
    isVisible: false,
    title: '',
    message: '',
    type: 'info',
    buttons: [],
  });

  const { isLoading, error } = useSelector((state) => state.quote);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleCloseMessage = () => {
    setMessageCardState(prev => ({ ...prev, isVisible: false }));
    dispatch(resetQuote());
  };

  const formik = useFormik({
    initialValues: {
      regNumber: '',
    },
    validationSchema: Yup.object({
      regNumber: Yup.string()
        .required('Registration number is required')
        .matches(/^[A-Za-z0-9\s]{4,10}$/, 'Enter a valid registration number'),
    }),
    onSubmit: async (values) => {
      if (!isAuthenticated) {
        toast.warn('Please login first to get a quote.');
        navigate('/login');
        return;
      }

      setMessageCardState(prev => ({ ...prev, isVisible: false }));

      try {
        const resultAction = await dispatch(
          getQuote({
            data: {
              regNumber: values.regNumber.toUpperCase(),
              postcode: user?.postcode || '',
              userId: user?._id || '',
            },
          })
        );

        if (getQuote.fulfilled.match(resultAction)) {

          await dispatch(getLoggedInUser());

          const { status } = resultAction.payload.data;
          const responseMessage = resultAction.payload.message;

          switch (status) {
            case 'accepted_collected':
              setMessageCardState({
                isVisible: true,
                title: 'Vehicle Already Processed',
                message: 'This vehicle has already been collected after accepting a quote. If you want to get a new quote, please submit a new request.',
                type: 'info',
                buttons: [{ label: 'OK', onClick: handleCloseMessage }],
              });
              break;

            case 'accepted_pending_collection':
              setMessageCardState({
                isVisible: true,
                title: 'Quote Already Accepted',
                message: 'You have already accepted a quote for this vehicle. Collection is being arranged. Our team will contact you shortly with further details.',
                type: 'info',
                buttons: [{ label: 'OK', onClick: handleCloseMessage }],
              });
              break;

            case 'cached_quote':
              sessionStorage.setItem('allowQuoteResultPage', 'true');
              navigate('/quote-result', { state: { fromQuote: true } });
              break;
            
            case 'manual_pending_review':
              setMessageCardState({
                isVisible: true,
                title: 'Manual Review Pending',
                message: 'We’ve already received a manual quote request for this vehicle. Our team is reviewing it. We’ll contact you once the review is complete—please stay in touch.',
                type: 'info',
                buttons: [{ label: 'OK', onClick: handleCloseMessage }],
              });
              break;

            case 'manual_reviewed':
              sessionStorage.setItem('allowQuoteResultPage', 'true');
              navigate('/quote-result', { state: { fromQuote: true } });
              break;

            case 'new_generated':
              sessionStorage.setItem('allowQuoteResultPage', 'true');
              navigate('/quote-result', { state: { fromQuote: true } });
              break;

            case 'dvla_checks_exhausted':
              setMessageCardState({
                isVisible: true,
                title: 'DVLA Check Limit Reached',
                message: 'You have exhausted your free DVLA checks. Please contact our support team to get more.',
                type: 'error',
                buttons: [
                  { label: 'OK', onClick: handleCloseMessage },
                  {
                    label: 'Contact Support',
                    onClick: () => {
                      navigate('/contact');
                      handleCloseMessage();
                    },
                  },
                ],
              });
              break;

            default:
              setMessageCardState({
                isVisible: true,
                title: 'Quote Error',
                message: responseMessage || 'Something went wrong. Please try again or contact support.',
                type: 'error',
                buttons: [{ label: 'OK', onClick: handleCloseMessage }],
              });
              break;
          }
        } else {
          const errorMsg =
            resultAction?.payload?.message ||
            resultAction?.error?.message ||
            'Quote request failed.';
          setMessageCardState({
            isVisible: true,
            title: 'Request Failed',
            message: errorMsg,
            type: 'error',
            buttons: [{ label: 'OK', onClick: handleCloseMessage }],
          });
        }
      } catch (err) {
        setMessageCardState({
          isVisible: true,
          title: 'Unexpected Error',
          message: 'An unexpected error occurred. Please try again later.',
          type: 'error',
          buttons: [{ label: 'OK', onClick: handleCloseMessage }],
        });
      }
    },
  });

  const showInputError = formik.touched.regNumber && formik.errors.regNumber;

  return (
    <section className="hero">
      <div className="hero__overlay">
        <div className="hero__content container">
          <h1>
            Get the <span>best price</span> for your scrap car.
          </h1>
          <p>Instant quotes. Free collection. No hassle.</p>

          <form className="hero__form" onSubmit={formik.handleSubmit} noValidate>
            <input
              type="text"
              name="regNumber"
              placeholder="Vehicle Registration"
              value={formik.values.regNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={showInputError ? 'input-error' : ''}
            />
            <button
              type="submit"
              disabled={isLoading || !formik.values.regNumber}
            >
              {isLoading ? 'Checking...' : 'Get Your Quote'}
            </button>
          </form>

          {showInputError && <div className="hero__error">{formik.errors.regNumber}</div>}
          <p className="hero__note">Trusted by thousands across the UK.</p>

          {messageCardState.isVisible && (
            <MessageCard
              title={messageCardState.title}
              message={messageCardState.message}
              buttons={messageCardState.buttons}
              type={messageCardState.type}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
