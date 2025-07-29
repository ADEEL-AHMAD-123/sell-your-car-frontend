import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPendingManualQuotes,
  reviewManualQuote,
  clearReviewError
} from '../../../redux/slices/adminQuoteSlice';

import QuoteTable from '../../../components/Admin/QuoteTable/QuoteTable';
import ReviewModal from '../../../components/Admin/ReviewModal/ReviewModal';
import './AllManualQuotes.scss';

const AllManualQuotes = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [modalQuote, setModalQuote] = useState(null);

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
  } = pendingResponse || {};

  useEffect(() => {
    dispatch(fetchPendingManualQuotes({ params: filters }));
  }, [dispatch, filters]);

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleReview = (quote) => {
    dispatch(clearReviewError()); // clear any old errors when opening new modal
    setModalQuote(quote);
  };

  const handleCloseModal = () => {
    dispatch(clearReviewError()); // clear review error only
    setModalQuote(null);
  };

  const onSubmitReview = async ({ adminOfferPrice, adminMessage }) => {
    const resultAction = await dispatch(
      reviewManualQuote({
        data: {
          adminOfferPrice,
          adminMessage,
        },
        id: modalQuote._id,
      })
    );
    

    if (reviewManualQuote.fulfilled.match(resultAction)) {
      handleCloseModal(); // Close modal only on success
    }
  };

  return (
    <section className="admin-quotes-page">
      <h1>Pending Manual Quotes</h1>

      {pendingLoading ? (
        <p>Loading...</p>
      ) : pendingError ? (
        <p className="error-text">{pendingError}</p>
      ) : quotes.length === 0 ? (
        <p>No pending quotes found.</p>
      ) : (
        <QuoteTable
          quotes={quotes}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onReview={handleReview}
        />
      )}

      {modalQuote && (
        <ReviewModal
          quote={modalQuote}
          onSubmit={onSubmitReview}
          onClose={handleCloseModal}
          loading={reviewLoading}
          error={reviewError}
        />
      )}
    </section>
  );
};

export default AllManualQuotes;
