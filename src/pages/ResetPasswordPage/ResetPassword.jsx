// src/pages/ResetPassword.js
import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faTimes, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { resetPassword } from '../../redux/slices/authSlice';
import Logo from '../../components/common/Logo/Logo';

const ResetPassword = ({ onClose }) => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        )
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const result = await dispatch(resetPassword({ token, data: { password: values.newPassword } }));

        if (resetPassword.fulfilled.match(result)) {
          toast.success('Your password has been reset successfully. Please sign in.');
          navigate('/login');
        } else if (resetPassword.rejected.match(result)) {
          toast.error(result.payload?.message || 'Password reset failed. Please try again.');
        }
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    if (score <= 2) return { strength: score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { strength: score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { strength: score, label: 'Good', color: 'bg-blue-500' };
    return { strength: score, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formik.values.newPassword);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200 z-10"
          >
            <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
          </button>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <Logo />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <FontAwesomeIcon icon={faShieldAlt} className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Reset Your Password
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Choose a new, strong password for your account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Global Error */}
            {error?.message && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error.message}</p>
              </div>
            )}

            {/* New Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="newPassword" 
                className="block text-sm font-semibold text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faLock} 
                    className="w-4 h-4 text-gray-400"
                  />
                </div>
                <input
                  id="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter a new password"
                  className={`
                    w-full pl-12 pr-12 py-3 border rounded-xl text-sm
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    placeholder:text-gray-400
                    ${formik.touched.newPassword && formik.errors.newPassword 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                    }
                  `}
                  {...formik.getFieldProps('newPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formik.values.newPassword && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Password Strength</span>
                    <span className={`text-xs font-medium ${passwordStrength.strength <= 2 ? 'text-red-500' : passwordStrength.strength <= 3 ? 'text-yellow-500' : passwordStrength.strength <= 4 ? 'text-blue-500' : 'text-green-500'}`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {formik.touched.newPassword && formik.errors.newPassword && (
                <p className="text-red-500 text-xs font-medium">
                  {formik.errors.newPassword}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="confirmPassword" 
                className="block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faLock} 
                    className="w-4 h-4 text-gray-400"
                  />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  className={`
                    w-full pl-12 pr-12 py-3 border rounded-xl text-sm
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    placeholder:text-gray-400
                    ${formik.touched.confirmPassword && formik.errors.confirmPassword 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                    }
                  `}
                  {...formik.getFieldProps('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="w-4 h-4" />
                </button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs font-medium">
                  {formik.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-xl font-semibold text-sm
                transition-all duration-200 ease-in-out
                ${isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  Resetting password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <Link 
                to="/login"
                className="text-sm text-gray-600 hover:text-green-600 font-medium transition-colors duration-200"
              >
                Remembered your password? Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 

export default ResetPassword;