import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingManualQuotes,
  reviewManualQuote,
  clearReviewError,
} from '../../../redux/slices/adminQuoteSlice';

import Spinner from '../../../components/common/Spinner';
import QuoteDetailsModal from '../../../components/Admin/QuoteDetailsModal/QuoteDetailsModal';
import QuoteReviewModal from '../../../components/Admin/QuoteReviewModal/QuoteReviewModal';
import { useDebouncedValue } from '../../../utils/useDebouncedValue';

import '../../../styles/AdminQuotesShared.scss';

const AllManualQuotes = () => {
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    regNumber: '',
    make: '',
    model: '',
  });

  const debouncedFilters = useDebouncedValue(filters, 500);
  const [modalViewQuote, setModalViewQuote] = useState(null);
  const [modalReviewQuote, setModalReviewQuote] = useState(null);
  // Removed initialRenderDone state as it's no longer needed with the simplified useEffect

  // Redux selectors
  const {
    pending: {
      response: pendingResponseFromRedux, // Get the raw response from Redux
      loading: pendingLoading = false,
      error: pendingError = null,
    } = {}, // Default for 'pending'
    review: {
      loading: reviewLoading = false,
      error: reviewError = null,
    } = {},
  } = useSelector((state) => state.adminQuotes || {}); // === NEW: Add default empty object for state.adminQuotes ===

  // === Defensive check for pendingResponse ===
  // Ensure pendingResponse is always an object, even if pendingResponseFromRedux is null
  const pendingResponse = pendingResponseFromRedux || {};

  const {
    quotes = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = pendingResponse;

  // Fetch data on filter change
  // === SIMPLIFIED useEffect for data fetching ===
  // This hook will now dispatch `fetchPendingManualQuotes` whenever `debouncedFilters` changes.
  // The `useDebouncedValue` hook ensures this only happens after a short delay,
  // preventing excessive API calls during rapid filter input.
  useEffect(() => {
    dispatch(fetchPendingManualQuotes({ params: debouncedFilters }));
  }, [dispatch, debouncedFilters]); // Removed initialRenderDone from dependencies

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleReview = (quote) => {
    dispatch(clearReviewError());
    setModalReviewQuote(quote);
  };

  const handleCloseReviewModal = () => {
    dispatch(clearReviewError());
    setModalReviewQuote(null);
  };

  const handleViewDetails = (quote) => {
    setModalViewQuote(quote);
  };

  const handleCloseDetailsModal = () => {
    setModalViewQuote(null);
  };

  const onSubmitReview = async ({ adminOfferPrice, adminMessage }) => {
    const resultAction = await dispatch(
      reviewManualQuote({
        data: { adminOfferPrice, adminMessage },
        id: modalReviewQuote._id,
      })
    );

    if (reviewManualQuote.fulfilled.match(resultAction)) {
      handleCloseReviewModal();
      // Re-fetch quotes after a successful review to update the list
      dispatch(fetchPendingManualQuotes({ params: debouncedFilters }));
    }
  };

  const updateFilter = (field) => (e) => {
    const value = e.target.value;
    // Allow empty string to clear filter
    if (value === '' || /^[a-zA-Z0-9@.\s-]*$/.test(value)) {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
        page: 1, // Reset to first page on filter change
      }));
    }
  };

  const resetFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      regNumber: '',
      make: '',
      model: '',
    });
  };

  const getVehicleString = (quote) => {
    const { make, model, year } = quote;
    let parts = [];
    if (make) parts.push(make);
    if (model) parts.push(model);
    if (year) parts.push(`(${year})`);
    return parts.length > 0 ? parts.join(' ') : 'N/A';
  };

  const formatPrice = (price) => {
    return price ? `£${parseFloat(price).toLocaleString()}` : 'N/A';
  };

  const getQuoteType = (quote) => {
    // Assuming 'type' field exists on the quote object from the schema
    if (quote.type === 'manual') return 'Manual';
    if (quote.type === 'auto') return 'Auto';
    return 'Standard'; // Fallback for other types or if type is missing
  };

  const getPriorityLevel = (quote) => {
    const createdAt = new Date(quote.createdAt);
    const now = new Date();
    const hoursDiff = (now - createdAt) / (1000 * 60 * 60);
    
    if (hoursDiff > 48) return 'high';
    if (hoursDiff > 24) return 'medium';
    return 'low';
  };

  const renderDesktopTable = () => (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Vehicle</th>
            <th>Client</th>
            <th>Type</th>
            <th>Reason</th>
            <th>Client Offer</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote._id}>
              <td title={quote.regNumber || 'N/A'}>
                {quote.regNumber || 'N/A'}
              </td>
              <td title={getVehicleString(quote)}>
                {getVehicleString(quote)}
              </td>
              <td title={quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}>
                {quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}
              </td>
              <td>
                <span className={`type-badge ${getQuoteType(quote).toLowerCase()}`}>
                  {getQuoteType(quote)}
                </span>
              </td>
              <td title={quote.manualQuoteReason || 'N/A'}>
                <span className="reason-text">
                  {quote.manualQuoteReason || 'N/A'}
                </span>
              </td>
              <td title={formatPrice(quote.userEstimatedPrice)}>
                {formatPrice(quote.userEstimatedPrice)}
              </td>
              <td>
                <span className={`priority-badge ${getPriorityLevel(quote)}`}>
                  {getPriorityLevel(quote)}
                </span>
              </td>
              <td>
                <button 
                  className="btn-view" 
                  onClick={() => handleViewDetails(quote)}
                  aria-label={`View details for ${quote.regNumber || 'quote'}`}
                >
                  View
                </button>
                <button 
                  className="btn-review" 
                  onClick={() => handleReview(quote)}
                  aria-label={`Review quote for ${quote.regNumber || 'vehicle'}`}
                >
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className="mobile-cards">
      {quotes.map((quote) => (
        <div key={quote._id} className="quote-card">
          <div className="card-header">
            <h3 className="card-title">{quote.regNumber || 'N/A'}</h3>
            <div className="card-badges">
              <span className={`card-badge ${getQuoteType(quote).toLowerCase()}`}>
                {getQuoteType(quote)}
              </span>
              <span className={`priority-badge ${getPriorityLevel(quote)}`}>
                {getPriorityLevel(quote)}
              </span>
            </div>
          </div>
          
          <div className="card-details">
            <div className="detail-item">
              <div className="label">Vehicle</div>
              <div className="value">{getVehicleString(quote)}</div>
            </div>
            <div className="detail-item">
              <div className="label">Client</div>
              <div className="value">
                {quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}
              </div>
            </div>
            <div className="detail-item">
              <div className="label">Reason</div>
              <div className="value">{quote.manualQuoteReason || 'N/A'}</div>
            </div>
            <div className="detail-item">
              <div className="label">Client Offer</div>
              <div className="value">{formatPrice(quote.userEstimatedPrice)}</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button
              className="btn-view"
              onClick={() => handleViewDetails(quote)}
            >
              View Details
            </button>
            <button
              className="btn-review"
              onClick={() => handleReview(quote)}
            >
              Review Quote
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableContent = () => {
    if (pendingLoading) {
      return (
        <div className="spinner-container">
          <Spinner />
        </div>
      );
    }

    if (pendingError) {
      return <p className="error-text">{pendingError}</p>;
    }

    if (quotes.length === 0) {
      return <div className="empty-state">No manual quotes pending review.</div>;
    }

    return (
      <>
        {renderDesktopTable()}
        {renderMobileCards()}
        <div className="pagination-controls">
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
            aria-label="Go to next page"
          >
            Next
          </button>
        </div>
      </>
    );
  };

  return (
    <section className="admin-quotes-page">
      <div className="page-header">
        <h1>Manual Quote Reviews</h1>
        <p className="page-description">
          Review and process manual quote requests that require admin attention.
        </p>
      </div>

      <div className="admin-info-banner">
        <div className="admin-info-card highlight-blue">
          <div className="icon">📄</div>
          <div className="content">
            <h3>What Is This Page?</h3>
            <p>
              Manage <strong>manual quote requests</strong> that couldn't be auto-processed and require your review and pricing decision.
            </p>
          </div>
        </div>

        <div className="admin-info-card highlight-green">
          <div className="icon">🛠</div>
          <div className="content">
            <h3>What Can You Do?</h3>
            <ul>
              <li><strong>View:</strong> Inspect complete quote and vehicle details</li>
              <li><strong>Review:</strong> Set final price and send response to client</li>
              <li><strong>Filter:</strong> Search by customer, vehicle, or registration</li>
            </ul>
          </div>
        </div>

        <div className="admin-info-card highlight-purple">
          <div className="icon">💡</div>
          <div className="content">
            <h3>Key Information</h3>
            <ul>
              <li><strong>Reason:</strong> Why automatic processing failed</li>
              <li><strong>Client Offer:</strong> Customer's estimated price</li>
              <li><strong>Priority:</strong> Based on request age and urgency</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="filter-controls">
        <div className="filter-header">
          <h3>Search & Filter</h3>
          <div className="results-count">
            {total} pending review{total !== 1 ? 's' : ''}
          </div>
        </div>
        <div className="filter-grid">
          {[
            ['Customer Name', 'customerName'],
            ['Customer Email', 'customerEmail'],
            ['Customer Phone', 'customerPhone'],
            ['Reg Number', 'regNumber'],
            ['Make', 'make'],
            ['Model', 'model'],
          ].map(([label, field]) => (
            <div key={field} className="filter-field">
              <label htmlFor={field}>{label}</label>
              <input
                id={field}
                type="text"
                value={filters[field]}
                onChange={updateFilter(field)}
                placeholder={`Search ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div className="filter-actions">
            <button className="btn-reset" onClick={resetFilters}>
              🔄 Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="quote-table-container">
        <div className="quote-table-header">
          <p>Manual Quotes Pending Review: {total}</p>
        </div>
        {renderTableContent()}
      </div>

      {/* Modals */}
      {modalViewQuote && (
        <QuoteDetailsModal
          quote={modalViewQuote}
          onClose={handleCloseDetailsModal}
        />
      )}

      {modalReviewQuote && (
        <QuoteReviewModal
          quote={modalReviewQuote}
          onClose={handleCloseReviewModal}
          onSubmitReview={onSubmitReview}
          loading={reviewLoading}
          error={reviewError}
        />
      )}
    </section>
  );
};

export default AllManualQuotes;
