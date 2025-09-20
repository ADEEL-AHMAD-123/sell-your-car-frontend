import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingAutoQuotes,
  deleteQuote,
  clearDeletionError, // Import the new action
} from '../../../redux/slices/adminQuoteSlice';
import Spinner from '../../../components/common/Spinner';
import QuoteDetailsModal from '../../../components/Admin/QuoteDetailsModal/QuoteDetailsModal';
import DeleteModal from '../../../components/Admin/DeleteModal/DeleteModal';
import { useDebouncedValue } from '../../../utils/useDebouncedValue';


import styles from '../../../styles/shared/AdminQuotesShared.module.scss';
import ClientContactModal from '../../../components/Admin/ClientContactModal/ClientContactModal';

const PendingAutoQuotes = () => {
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
  const [contactModalQuote, setContactModalQuote] = useState(null);
  const [deleteModalQuote, setDeleteModalQuote] = useState(null);

  // Redux selectors
  const {
    pendingAuto: {
      response: pendingAutoResponseFromRedux,
      loading: pendingAutoLoading = false,
      error: pendingAutoError = null,
    } = {},
    deletion: {
      loading: deleteLoading = false,
      error: deleteError = null,
    } = {},
  } = useSelector((state) => state.adminQuotes || {});

  // === Defensive check for pendingAutoResponse ===
  const pendingAutoResponse = pendingAutoResponseFromRedux || {};

  const {
    quotes = [],
    total = 0,
    page = 1,
    totalPages = 1,
  } = pendingAutoResponse;

  // Fetch data on filter change
  useEffect(() => {
    dispatch(fetchPendingAutoQuotes({ params: debouncedFilters }));
  }, [dispatch, debouncedFilters]);

  // Handler to clear deletion error when the modal is closed
  useEffect(() => {
    if (!deleteModalQuote && deleteError) {
      dispatch(clearDeletionError());
    }
  }, [deleteModalQuote, deleteError, dispatch]);

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

  const handleClientContact = (quote) => {
    setContactModalQuote(quote);
  };

  const handleCloseContactModal = () => {
    setContactModalQuote(null);
  };

  const handleDeleteConfirmation = (quote) => {
    // Clear any existing deletion error before opening the modal
    dispatch(clearDeletionError());
    setDeleteModalQuote(quote);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalQuote(null);
  };

  const handleConfirmDelete = async (quote) => {
    if (quote?._id) {
      try {
        // Dispatch the delete action
        const resultAction = await dispatch(deleteQuote({ id: quote._id }));

        // Check if the deletion was successful before closing the modal
        if (deleteQuote.fulfilled.match(resultAction)) {
          handleCloseDeleteModal();
          // Optionally, refetch the list to ensure the UI is fully updated
          dispatch(fetchPendingAutoQuotes({ params: debouncedFilters }));
        }
      } catch (error) {
        // This catch block will only run if there's a problem with the dispatch itself,
        // not a rejection from the API call (which is handled by the Redux slice).
        console.error("Failed to dispatch delete quote action:", error);
      }
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

  const renderDesktopTable = () => (
    <div className={styles['table-wrapper']}>
      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Vehicle</th>
            <th>Client</th>
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
              <td title={formatPrice(quote.estimatedScrapPrice)}>
                {formatPrice(quote.estimatedScrapPrice)}
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
                  <button
                    className={styles['btn-contact']}
                    onClick={() => handleClientContact(quote)}
                    aria-label={`Contact client for ${quote?.vehicleRegistration?.Vrm || 'vehicle'}`}
                  >
                    Client Contact
                  </button>
                  <button
                    className={styles['btn-delete']}
                    onClick={() => handleDeleteConfirmation(quote)}
                    aria-label={`Delete quote for ${quote?.vehicleRegistration?.Vrm || 'quote'}`}
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
              <div className={styles.value}>{formatPrice(quote.estimatedScrapPrice)}</div>
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
            <button
              className={styles['btn-contact']}
              onClick={() => handleClientContact(quote)}
            >
              Client Contact
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
    return pendingAutoLoading ? (
      <div className={styles['spinner-container']}>
        <Spinner />
      </div>
    ) : pendingAutoError ? (
      <p className={styles['error-text']}>{pendingAutoError}</p>
    ) : quotes.length === 0 ? (
      <div className={styles['empty-state']}>No pending auto quotes available.</div>
    ) : (
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
        <h1>Pending Auto Quotes</h1>
        <p className={styles['page-description']}>
          View and manage auto-generated quotes that have not yet been accepted or rejected.
        </p>
      </div>

      {/* Info banners */}
      <div className={styles['admin-info-banner']}>
        <div className={`${styles['admin-info-card']} ${styles['highlight-blue']}`}>
          <div className={styles.icon}>📄</div>
          <div className={styles.content}>
            <h3>What Is This Page?</h3>
            <p>
              This page displays all quotes that were automatically generated and are awaiting a response from the customer.
            </p>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-green']}`}>
          <div className={styles.icon}>🛠</div>
          <div className={styles.content}>
            <h3>What Can You Do?</h3>
            <ul>
              <li><strong>View:</strong> Inspect quote and vehicle details.</li>
              <li><strong>Client Contact:</strong> Get contact details for the client.</li>
              <li><strong>Filter:</strong> Search by customer, vehicle, or registration.</li>
              <li><strong>Delete:</strong> Remove quotes that are no longer needed.</li>
            </ul>
          </div>
        </div>

        <div className={`${styles['admin-info-card']} ${styles['highlight-purple']}`}>
          <div className={styles.icon}>💡</div>
          <div className={styles.content}>
            <h3>Key Information</h3>
            <ul>
              <li><strong>Price:</strong> The auto-generated price for the vehicle.</li>
              <li><strong>Weight:</strong> Kerb weight in kilograms (from vehicle API).</li>
              <li><strong>Type:</strong> All quotes on this page are auto-generated.</li>
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
          <p>Total Pending Auto Quotes: {total}</p>
        </div>
        {renderTableContent()}
      </div>

      {/* Quote Details Modal */}
      {modalQuote && (
        <QuoteDetailsModal
          quote={modalQuote}
          onClose={handleCloseDetailsModal}
          pageType={"pending-auto"}
        />
      )}

      {/* Client Contact Modal */}
      {contactModalQuote && (
        <ClientContactModal
          quote={contactModalQuote}
          onClose={handleCloseContactModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalQuote && (
        <DeleteModal
          title="Confirm Deletion"
          vehicle={getVehicleString(deleteModalQuote)}
          status={"Auto Pending"}
          onClose={handleCloseDeleteModal}
          onConfirm={() => handleConfirmDelete(deleteModalQuote)}
          loading={deleteLoading}
          error={deleteError}
        />
      )}
    </section>
  );
};

export default PendingAutoQuotes;
