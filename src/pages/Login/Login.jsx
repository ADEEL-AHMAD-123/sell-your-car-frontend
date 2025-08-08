import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
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
import '../../styles/AuthForm.scss';

const Login = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

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
          toast.error(result.payload?.message || 'Login failed. Please try again.');
        }
      } catch (error) {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

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

        {/* Logo */}
        <div className="auth-modal__logo">
          <Logo />
        </div>

        <div className="auth-modal__content">
          <div className="auth-modal__header">
            <h2>Welcome Back</h2>
            <p>Sign in to your SellYourCar account</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="auth-form">
            {/* Global error from Redux */}
            {error?.message && (
              <div className="form-error form-error--global">
                {error.message}
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

          {/* Switch to Register */}
          <div className="auth-switch">
            <p>Don't have an account? <Link to="/signup">Create one here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;