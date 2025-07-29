import React from 'react';
import './QuoteTable.scss';

const QuoteTable = ({ quotes, currentPage, totalPages, onPageChange, onReview }) => {
  if (!quotes || quotes.length === 0) return <p>No quotes available.</p>;

  return (
    <div className="quote-table">
      <table>
        <thead>
          <tr>
            <th>Reg No</th>
            <th>Make</th>
            <th>Model</th>
            <th>Client</th>
            <th>Contact</th>
            <th>Client Offer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote._id}>
              <td>{quote.regNumber}</td>
              <td>{quote.make}</td>
              <td>{quote.model}</td>
              <td>{quote.userId?.firstName} {quote.userId?.lastName}</td>
              <td>{quote.collectionDetails?.contactNumber || 'N/A'}</td>
              <td>£{quote.userEstimatedPrice}</td>
              <td>
                <button className="btn-review" onClick={() => onReview(quote)}>
                  Review
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QuoteTable;
