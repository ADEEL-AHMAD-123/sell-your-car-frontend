import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './QuoteResult.scss';
import { resetQuote } from '../../redux/slices/quoteSlice';
import { useNavigate } from 'react-router-dom';

const QuoteResult = () => {
  const { quote, error, status, checksLeft } = useSelector((state) => state.quote);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(error)
  const handleBack = () => {
    dispatch(resetQuote());
    navigate('/');
  };

  return (
    <section className="quote-result container">
      {status === 'loading' ? (
        <p className="loading">Fetching quote...</p>
      ) : error ? (
      
        <div className="error-box">
          <h2>Quote Failed</h2>
          <p>{error}</p>
          <button onClick={handleBack}>Try Again</button>
        </div>
      ) : (
        quote && (
          <div className="quote-box">
            <h2>Quote Successful</h2>
            <ul>
              <li><strong>Registration:</strong> {quote.quote.regNumber}</li>
              <li><strong>Make:</strong> {quote.quote.make}</li>
              <li><strong>Weight:</strong> {quote.quote.revenueWeight} kg</li>
              <li><strong>Estimated Price:</strong> £{quote.quote.estimatedScrapPrice}</li>
              <li><strong>Checks Left:</strong> {checksLeft}</li>
            </ul>
            <button onClick={handleBack}>Check Another</button>
          </div>
        )
      )}
    </section>
  );
};

export default QuoteResult;
