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

// 💡 Corrected import to use CSS Modules
import styles from '../../../styles/shared/AdminQuotesShared.module.scss';

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
      response: acceptedResponseFromRedux,
      loading: acceptedLoading = false,
      error: acceptedError = null,
    } = {},
    collect: {
      loading: collectLoading = false,
      error: collectError = null,
    } = {},
  } = useSelector((state) => state.adminQuotes || {});

  // === Defensive check for acceptedResponse ===
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
        dispatch(fetchAcceptedQuotes({ params: debouncedFilters }));
      }
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmCollect(null);
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

  // Helper function to safely get vehicle information
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

  const formatWeight = (weight) => {
    return weight ? `${parseFloat(weight).toLocaleString()} kg` : 'N/A';
  };

  const getQuoteType = (quote) => {
    if (quote.type === 'manual') return 'Manual';
    if (quote.type === 'auto') return 'Auto';
    return 'Standard';
  };

  const renderDesktopTable = () => (
    <div className={styles['table-wrapper']}>
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
              <td title={quote?.vehicleRegistration?.Vrm || 'N/A'}>
                {quote?.vehicleRegistration?.Vrm || 'N/A'}
              </td>
              <td title={getVehicleString(quote)}>
                {getVehicleString(quote)}
              </td>
              <td title={quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}>
                {quote.user ? `${quote.user.firstName} ${quote.user.lastName}` : 'N/A'}
              </td>
              <td>
                <span className={`${styles['type-badge']} ${styles[getQuoteType(quote).toLowerCase()]}`}>
                  {getQuoteType(quote)}
                </span>
              </td>
              <td title={formatPrice(quote.finalPrice)}>
                {formatPrice(quote.finalPrice)}
              </td>
              <td title={formatWeight(quote?.otherVehicleData?.KerbWeight)}>
                {formatWeight(quote?.otherVehicleData?.KerbWeight)}
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
                  {!quote.collectionDetails?.collected && (
                    <button
                      className={styles['btn-collected']}
                      onClick={() => handleMarkAsCollected(quote)}
                      aria-label={`Mark as collected for ${quote?.vehicleRegistration?.Vrm || 'vehicle'}`}
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
    <div className={styles['mobile-cards']}>
      {quotes.map((quote) => (
        <div key={quote._id} className={styles['quote-card']}>
          <div className={styles['card-header']}>
            <h3 className={styles['card-title']}>{quote?.vehicleRegistration?.Vrm || 'N/A'}</h3>
            <span className={`${styles['card-badge']} ${styles[getQuoteType(quote).toLowerCase()]}`}>
              {getQuoteType(quote)}
            </span>
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
              <div className={styles.label}>Price</div>
              <div className={styles.value}>{formatPrice(quote.finalPrice)}</div>
            </div>
            <div className={styles['detail-item']}>
              <div className={styles.label}>Weight</div>
              <div className={styles.value}>{formatWeight(quote?.otherVehicleData?.KerbWeight)}</div>
            </div>
          </div>
          <div className={styles['card-actions']}>
            <button
              className={styles['btn-view']}
              onClick={() => handleViewDetails(quote)}
            >
              View Details
            </button>
            {!quote.collectionDetails?.collected && (
              <button
                className={styles['btn-collected']}
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
        <div className={styles['spinner-container']}>
          <Spinner />
        </div>
      );
    }

    if (acceptedError) {
      return <p className={styles['error-text']}>{acceptedError}</p>;
    }

    if (quotes.length === 0) {
      return <div className={styles['empty-state']}>No accepted quotes available.</div>;
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
        <h1>Accepted Quotes</h1>
        <p className={styles['page-description']}>
          Manage quotes that have been accepted and are ready for collection.
        </p>
      </div>

      {/* Info banners */}
      <div className={styles['admin-info-banner']}>
        <div className={`${styles['admin-info-card']} ${styles['highlight-blue']}`}>
          <div className={styles.icon}>📄</div>
          <div className={styles.content}>
            <h3>What Is This Page?</h3>
            <p>
              Here you'll see quotes that have been accepted by customers and are ready for vehicle collection.
            </p>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-green']}`}>
          <div className={styles.icon}>🛠</div>
          <div className={styles.content}>
            <h3>What Can You Do?</h3>
            <ul>
              <li><strong>View:</strong> Inspect quote and vehicle details</li>
              <li><strong>Mark as Collected:</strong> Confirm vehicle collection</li>
              <li><strong>Filter:</strong> Search by customer, vehicle, or registration</li>
            </ul>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-purple']}`}>
          <div className={styles.icon}>💡</div>
          <div className={styles.content}>
            <h3>Key Information</h3>
            <ul>
              <li><strong>Price:</strong> Final agreed price for the vehicle</li>
              <li><strong>Weight:</strong> Kerb weight in kilograms (from vehicle API)</li>
              <li><strong>Type:</strong> Manual or auto-generated quote</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={styles['filter-controls']}>
        <div className={styles['filter-header']}>
          <h3>Search & Filter</h3>
          <div className={styles['results-count']}>
            {total} result{total !== 1 ? 's' : ''}
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

      {/* Table */}
      <div className={styles['quote-table-container']}>
        <div className={styles['quote-table-header']}>
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