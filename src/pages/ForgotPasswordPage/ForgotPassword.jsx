// src/pages/ForgotPassword.js
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { forgotPassword } from '../../redux/slices/authSlice';
import Logo from '../../components/common/Logo/Logo';

const ForgotPassword = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    }),
    onSubmit: async (values) => {
      try {
        const result = await dispatch(forgotPassword({ data: values }));

        if (forgotPassword.fulfilled.match(result)) {
          toast.success('A password reset link has been sent to your email address.');
        } else if (forgotPassword.rejected.match(result)) {
          toast.error(result.payload?.message || 'Failed to send password reset email.');
        }
      } catch (err) {
        toast.error('Something went wrong. Please try again.');
      }
    },
  });

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
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <Logo />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot Your Password?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Enter your email address below and we'll send you a password reset link.
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

            {/* Email Field */}
            <div className="space-y-2">
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    className="w-4 h-4 text-gray-400"
                  />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className={`
                    w-full pl-12 pr-4 py-3 border rounded-xl text-sm
                    transition-all duration-200 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
                    placeholder:text-gray-400
                    ${formik.touched.email && formik.errors.email 
                      ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                    }
                  `}
                  {...formik.getFieldProps('email')}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs font-medium flex items-center gap-1">
                  {formik.errors.email}
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
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                }
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                  Sending link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <Link 
                to="/login"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-3 h-3" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;