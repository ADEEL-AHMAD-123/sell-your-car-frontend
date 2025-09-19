import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { unsubscribeUser } from '../../redux/slices/promoSlice';
import { toast } from 'react-toastify';

const UnsubscribePage = () => {
  const dispatch = useDispatch();
  const { unsubscribeIsLoading, unsubscribeSuccessMessage, unsubscribeError } = useSelector(state => state.promo);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const Spinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );

  useEffect(() => {
    if (!token) {
      // If token is missing, no need to dispatch action.
      // The render logic below will handle the error state.
      return;
    }

    // Dispatch the Redux thunk to handle the unsubscribe API call.
    dispatch(unsubscribeUser({ query: { token } }));
  }, [dispatch, token]);

  // Handle toast notifications based on Redux state changes
  useEffect(() => {
    if (unsubscribeSuccessMessage) {
      toast.success(unsubscribeSuccessMessage);
    }
    if (unsubscribeError) {
      toast.error(unsubscribeError);
    }
  }, [unsubscribeSuccessMessage, unsubscribeError]);


  const renderContent = () => {
    if (unsubscribeIsLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <Spinner />
          <p className="mt-4 text-gray-700 text-lg">Processing your request...</p>
        </div>
      );
    }

    if (unsubscribeSuccessMessage) {
      return (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-green-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">You've been unsubscribed.</h1>
          <p className="text-lg text-gray-600 mb-6">{unsubscribeSuccessMessage}</p>
          <Link to="/" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
            Return to Our Site
          </Link>
        </>
      );
    }

    const message = unsubscribeError || 'Invalid or missing unsubscribe token.';
    return (
      <>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Something went wrong.</h1>
        <p className="text-lg text-gray-600 mb-6">{message}</p>
        <Link to="/" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Return to Our Site
        </Link>
      </>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl text-center max-w-xl w-full border border-gray-200">
        <div className="text-4xl font-extrabold text-blue-600 mb-6">SellYourCar</div>
        {renderContent()}
      </div>
    </div>
  );
};

export default UnsubscribePage;
