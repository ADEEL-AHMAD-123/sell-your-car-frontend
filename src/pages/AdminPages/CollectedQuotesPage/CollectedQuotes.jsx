import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCollectedQuotes,
  deleteQuote, // Reusing the generic delete action
} from '../../../redux/slices/adminQuoteSlice';
import Spinner from '../../../components/common/Spinner';
import QuoteDetailsModal from '../../../components/Admin/QuoteDetailsModal/QuoteDetailsModal';
import DeleteModal from '../../../components/Admin/DeleteModal/DeleteModal.jsx';
import { useDebouncedValue } from '../../../utils/useDebouncedValue';

import styles from '../../../styles/shared/AdminQuotesShared.module.scss';

const CollectedQuotes = () => {
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
  const [modalDeleteQuote, setModalDeleteQuote] = useState(null);

  // Redux selectors
  // Pulling deleteLoading and deleteError from the top level of the state
  const {
    collected: {
      response: collectedResponseFromRedux,
      loading: collectedLoading = false,
      error: collectedError = null,
    } = {},
    deleteLoading = false,
    deleteError = null,
  } = useSelector((state) => state.adminQuotes || {});

  // === Defensive check for collectedResponse ===
  const collectedResponse = collectedResponseFromRedux || {};

  const {
    quotes = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = collectedResponse;

  // Fetch data on filter change
  useEffect(() => {
    dispatch(fetchCollectedQuotes({ params: debouncedFilters }));
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

  const handleDeleteConfirmation = (quote) => {
    setModalDeleteQuote(quote);
  };

  const handleCloseDeleteModal = () => {
    setModalDeleteQuote(null);
  };

  const onConfirmDelete = async (quote) => {
    try {
      // Dispatch the generic deleteQuote action
      await dispatch(deleteQuote(quote._id));
      handleCloseDeleteModal();
      // Refetch quotes to update the list after deletion
      dispatch(fetchCollectedQuotes({ params: debouncedFilters }));
    } catch (error) {
      console.error("Failed to delete quote:", error);
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
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
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
            <th>Date Collected</th>
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
              <td title={formatDate(quote?.collectionDetails?.collectedAt)}>
                {formatDate(quote?.collectionDetails?.collectedAt)}
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
                    className={styles['btn-delete']}
                    onClick={() => handleDeleteConfirmation(quote)}
                    aria-label={`Delete quote for ${quote?.vehicleRegistration?.Vrm || 'vehicle'}`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-trash-2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
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
            <div className={styles['detail-item']}>
              <div className={styles.label}>Collected Date</div>
              <div className={styles.value}>{formatDate(quote?.collectionDetails?.collectedAt)}</div>
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
              className={styles['btn-delete']}
              onClick={() => handleDeleteConfirmation(quote)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTableContent = () => {
    if (collectedLoading) {
      return (
        <div className={styles['spinner-container']}>
          <Spinner />
        </div>
      );
    }

    if (collectedError) {
      return <p className={styles['error-text']}>{collectedError}</p>;
    }

    if (quotes.length === 0) {
      return <div className={styles['empty-state']}>No collected quotes available.</div>;
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
        <h1>Collected Quotes</h1>
        <p className={styles['page-description']}>
          Manage quotes that have been accepted and are ready for collection.
        </p>
      </div>

      {/* Info banners */}
      <div className={styles['admin-info-banner']}>
        <div className={`${styles['admin-info-card']} ${styles['highlight-blue']}`}>
          <div className={styles.icon}>✅</div>
          <div className={styles.content}>
            <h3>What Is This Page?</h3>
            <p>
              This page displays a comprehensive list of all quotes for which the vehicle has been successfully collected.
            </p>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-green']}`}>
          <div className={styles.icon}>📋</div>
          <div className={styles.content}>
            <h3>What Can You Do?</h3>
            <ul>
              <li><strong>View:</strong> Inspect the full details of a collected vehicle quote.</li>
              <li><strong>Filter:</strong> Search by customer, vehicle, or registration to find specific quotes.</li>
              <li><strong>Delete:</strong> Permanently remove a collected quote.</li>
            </ul>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-purple']}`}>
          <div className={styles.icon}>💡</div>
          <div className={styles.content}>
            <h3>Key Information</h3>
            <ul>
              <li><strong>Price:</strong> The final agreed price for the vehicle.</li>
              <li><strong>Weight:</strong> The Kerb weight in kilograms, from the vehicle API.</li>
              <li><strong>Type:</strong> Indicates if the quote was a manual or an auto-generated quote.</li>
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
          <p>Total Collected Quotes: {total}</p>
        </div>
        {renderTableContent()}
      </div>

      {/* Quote Details Modal */}
      {modalQuote && (
        <QuoteDetailsModal
          quote={modalQuote}
          onClose={handleCloseDetailsModal}
          pageType={"collected"}
        />
      )}

      {/* Delete Modal */}
      {modalDeleteQuote && (
        <DeleteModal
          title="Delete Collected Quote"
          status={"collected"}
          quote={modalDeleteQuote}
          onClose={handleCloseDeleteModal}
          onConfirm={onConfirmDelete}
          loading={deleteLoading}
          error={deleteError}
          vehicle={getVehicleString(modalDeleteQuote)}
        />
      )}
    </section>
  );
};

export default CollectedQuotes;
