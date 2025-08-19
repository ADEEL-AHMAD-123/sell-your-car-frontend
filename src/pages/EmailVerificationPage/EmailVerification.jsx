// src/pages/EmailVerification.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  verifyEmail, 
  resendVerificationEmail, 
  clearAuthError 
} from '../../redux/slices/authSlice';
import Logo from '../../components/common/Logo/Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faCheckCircle, 
  faExclamationTriangle, 
  faEnvelope,
  faHome,
  faSignInAlt
} from '@fortawesome/free-solid-svg-icons';
 
const EmailVerification = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, authError, resendLoading, user } = useSelector((state) => state.auth);
  
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [resendEmail, setResendEmail] = useState('');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const handleVerification = async () => {
      dispatch(clearAuthError());

      if (!token) {
        setVerificationStatus('failure');
        return;
      }
      try {
        const result = await dispatch(verifyEmail({ token }));
        if (verifyEmail.fulfilled.match(result)) {
          if (result.payload?.message === 'Your email is already verified. You can now log in.') {
            setVerificationStatus('alreadyVerified');
          } else {
            setVerificationStatus('success');
          }
        } else {
          setVerificationStatus('failure');
        }
      } catch (err) {
        setVerificationStatus('failure');
      }
    };
    handleVerification();
  }, [token, dispatch, navigate]);

  // Countdown and redirect logic
  useEffect(() => {
    if (verificationStatus === 'success' || verificationStatus === 'alreadyVerified') {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            if (user) {
              navigate('/');
            } else {
              navigate('/login');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [verificationStatus, user, navigate]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) {
      return;
    }
    
    try {
      const result = await dispatch(resendVerificationEmail({ data: { email: resendEmail } }));
      if (resendVerificationEmail.fulfilled.match(result)) {
        // You can add toast notification here
        setResendEmail('');
      }
    } catch (err) {
      // Handle error
    }
  };

  const handleNavigate = () => {
    const isUserLoggedIn = user !== null;
    const destination = isUserLoggedIn ? '/' : '/login';
    navigate(destination);
  };

  const renderContent = () => {
    const isUserLoggedIn = user !== null;
    const buttonText = isUserLoggedIn ? 'Go to Homepage' : 'Go to Login';
    const buttonIcon = isUserLoggedIn ? faHome : faSignInAlt;

    switch (verificationStatus) {
      case 'verifying':
        return (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6">
                <FontAwesomeIcon 
                  icon={faSpinner} 
                  className="w-full h-full text-blue-500 animate-spin" 
                />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-blue-200 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verifying your email...
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Please wait while we verify your email address. This may take a moment.
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-6 p-4 bg-emerald-100 rounded-full">
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  className="w-full h-full text-emerald-600" 
                />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-emerald-300 rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Email Verified Successfully!
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Your email has been successfully verified. You will be redirected in {countdown} seconds.
              </p>
            </div>
            <button
              onClick={handleNavigate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={buttonIcon} className="w-4 h-4" />
              {buttonText}
            </button>
          </div>
        );

      case 'alreadyVerified':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto mb-6 p-4 bg-blue-100 rounded-full">
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                className="w-full h-full text-blue-500" 
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Already Verified
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                This account has already been verified. You will be redirected in {countdown} seconds.
              </p>
            </div>
            <button
              onClick={handleNavigate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <FontAwesomeIcon icon={buttonIcon} className="w-4 h-4" />
              {buttonText}
            </button>
          </div>
        );

      case 'failure':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto mb-6 p-4 bg-red-100 rounded-full">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="w-full h-full text-red-500" 
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Verification Failed
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                {authError || 'The verification link is invalid or has expired. Please request a new one.'}
              </p>
            </div>

            {/* Resend Form */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Request New Verification Link
              </h3>
              <form onSubmit={handleResend} className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon 
                      icon={faEnvelope} 
                      className="w-4 h-4 text-gray-400"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Enter your email to resend link"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-400 placeholder:text-gray-400 transition-all duration-200"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={resendLoading}
                  className={`
                    w-full py-3 px-4 rounded-xl font-semibold text-sm
                    transition-all duration-200 ease-in-out
                    ${resendLoading
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                    }
                  `}
                >
                  {resendLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                      Sending...
                    </div>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              </form>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with Logo */}
        <div className="bg-blue-500 px-8 py-6">
          <div className="flex justify-center">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
              <Logo />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-12">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Having trouble? Contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;