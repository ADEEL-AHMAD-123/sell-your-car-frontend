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
  const [initialRenderDone, setInitialRenderDone] = useState(false);

  const {
    pending: {
      response: pendingResponse = {},
      loading: pendingLoading = false,
      error: pendingError = null,
    },
    review: {
      loading: reviewLoading = false,
      error: reviewError = null,
    },
  } = useSelector((state) => state.adminQuotes);

  const {
    quotes = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = pendingResponse;

  useEffect(() => {
    if (initialRenderDone) {
      dispatch(fetchPendingManualQuotes({ params: debouncedFilters }));
    } else {
      setInitialRenderDone(true);
    }
  }, [dispatch, debouncedFilters, initialRenderDone]);

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
      dispatch(fetchPendingManualQuotes({ params: debouncedFilters }));
    }
  };

  const updateFilter = (field) => (e) => {
    const value = e.target.value;
    if (!/^[a-zA-Z0-9@.\s-]*$/.test(value)) return;
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
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
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Vehicle</th>
                <th>Client</th>
                <th>Reason</th>
                <th>Client Offer</th>
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
                  <td title={quote.manualQuoteReason || 'N/A'}>
                    {quote.manualQuoteReason || 'N/A'}
                  </td>
                  <td>
                    {quote.userEstimatedPrice ? `£${quote.userEstimatedPrice}` : 'N/A'}
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

        <div className="pagination-controls">
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
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
  <h1>Pending Manual Quotes</h1>

<div className="admin-info-banner">
  <div className="admin-info-card highlight-blue">
    <div className="icon">📄</div>
    <div className="content">
      <h3>What Is This Page?</h3>
      <p>
        Here you’ll manage <strong>manual quote requests</strong> that couldn’t be auto-processed. Each quote requires your review and action.
      </p>
    </div>
  </div>

  <div className="admin-info-card highlight-green">
    <div className="icon">🛠</div>
    <div className="content">
      <h3>What Can You Do?</h3>
      <ul>
        <li><strong>View:</strong> Inspect quote and vehicle details.</li>
        <li><strong>Review:</strong> Set a price and message for the client. This sends them an email.</li>
        <li><strong>Filter:</strong> Narrow results by customer, vehicle, or reg number.</li>
      </ul>
    </div>
  </div>

  <div className="admin-info-card highlight-purple">
    <div className="icon">💡</div>
    <div className="content">
      <h3>Key Terms</h3>
      <ul>
        <li><strong>Reason:</strong> Why auto-quote was bypassed.</li>
        <li><strong>Client Offer:</strong> User’s suggested price (if any).</li>
        <li><strong>Review Action:</strong> Sends your reply to the client.</li>
      </ul>
    </div>
  </div>
</div>



      {/* Filter Section */}
      <div className="filter-controls">
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
      <label>&nbsp;</label>
      <button className="btn-reset" onClick={resetFilters}>
        🔄 Reset Filters
      </button>
    </div>
  </div>
</div>


      {/* Table Section */}
      <div className="quote-table-container">
  <div className="quote-table-header">
    <p>Total Quotes: {total}</p>
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