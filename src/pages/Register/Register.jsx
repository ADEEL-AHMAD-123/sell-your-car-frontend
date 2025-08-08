import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/slices/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faLock, 
  faPhone,
  faEye, 
  faEyeSlash,
  faTimes 
} from '@fortawesome/free-solid-svg-icons';
import Logo from '../../components/common/Logo/Logo';
import '../../styles/AuthForm.scss';

const Register = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(2, 'First name must be at least 2 characters')
        .max(30, 'First name must be less than 30 characters')
        .matches(/^[a-zA-Z\s]+$/, 'First name can only contain letters')
        .required('First name is required'),
      lastName: Yup.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(30, 'Last name must be less than 30 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Last name can only contain letters')
        .required('Last name is required'),
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('Password is required'),
      phone: Yup.string()
        .min(10, 'Please enter a valid phone number')
        .required('Phone number is required'),
    }),
    onSubmit: async (values) => {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      };

      try {
        const result = await dispatch(registerUser({ data: payload }));

        if (registerUser.fulfilled.match(result)) {
          toast.success('🎉 Account created successfully! Please sign in to continue.');
          navigate('/login');
          if (onClose) onClose();
        } else if (registerUser.rejected.match(result)) {
          toast.error(result.payload?.message || 'Registration failed. Please try again.');
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

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { strength, label: labels[strength] };
  };

  const passwordStrength = getPasswordStrength(formik.values.password);

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal auth-modal--register" onClick={(e) => e.stopPropagation()}>
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
            <h2>Create Your Account</h2>
            <p>Join SellYourCar today and start your journey</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="auth-form">
            {/* Name Fields Row */}
            <div className="form-row">
              {/* First Name */}
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="form-input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="form-input-icon" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    className={`form-input ${
                      formik.touched.firstName && formik.errors.firstName ? 'form-input--error' : ''
                    }`}
                    {...formik.getFieldProps('firstName')}
                  />
                </div>
                {formik.touched.firstName && formik.errors.firstName && (
                  <div className="form-error">{formik.errors.firstName}</div>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="form-input-wrapper">
                  <FontAwesomeIcon icon={faUser} className="form-input-icon" />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    className={`form-input ${
                      formik.touched.lastName && formik.errors.lastName ? 'form-input--error' : ''
                    }`}
                    {...formik.getFieldProps('lastName')}
                  />
                </div>
                {formik.touched.lastName && formik.errors.lastName && (
                  <div className="form-error">{formik.errors.lastName}</div>
                )}
              </div>
            </div>

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
                  placeholder="Create a strong password"
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
              
              {/* Password Strength Indicator */}
              {formik.values.password && (
                <div className="password-strength">
                  <div className="password-strength__bar">
                    <div 
                      className={`password-strength__fill password-strength__fill--${Math.min(passwordStrength.strength, 4)}`}
                      style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                    ></div>
                  </div>
                  <span className="password-strength__label">{passwordStrength.label}</span>
                </div>
              )}
              
              {formik.touched.password && formik.errors.password && (
                <div className="form-error">{formik.errors.password}</div>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="form-phone-wrapper">
                <PhoneInput
                  country={'gb'}
                  value={formik.values.phone}
                  onChange={(value) => formik.setFieldValue('phone', value)}
                  inputProps={{
                    id: 'phone',
                    className: `form-phone-input ${
                      formik.touched.phone && formik.errors.phone ? 'form-input--error' : ''
                    }`,
                  }}
                  containerClass="form-phone-container"
                  buttonClass="form-phone-button"
                />
              </div>
              {formik.touched.phone && formik.errors.phone && (
                <div className="form-error">{formik.errors.phone}</div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="form-terms">
              <p>
                By creating an account, you agree to our{' '}
                <Link to="/terms">Terms of Service</Link> and{' '}
                <Link to="/privacy">Privacy Policy</Link>
              </p>
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="auth-switch">
            <p>Already have an account? <Link to="/login">Sign in here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;