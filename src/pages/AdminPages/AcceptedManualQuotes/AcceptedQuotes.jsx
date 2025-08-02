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
  const [initialRenderDone, setInitialRenderDone] = useState(false);

  // Redux selectors
  const {
    accepted: {
      response: acceptedResponse = {},
      loading: acceptedLoading = false,
      error: acceptedError = null,
    } = {}, // <== default fallback
    collect: {
      loading: collectLoading = false,
      error: collectError = null,
    } = {}, // <== default fallback
  } = useSelector((state) => state.adminQuotes);

  const {
    quotes = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = acceptedResponse;

  // Fetch data on filter change
  useEffect(() => {
    if (initialRenderDone) {
      dispatch(fetchAcceptedQuotes({ params: debouncedFilters }));
    } else {
      setInitialRenderDone(true);
    }
  }, [dispatch, debouncedFilters, initialRenderDone]);

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
        dispatch(fetchAcceptedQuotes({ params: debouncedFilters }));
      }
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmCollect(null);
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
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Reg No</th>
                <th>Vehicle</th>
                <th>Client</th>
                <th>Reason</th>
                <th>Collected</th>
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
                    {quote.isCollected ? 'Yes' : 'No'}
                  </td>
                  <td>
                    <button
                      className="btn-view"
                      onClick={() => handleViewDetails(quote)}
                      aria-label={`View details for ${quote.regNumber || 'quote'}`}
                    >
                      View
                    </button>
                    {!quote.isCollected && (
                      <button
                        className="btn-collected"
                        onClick={() => handleMarkAsCollected(quote)}
                        aria-label={`Mark as collected for ${quote.regNumber || 'vehicle'}`}
                      >
                        Mark as Collected
                      </button>
                    )}
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
      <h1>Accepted Quotes</h1>

      {/* Info banners similar to manualPage.jsx */}
      <div className="admin-info-banner">
        <div className="admin-info-card highlight-blue">
          <div className="icon">📄</div>
          <div className="content">
            <h3>What Is This Page?</h3>
            <p>
              Here you’ll see quotes that have been accepted and are ready for collection.
            </p>
          </div>
        </div>

        <div className="admin-info-card highlight-green">
          <div className="icon">🛠</div>
          <div className="content">
            <h3>What Can You Do?</h3>
            <ul>
              <li><strong>View:</strong> Inspect quote and vehicle details.</li>
              <li><strong>Mark as Collected:</strong> Confirm the vehicle has been collected.</li>
              <li><strong>Filter:</strong> Narrow results by customer, vehicle, or reg number.</li>
            </ul>
          </div>
        </div>

        <div className="admin-info-card highlight-purple">
          <div className="icon">💡</div>
          <div className="content">
            <h3>Key Terms</h3>
            <ul>
              <li><strong>Collected:</strong> Whether the vehicle has been collected.</li>
              <li><strong>Actions:</strong> Confirm collection or view details.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
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

      {/* Table */}
      <div className="quote-table-container">
        <div className="quote-table-header">
          <p>Total Quotes: {total}</p>
        </div>
        {renderTableContent()}
      </div>

      {/* Quote Details Modal */}
      {modalQuote && (
        <QuoteDetailsModal
          quote={modalQuote}
          onClose={handleCloseDetailsModal}
        />
      )}

      {/* Confirm Mark as Collected Modal */}
      {confirmCollect && (
        <ConfirmModal
          message={`Are you sure you want to mark vehicle ${confirmCollect.regNumber || 'this vehicle'} as collected?`}
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
