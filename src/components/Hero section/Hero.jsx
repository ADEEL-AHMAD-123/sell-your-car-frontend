import React, { useState } from 'react';
import './Hero.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getQuote, resetQuote } from '../../redux/slices/quoteSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import MessageCard from '../../components/common/MessageCard';

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [quoteMessage, setQuoteMessage] = useState('');
  const { isLoading, error } = useSelector((state) => state.quote);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleCloseMessage = () => {
    setQuoteMessage('');
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

      setQuoteMessage('');
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
          const { status, quote } = resultAction.payload.data;
          const responseMessage=resultAction.payload.message

          switch (status) {
            case 'accepted_collected':
              setQuoteMessage(
                'This vehicle has already been collected after accepting a quote. If you want to get a new quote, please submit a new request.'
              );
              break;
          
            case 'accepted_pending_collection':
              setQuoteMessage(
                'You have already accepted a quote for this vehicle. Collection is being arranged. Our team will contact you shortly with further details.'
              );
              break;
          
            case 'cached_quote':
              sessionStorage.setItem('allowQuoteResultPage', 'true');
              navigate('/quote-result', { state: { fromQuote: true } });
              break;
          
            case 'manual_pending_review':
              setQuoteMessage(
                'We’ve already received a manual quote request for this vehicle. Our team is reviewing it. We’ll contact you once the review is complete—please stay in touch.'
              );
              break;
          
            case 'manual_reviewed':
              sessionStorage.setItem('allowQuoteResultPage', 'true');
              navigate('/quote-result', { state: { fromQuote: true } });
              break;
          
           
          
            case 'new_generated':
              sessionStorage.setItem('allowQuoteResultPage', 'true');
              navigate('/quote-result', { state: { fromQuote: true } });
              break;
          
            default:
              setQuoteMessage(responseMessage || 'Something went wrong. Please try again or contact support.');
              break;
          }
          
        } else {
          const errorMsg =
            resultAction?.payload?.message ||
            resultAction?.error?.message ||
            'Quote request failed.';
          setQuoteMessage(errorMsg);
        }
      } catch (err) {
        setQuoteMessage('Unexpected error occurred. Try again later.');
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
            <button type="submit" disabled={isLoading || !formik.values.regNumber}>
              {isLoading ? 'Checking...' : 'Get Your Quote'}
            </button>
          </form>

          {showInputError && <div className="hero__error">{formik.errors.regNumber}</div>}
          <p className="hero__note">Trusted by thousands across the UK.</p>

          {quoteMessage && (
            <MessageCard
              message={quoteMessage}
              buttons={[
                {
                  label: 'OK',
                  onClick: handleCloseMessage,
                },
              ]}
            />
          )}

          {error && !quoteMessage && (
            <MessageCard
              message={error}
              buttons={[
                {
                  label: 'OK',
                  onClick: handleCloseMessage,
                },
              ]}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
