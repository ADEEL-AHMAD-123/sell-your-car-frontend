import React from 'react';
import './Hero.scss';
import { useDispatch, useSelector } from 'react-redux';
import { quoteAsyncActions } from '../../redux/slices/quoteSlice';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.quote);

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
      try {
        const resultAction = await dispatch(
          quoteAsyncActions.getQuote({
            requestData: '',
            data: { regNumber: values.regNumber.toUpperCase() },
          })
        );

        navigate('/quote-result');
      } catch (err) {
        navigate('/quote-result');
      }
    },
  });

  return (
    <section className="hero">
      <div className="hero__overlay">
        <div className="hero__content container">
          <h1>Get the <span>best price</span> for your scrap car.</h1>
          <p>Instant quotes. Free collection. No hassle.</p>

          <form className="hero__form" onSubmit={formik.handleSubmit}>
            <input
              type="text"
              name="regNumber"
              placeholder="Vehicle Registration"
              value={formik.values.regNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isLoading}
              className={formik.touched.regNumber && formik.errors.regNumber ? 'input-error' : ''}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Get Your Quote'}
            </button>
          </form>

          {/* Validation Message */}
          {formik.touched.regNumber && formik.errors.regNumber && (
            <div className="hero__error">{formik.errors.regNumber}</div>
          )}

          <p className="hero__note">Trusted by thousands across the UK.</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
