// src/redux/slices/adminQuoteSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

// -------------------
// API Endpoints
// -------------------
const API = {
  PENDING_QUOTES: "/api/quote/pending-manual",
  ACCEPTED_QUOTES: "/api/quote/accepted",
  REVIEW_QUOTE: (id) => `/api/quote/review-manual/${id}`,
  MARK_COLLECTED: (id) => `/api/quote/collection-status/${id}`,
};

// -------------------
// Thunks
// -------------------
export const fetchPendingManualQuotes = createApiAsyncThunk({
  name: "fetchPendingManualQuotes",
  method: "GET",
  url: API.PENDING_QUOTES,
  typePrefix: "adminQuotes",
  prepareHeaders: true, // ADDED
});

export const fetchAcceptedQuotes = createApiAsyncThunk({
  name: "fetchAcceptedQuotes",
  method: "GET",
  url: API.ACCEPTED_QUOTES,
  typePrefix: "adminQuotes",
  prepareHeaders: true, // ADDED
});

export const reviewManualQuote = createApiAsyncThunk({
  name: "reviewManualQuote",
  method: "PATCH",
  url: ({ id }) => API.REVIEW_QUOTE(id),
  typePrefix: "adminQuotes",
  prepareHeaders: true, // ADDED
});

export const markManualQuoteAsCollected = createApiAsyncThunk({
  name: "markManualQuoteAsCollected",
  method: "PATCH",
  url: ({ id }) => API.MARK_COLLECTED(id),
  typePrefix: "adminQuotes",
  prepareHeaders: true, // ADDED
});

// -------------------
// Initial State
// -------------------
const initialState = {
  pending: {
    response: null,
    loading: false,
    error: null,
  },
  accepted: {
    response: null,
    loading: false,
    error: null,
  },
  review: {
    loading: false,
    error: null,
  },
  collect: {
    loading: false,
    error: null,
  },
};

// -------------------
// Slice
// -------------------
const adminQuoteSlice = createSlice({
  name: "adminQuotes",
  initialState,
  reducers: {
    resetState: () => initialState,
    clearQuoteErrors: (state) => {
      state.pending.error = null;
      state.accepted.error = null;
      state.review.error = null;
    },
    clearReviewError: (state) => {
      state.review.error = null;
    },
  },
  extraReducers: (builder) => {
    builder // === Fetch Pending ===

      .addCase(fetchPendingManualQuotes.pending, (state) => {
        state.pending.loading = true;
        state.pending.error = null;
      })
      .addCase(fetchPendingManualQuotes.fulfilled, (state, action) => {
        state.pending.loading = false;
        state.pending.response = action.payload.data || {};
      })
      .addCase(fetchPendingManualQuotes.rejected, (state, action) => {
        state.pending.loading = false;
        state.pending.error =
          action.payload?.message || "Failed to fetch pending quotes.";
      }) // === Fetch Accepted ===

      .addCase(fetchAcceptedQuotes.pending, (state) => {
        state.accepted.loading = true;
        state.accepted.error = null;
      })
      .addCase(fetchAcceptedQuotes.fulfilled, (state, action) => {
        state.accepted.loading = false;
        state.accepted.response = action.payload.data || {};
      })
      .addCase(fetchAcceptedQuotes.rejected, (state, action) => {
        state.accepted.loading = false;
        state.accepted.error =
          action.payload?.message || "Failed to fetch accepted quotes.";
      }) // === Review Quote ===
      .addCase(reviewManualQuote.pending, (state) => {
        state.review.loading = true;
        state.review.error = null;
      })
      .addCase(reviewManualQuote.fulfilled, (state, action) => {
        state.review.loading = false;
        const reviewed = action.payload.data?.manualQuote;
        if (reviewed && state.pending.response?.quotes) {
          state.pending.response.quotes = state.pending.response.quotes.filter(
            (quote) => quote._id !== reviewed._id
          );
        }
      })
      .addCase(reviewManualQuote.rejected, (state, action) => {
        state.review.loading = false;
        state.review.error =
          action.payload?.message || "Failed to review quote.";
      }) // === Mark as Collected ===

      .addCase(markManualQuoteAsCollected.pending, (state) => {
        state.accepted.loading = true;
        state.accepted.error = null;
      })
      .addCase(markManualQuoteAsCollected.fulfilled, (state, action) => {
        state.accepted.loading = false;
        const updated = action.payload.data?.manualQuote;
        if (updated && state.accepted.response?.quotes) {
          state.accepted.response.quotes = state.accepted.response.quotes.map(
            (quote) => (quote._id === updated._id ? updated : quote)
          );
        }
      })
      .addCase(markManualQuoteAsCollected.rejected, (state, action) => {
        state.accepted.loading = false;
        state.accepted.error =
          action.payload?.message || "Failed to mark as collected.";
      });
  },
});

export const { clearQuoteErrors, clearReviewError,resetState, } = adminQuoteSlice.actions;
export default adminQuoteSlice.reducer;
