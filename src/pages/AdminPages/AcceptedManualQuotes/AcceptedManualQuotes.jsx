import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAcceptedManualQuotes,
  markManualQuoteAsCollected,
} from '../../../redux/slices/adminQuoteSlice';
import QuoteTable from '../../../components/Admin/QuoteTable/QuoteTable';

const AcceptedManualQuotes = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({});
  const [collectingId, setCollectingId] = useState(null);

  const { accepted = {} } = useSelector((state) => state.adminQuotes || {});
  const {
    data: acceptedQuotes = [],
    loading = false,
    error = null,
  } = accepted;

  useEffect(() => {
    dispatch(fetchAcceptedManualQuotes({ params: filters }));
  }, [dispatch, filters]);

  const handleMarkAsCollected = (quoteId) => {
    setCollectingId(quoteId);
    dispatch(markManualQuoteAsCollected(quoteId)).finally(() => {
      setCollectingId(null);
    });
  };

  return (
    <section className="admin-quotes-page">
      <h1>Accepted Manual Quotes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : (
        <QuoteTable
          quotes={acceptedQuotes}
          showMarkAsCollected
          onMarkAsCollected={handleMarkAsCollected}
          collectingId={collectingId}
        />
      )}
    </section>
  );
};

export default AcceptedManualQuotes;
