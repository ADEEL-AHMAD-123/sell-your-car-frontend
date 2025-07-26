import React from 'react';
import './Hero.scss';
import { useDispatch, useSelector } from 'react-redux';
import { getQuote } from '../../redux/slices/quoteSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.quote);
  const { isAuthenticated } = useSelector((state) => state.auth);

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

      try {
        const resultAction = await dispatch(
          getQuote({
            data: { regNumber: values.regNumber.toUpperCase() },
          })
        );

        if (getQuote.fulfilled.match(resultAction)) {


          sessionStorage.setItem("allowQuoteResultPage", "true");
navigate("/quote-result", { state: { fromQuote: true } });

        } else {
          const errorMessage =
            resultAction?.payload?.message ||
            resultAction?.error?.message ||
            'Quote failed, please try again.';
          toast.error(errorMessage);
        }
      } catch (err) {
        toast.error('An unexpected error occurred. Please try again later.');
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
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
