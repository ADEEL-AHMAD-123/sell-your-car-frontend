import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { 
  loginUser, 
  resendVerificationEmail, 
  clearAuthError // Import the new clearAuthError action
} from '../../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faEyeSlash, 
  faEnvelope, 
  faLock,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import Logo from '../../components/common/Logo/Logo';
import '../../styles/shared/AuthForm.scss';

const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // We're now using authError for all specific authentication errors
  const { isLoading, authError, resendLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showResend, setShowResend] = useState(false); // New state to control resend form visibility
  const [resendEmail, setResendEmail] = useState(''); // New state to hold the email for resending

  const formik = useFormik({
    initialValues: { 
      email: '', 
      password: '' 
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      // Clear any previous resend state
      setShowResend(false); 
      dispatch(clearAuthError());

      try {
        const result = await dispatch(
          loginUser({
            data: {
              email: values.email,
              password: values.password,
            },
          })
        );

        if (loginUser.fulfilled.match(result)) {
          toast.success('Welcome back! Login successful.');
          navigate('/');
          if (onClose) onClose();
        } else if (loginUser.rejected.match(result)) {
          // Check for the specific unverified email error from the backend
          if (result.payload?.message.includes('Please verify your email')) {
            setShowResend(true);
            setResendEmail(values.email); // Pre-fill the resend form with the user's email
          }
          toast.error(result.payload?.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

  // New handler for resending the email
  const handleResend = async () => {
    try {
      const result = await dispatch(resendVerificationEmail({ data: { email: resendEmail } }));
      if (resendVerificationEmail.fulfilled.match(result)) {
        toast.success('A new verification email has been sent. Please check your inbox!');
        setShowResend(false);
      } else if (resendVerificationEmail.rejected.match(result)) {
        toast.error(result.payload?.message || 'Failed to resend verification email.');
      }
    } catch (error) {
      toast.error('Something went wrong while trying to resend the email.');
    }
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        {onClose && (
          <button className="auth-modal__close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}

      

        <div className="auth-modal__content">
          <div className="auth-modal__header">
            <h2>Welcome Back</h2>
            <p>Sign in to your SellYourCar account</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="auth-form">
            {/* Global error from Redux */}
            {authError && (
              <div className="form-error form-error--global">
                {authError}
              </div>
            )}

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="form-input-wrapper">
                <FontAwesomeIcon icon={faEnvelope} className="form-input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`form-input ${
                    formik.touched.email && formik.errors.email ? 'form-input--error' : ''
                  }`}
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="form-error">{formik.errors.email}</div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="form-input-wrapper">
                <FontAwesomeIcon icon={faLock} className="form-input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`form-input ${
                    formik.touched.password && formik.errors.password ? 'form-input--error' : ''
                  }`}
                  {...formik.getFieldProps('password')}
                />
                <button
                  type="button"
                  className="form-input-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="form-error">{formik.errors.password}</div>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="auth-form__forgot">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className={`auth-btn auth-btn--primary ${isLoading ? 'auth-btn--loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="auth-btn__spinner"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* New: Resend Verification Form */}
          {showResend && (
            <div className="auth-resend-form mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Your email is not verified. To receive a new verification link, click the button below.
              </p>
              <div className="form-group">
                <input 
                  type="email" 
                  value={resendEmail} 
                  onChange={(e) => setResendEmail(e.target.value)} 
                  className="form-input" 
                  placeholder="Enter your email"
                  aria-label="Email for resending verification link"
                />
              </div>
              <button 
                type="button" 
                onClick={handleResend}
                className={`auth-btn auth-btn--secondary mt-2 w-full ${resendLoading ? 'auth-btn--loading' : ''}`}
                disabled={resendLoading}
              >
                {resendLoading ? (
                  <>
                    <div className="auth-btn__spinner"></div>
                    Sending...
                  </>
                ) : (
                  'Resend Verification Email'
                )}
              </button>
            </div>
          )}

          {/* Switch to Register */}
          <div className="auth-switch mt-4">
            <p>Don't have an account? <Link to="/signup">Create one here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;