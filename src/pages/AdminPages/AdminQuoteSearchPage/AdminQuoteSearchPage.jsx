import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminSearchedQuotes, clearAdminSearchedQuotes } from '../../../redux/slices/adminSlice';
import Spinner from '../../../components/common/Spinner';
import QuoteDetailsModal from '../../../components/Admin/QuoteDetailsModal/QuoteDetailsModal'; 
import { 
  FaSearch, 
  FaTimes, 
  FaInfoCircle, 
  FaCar, 
  FaUser, 
  FaIdCard, 
  FaEnvelope, 
  FaEye,
  FaExclamationTriangle,
  FaEraser,
  FaFilter
} from 'react-icons/fa';

import '../../../styles/AdminQuotesShared.scss';
import './AdminQuoteSearchPage.scss';

const AdminQuoteSearchPage = () => {
  const dispatch = useDispatch();
  const { searchedQuotes, searchedQuotesLoading, searchedQuotesError } = useSelector((state) => state.admin);

  const [searchParams, setSearchParams] = useState({
    quoteId: '',
    clientEmail: '',
    username: '',
    regNumber: '',
  });
  const [modalQuote, setModalQuote] = useState(null);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [quoteIdError, setQuoteIdError] = useState(''); 
  const [showNoCriteriaMessage, setShowNoCriteriaMessage] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    dispatch(clearAdminSearchedQuotes());
  }, [dispatch]);

  useEffect(() => {
    if (!searchedQuotesLoading && hasSearched) {
      setShowNoResultsMessage(searchedQuotes?.length === 0 && !searchedQuotesError);
    }
  }, [searchedQuotesLoading, searchedQuotes, searchedQuotesError, hasSearched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
    
    // Clear states when typing
    if (hasSearched) {
      dispatch(clearAdminSearchedQuotes());
      setHasSearched(false);
    }
    setShowNoResultsMessage(false);
    setQuoteIdError('');
    setShowNoCriteriaMessage(false);
  };

  const handleSearch = () => {
    setQuoteIdError('');
    setShowNoCriteriaMessage(false);

    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    
    if (searchParams.quoteId.trim() && !objectIdRegex.test(searchParams.quoteId)) {
      setQuoteIdError('Invalid Quote ID format. Must be a 24-character hexadecimal string.');
      return;
    }

    const activeParams = Object.fromEntries(
      Object.entries(searchParams).filter(([, value]) => value.trim() !== '')
    );

    if (Object.keys(activeParams).length === 0) {
      setShowNoCriteriaMessage(true);
      return;
    }

    setHasSearched(true);
    dispatch(fetchAdminSearchedQuotes({ params: activeParams }));
  };

  const handleClearSearch = () => {
    setSearchParams({ quoteId: '', clientEmail: '', username: '', regNumber: '' });
    dispatch(clearAdminSearchedQuotes());
    setShowNoResultsMessage(false);
    setQuoteIdError('');
    setShowNoCriteriaMessage(false);
    setHasSearched(false);
  };

  const handleViewDetails = (quote) => setModalQuote(quote);
  const handleCloseDetailsModal = () => setModalQuote(null);

  const hasActiveSearch = Object.values(searchParams).some(value => value.trim() !== '');

  const getQuotePrice = (quote) => {
    if (quote.clientDecision === 'accepted' || quote.collectionDetails?.collected) {
      return quote.finalPrice ? `£${quote.finalPrice.toLocaleString()}` : 'N/A';
    }
    if (quote.type === 'auto') {
      return quote.estimatedScrapPrice ? `£${quote.estimatedScrapPrice.toLocaleString()} (Est.)` : 'N/A';
    }
    if (quote.type === 'manual') {
      return quote.adminOfferPrice ? `£${quote.adminOfferPrice.toLocaleString()} (Offer)` : 'N/A';
    }
    return 'N/A';
  };

  const getQuoteStatus = (quote) => {
    if (quote.collectionDetails?.collected) return 'Collected';
    return quote.clientDecision || 'Pending';
  };

  return (
    <div className="admin-quote-search-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="title-section">
            <h1 className="page-title">
              <FaSearch className="title-icon" />
              Quote Search
            </h1>
            <p className="page-subtitle">
              Search and view detailed information for any quote in the system
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="info-section">
        <div className="info-grid">
          <div className="info-card">
            <div className="card-icon search">
              <FaSearch />
            </div>
            <div className="card-content">
              <h3>Search Methods</h3>
              <p>Use Quote ID for exact matches, or search by client email, client name, or vehicle registration number</p>
            </div>
          </div>
          <div className="info-card">
            <div className="card-icon results">
              <FaInfoCircle />
            </div>
            <div className="card-content">
              <h3>View Results</h3>
              <p>All matching quotes will be displayed with key details and full view options</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Controls */}
      <div className="search-section">
        <div className="search-header">
          <h3 className="search-title">
            <FaFilter className="section-icon" />
            Search Criteria
          </h3>
          {hasActiveSearch && (
            <button onClick={handleClearSearch} className="btn btn-ghost btn-sm clear-btn">
              <FaEraser />
              Clear All
            </button>
          )}
        </div>

        <div className="search-form">
          <div className="search-grid">
            <div className="search-field">
              <label htmlFor="quoteId">
                <FaIdCard />
                Quote ID
              </label>
              <input
                type="text"
                id="quoteId"
                name="quoteId"
                value={searchParams.quoteId}
                onChange={handleChange}
                placeholder="Enter 24-character quote ID..."
                className={quoteIdError ? 'error' : ''}
              />
              {quoteIdError && (
                <span className="error-message">
                  <FaExclamationTriangle />
                  {quoteIdError}
                </span>
              )}
            </div>

            <div className="search-field">
              <label htmlFor="clientEmail">
                <FaEnvelope />
                Client Email
              </label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={searchParams.clientEmail}
                onChange={handleChange}
                placeholder="Enter client email address..."
              />
            </div>

            <div className="search-field">
              <label htmlFor="username">
                <FaUser />
                Client Name
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={searchParams.username}
                onChange={handleChange}
                placeholder="Enter first or last name..."
              />
            </div>

            <div className="search-field">
              <label htmlFor="regNumber">
                <FaCar />
                Registration Number
              </label>
              <input
                type="text"
                id="regNumber"
                name="regNumber"
                value={searchParams.regNumber}
                onChange={handleChange}
                placeholder="Enter vehicle reg number..."
              />
            </div>
          </div>

          <div className="search-actions">
            <button 
              onClick={handleSearch} 
              className="btn btn-primary"
              disabled={searchedQuotesLoading}
            >
              {searchedQuotesLoading ? <Spinner /> : <FaSearch />}
              {searchedQuotesLoading ? 'Searching...' : 'Search Quotes'}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {/* Error Messages */}
        {showNoCriteriaMessage && (
          <div className="alert alert-info">
            <FaInfoCircle />
            Please enter at least one search criterion to begin searching.
          </div>
        )}

        {searchedQuotesError && (
          <div className="alert alert-error">
            <FaExclamationTriangle />
            Error: {searchedQuotesError}
          </div>
        )}

        {/* Loading State */}
        {searchedQuotesLoading && (
          <div className="loading-state">
            <Spinner />
            <span>Searching quotes...</span>
          </div>
        )}

        {/* No Results */}
        {showNoResultsMessage && (
          <div className="empty-state">
            <FaInfoCircle className="empty-icon" />
            <h3>No Quotes Found</h3>
            <p>No quotes match your search criteria. Try adjusting your search terms.</p>
          </div>
        )}

        {/* Results */}
        {!searchedQuotesLoading && !searchedQuotesError && searchedQuotes?.length > 0 && (
          <div className="quotes-results">
            <div className="results-header">
              <h3>Search Results</h3>
              <span className="results-count">
                {searchedQuotes.length} quote{searchedQuotes.length !== 1 ? 's' : ''} found
              </span>
            </div>

            <div className="quotes-grid">
              {searchedQuotes.map((quote) => (
                <div key={quote._id} className="quote-card">
                  <div className="quote-header">
                    <div className="quote-reg">
                      <FaCar />
                      {quote.regNumber || 'N/A'}
                    </div>
                    <span className={`quote-type-badge ${quote.type?.toLowerCase() || 'standard'}`}>
                      {quote.type || 'Standard'}
                    </span>
                  </div>

                  <div className="quote-details">
                    <div className="detail-row">
                      <span className="detail-label">Client:</span>
                      <span className="detail-value">
                        {quote.userId ? `${quote.userId.firstName} ${quote.userId.lastName}` : 'N/A'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{quote.userId?.email || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Price:</span>
                      <span className="detail-value price">{getQuotePrice(quote)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value status status--${getQuoteStatus(quote).toLowerCase()}`}>
                        {getQuoteStatus(quote)}
                      </span>
                    </div>
                  </div>

                  <div className="quote-actions">
                    <button 
                      onClick={() => handleViewDetails(quote)} 
                      className="btn btn-primary btn-sm"
                    >
                      <FaEye />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalQuote && (
        <QuoteDetailsModal
          quote={modalQuote}
          onClose={handleCloseDetailsModal}
        />
      )}
    </div>
  );
};

export default AdminQuoteSearchPage;