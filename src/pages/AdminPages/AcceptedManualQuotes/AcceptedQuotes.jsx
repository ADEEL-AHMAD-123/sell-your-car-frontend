import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAcceptedQuotes,
  markManualQuoteAsCollected,
} from '../../../redux/slices/adminQuoteSlice';

import Spinner from '../../../components/common/Spinner';
import ConfirmModal from '../../../components/Admin/ConfirmModal/ConfirmModal';
import QuoteDetailsModal from '../../../components/Admin/QuoteDetailsModal/QuoteDetailsModal';

import { useDebouncedValue } from '../../../utils/useDebouncedValue';

import '../../../styles/AdminQuotesShared.scss';

const AcceptedQuotes = () => {
  const dispatch = useDispatch();

  // State for filters
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

  // State for modals
  const [modalQuote, setModalQuote] = useState(null);
  const [confirmCollect, setConfirmCollect] = useState(null);

  // Redux selectors
  const {
    accepted: {
      response: acceptedResponseFromRedux, // Get the raw response from Redux
      loading: acceptedLoading = false,
      error: acceptedError = null,
    } = {}, // Default for 'accepted'
    collect: {
      loading: collectLoading = false,
      error: collectError = null,
    } = {},
  } = useSelector((state) => state.adminQuotes || {}); // Default for 'adminQuotes'

  // === Defensive check for acceptedResponse ===
  // Ensure acceptedResponse is always an object, even if acceptedResponseFromRedux is null
  const acceptedResponse = acceptedResponseFromRedux || {};

  const {
    quotes = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = acceptedResponse;

  // Fetch data on filter change
  useEffect(() => {
    dispatch(fetchAcceptedQuotes({ params: debouncedFilters }));
  }, [dispatch, debouncedFilters]);

  // Handlers
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleViewDetails = (quote) => {
    setModalQuote(quote);
  };

  const handleCloseDetailsModal = () => {
    setModalQuote(null);
  };

  const handleMarkAsCollected = (quote) => {
    setConfirmCollect(quote);
  };

  const handleConfirmCollected = async () => {
    if (confirmCollect) {
      const resultAction = await dispatch(
        markManualQuoteAsCollected({ id: confirmCollect._id })
      );
      if (resultAction.type.endsWith('/fulfilled')) {
        setConfirmCollect(null);
        // Re-fetch quotes after a successful collection to update the list
        dispatch(fetchAcceptedQuotes({ params: debouncedFilters }));
      }
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmCollect(null);
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

  const formatWeight = (weight) => {
    return weight ? `${parseFloat(weight).toLocaleString()} kg` : 'N/A';
  };

  const getQuoteType = (quote) => {
    // Assuming you have isManualQuote and isAutoQuote flags on the quote object
    if (quote.type === 'manual') return 'Manual';
    if (quote.type === 'auto') return 'Auto';
    return 'Standard'; // Fallback for other types or if type is missing
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
            <th>Price</th>
            <th>Weight</th>
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
              <td title={formatPrice(quote.finalPrice)}>
                {formatPrice(quote.finalPrice)}
              </td>
              <td title={formatWeight(quote.revenueWeight)}>
                {formatWeight(quote.revenueWeight)}
              </td>
              <td>
                <div className="actions-container">
                  <button
                    className="btn-view"
                    onClick={() => handleViewDetails(quote)}
                    aria-label={`View details for ${quote.regNumber || 'quote'}`}
                  >
                    View
                  </button>
                  {/* Ensure isCollected is a boolean field on your quote model */}
                  {!quote.collectionDetails?.collected && ( // Check nested property
                    <button
                      className="btn-collected"
                      onClick={() => handleMarkAsCollected(quote)}
                      aria-label={`Mark as collected for ${quote.regNumber || 'vehicle'}`}
                    >
                      Mark Collected
                    </button>
                  )}
                </div>
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
            <span className={`card-badge ${getQuoteType(quote).toLowerCase()}`}>
              {getQuoteType(quote)}
            </span>
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
              <div className="label">Price</div>
              <div className="value">{formatPrice(quote.finalPrice)}</div>
            </div>
            <div className="detail-item">
              <div className="label">Weight</div>
              <div className="value">{formatWeight(quote.revenueWeight)}</div>
            </div>
          </div>
          
          <div className="card-actions">
            <button
              className="btn-view"
              onClick={() => handleViewDetails(quote)}
            >
              View Details
            </button>
            {!quote.collectionDetails?.collected && ( // Check nested property
              <button
                className="btn-collected"
                onClick={() => handleMarkAsCollected(quote)}
              >
                Mark Collected
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableContent = () => {
    if (acceptedLoading) {
      return (
        <div className="spinner-container">
          <Spinner />
        </div>
      );
    }

    if (acceptedError) {
      return <p className="error-text">{acceptedError}</p>;
    }

    if (quotes.length === 0) {
      return <div className="empty-state">No accepted quotes available.</div>;
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
        <h1>Accepted Quotes</h1>
        <p className="page-description">
          Manage quotes that have been accepted and are ready for collection.
        </p>
      </div>

      {/* Info banners */}
      <div className="admin-info-banner">
        <div className="admin-info-card highlight-blue">
          <div className="icon">📄</div>
          <div className="content">
            <h3>What Is This Page?</h3>
            <p>
              Here you'll see quotes that have been accepted by customers and are ready for vehicle collection.
            </p>
          </div>
        </div>

        <div className="admin-info-card highlight-green">
          <div className="icon">🛠</div>
          <div className="content">
            <h3>What Can You Do?</h3>
            <ul>
              <li><strong>View:</strong> Inspect quote and vehicle details</li>
              <li><strong>Mark as Collected:</strong> Confirm vehicle collection</li>
              <li><strong>Filter:</strong> Search by customer, vehicle, or registration</li>
            </ul>
          </div>
        </div>

        <div className="admin-info-card highlight-purple">
          <div className="icon">💡</div>
          <div className="content">
            <h3>Key Information</h3>
            <ul>
              <li><strong>Price:</strong> Final agreed price for the vehicle</li>
              <li><strong>Weight:</strong> Revenue weight in kilograms</li>
              <li><strong>Type:</strong> Manual or auto-generated quote</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-controls">
        <div className="filter-header">
          <h3>Search & Filter</h3>
          <div className="results-count">
            {total} result{total !== 1 ? 's' : ''}
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

      {/* Table */}
      <div className="quote-table-container">
        <div className="quote-table-header">
          <p>Total Accepted Quotes: {total}</p>
        </div>
        {renderTableContent()}
      </div>

      {/* Quote Details Modal */}
      {modalQuote && (
        <QuoteDetailsModal
          quote={modalQuote}
          onClose={handleCloseDetailsModal}
          pageType={"accepted"}
        />
      )}

      {/* Confirm Mark as Collected Modal */}
      {confirmCollect && (
        <ConfirmModal
          isOpen={true}
          message={`Are you sure you want to mark vehicle ${confirmCollect.regNumber || 'this vehicle'} as collected?`}
          title="Confirm Collection"
          type="success"
          onConfirm={handleConfirmCollected}
          onCancel={handleCloseConfirmModal}
          loading={collectLoading}
          error={collectError}
        />
      )}
    </section>
  );
};

export default AcceptedQuotes;