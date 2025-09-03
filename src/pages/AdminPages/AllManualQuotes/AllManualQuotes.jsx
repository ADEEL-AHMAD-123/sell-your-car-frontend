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


import styles from '../../../styles/shared/AdminQuotesShared.module.scss';

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

  // Redux selectors
  const {
    pending: {
      response: pendingResponseFromRedux,
      loading: pendingLoading = false,
      error: pendingError = null,
    } = {},
    review: {
      loading: reviewLoading = false,
      error: reviewError = null,
    } = {},
  } = useSelector((state) => state.adminQuotes || {});

  const pendingResponse = pendingResponseFromRedux || {};

  const {
    quotes = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = pendingResponse;

  // Fetch data on filter change
  useEffect(() => {
    dispatch(fetchPendingManualQuotes({ params: debouncedFilters }));
  }, [dispatch, debouncedFilters]);

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
    if (value === '' || /^[a-zA-Z0-9@.\s-]*$/.test(value)) {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
        page: 1,
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
    const make = quote?.vehicleRegistration?.Make;
    const model = quote?.vehicleRegistration?.Model;
    const year = quote?.vehicleRegistration?.YearOfManufacture;
    let parts = [];
    if (make) parts.push(make);
    if (model) parts.push(model);
    if (year) parts.push(`(${year})`);
    return parts.length > 0 ? parts.join(' ') : 'N/A';
  };

  const formatPrice = (price) => {
    return price ? `£${parseFloat(price).toLocaleString()}` : 'N/A';
  };

  const renderDesktopTable = () => (
    <div className={styles['table-wrapper']}>
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
              <td title={quote?.vehicleRegistration?.Vrm || 'N/A'}>
                {quote?.vehicleRegistration?.Vrm || 'N/A'}
              </td>
              <td title={getVehicleString(quote)}>
                {getVehicleString(quote)}
              </td>
              <td title={quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}>
                {quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}
              </td>
              <td title={quote.manualQuoteReason || 'N/A'}>
                <span className={styles['reason-text']}>
                  {quote.manualQuoteReason || 'N/A'}
                </span>
              </td>
              <td title={formatPrice(quote.userEstimatedPrice)}>
                {formatPrice(quote.userEstimatedPrice)}
              </td>
              <td>
                <div className={styles['actions-container']}>
                  <button
                    className={styles['btn-view']}
                    onClick={() => handleViewDetails(quote)}
                    aria-label={`View details for ${quote?.vehicleRegistration?.Vrm || 'quote'}`}
                  >
                    View
                  </button>
                  <button
                    className={styles['btn-review']}
                    onClick={() => handleReview(quote)}
                    aria-label={`Review quote for ${quote?.vehicleRegistration?.Vrm || 'vehicle'}`}
                  >
                    Review
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMobileCards = () => (
    <div className={styles['mobile-cards']}>
      {quotes.map((quote) => (
        <div key={quote._id} className={styles['quote-card']}>
          <div className={styles['card-header']}>
            <h3 className={styles['card-title']}>{quote?.vehicleRegistration?.Vrm || 'N/A'}</h3>
            <div className={styles['card-badges']}>
            </div>
          </div>
          <div className={styles['card-details']}>
            <div className={styles['detail-item']}>
              <div className={styles.label}>Vehicle</div>
              <div className={styles.value}>{getVehicleString(quote)}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles.label}>Client</div>
              <div className={styles.value}>
                {quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}
              </div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles.label}>Reason</div>
              <div className={styles.value}>{quote.manualQuoteReason || 'N/A'}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles.label}>Client Offer</div>
              <div className={styles.value}>{formatPrice(quote.userEstimatedPrice)}</div>
            </div>
          </div>
          <div className={styles['card-actions']}>
            <button
              className={styles['btn-view']}
              onClick={() => handleViewDetails(quote)}
            >
              View Details
            </button>
            <button
              className={styles['btn-review']}
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
        <div className={styles['spinner-container']}>
          <Spinner />
        </div>
      );
    }

    if (pendingError) {
      return <p className={styles['error-text']}>{pendingError}</p>;
    }

    if (quotes.length === 0) {
      return <div className={styles['empty-state']}>No manual quotes pending review.</div>;
    }

    return (
      <>
        {renderDesktopTable()}
        {renderMobileCards()}
        <div className={styles['pagination-controls']}>
          <button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span className={styles['page-info']}>Page {page} of {totalPages}</span>
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
    <section className={styles['admin-quotes-page']}>
      <div className={styles['page-header']}>
        <h1>Manual Quote Reviews</h1>
        <p className={styles['page-description']}>
          Review and process manual quote requests that require admin attention.
        </p>
      </div>

      <div className={styles['admin-info-banner']}>
        <div className={`${styles['admin-info-card']} ${styles['highlight-blue']}`}>
          <div className={styles.icon}>📄</div>
          <div className={styles.content}>
            <h3>What Is This Page?</h3>
            <p>
              Manage <strong>manual quote requests</strong> that couldn't be auto-processed and require your review and pricing decision.
            </p>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-green']}`}>
          <div className={styles.icon}>🛠</div>
          <div className={styles.content}>
            <h3>What Can You Do?</h3>
            <ul>
              <li><strong>View:</strong> Inspect complete quote and vehicle details</li>
              <li><strong>Review:</strong> Set final price and send response to client</li>
              <li><strong>Filter:</strong> Search by customer, vehicle, or registration</li>
            </ul>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-purple']}`}>
          <div className={styles.icon}>💡</div>
          <div className={styles.content}>
            <h3>Key Information</h3>
            <ul>
              <li><strong>Reason:</strong> Why automatic processing failed</li>
              <li><strong>Client Offer:</strong> Customer's estimated price</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className={styles['filter-controls']}>
        <div className={styles['filter-header']}>
          <h3>Search & Filter</h3>
          <div className={styles['results-count']}>
            {total} pending review{total !== 1 ? 's' : ''}
          </div>
        </div>
        <div className={styles['filter-grid']}>
          {[
            ['Customer Name', 'customerName'],
            ['Customer Email', 'customerEmail'],
            ['Customer Phone', 'customerPhone'],
            ['Reg Number', 'regNumber'],
            ['Make', 'make'],
            ['Model', 'model'],
          ].map(([label, field]) => (
            <div key={field} className={styles['filter-field']}>
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

          <div className={styles['filter-actions']}>
            <button className={styles['btn-reset']} onClick={resetFilters}>
              🔄 Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className={styles['quote-table-container']}>
        <div className={styles['quote-table-header']}>
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