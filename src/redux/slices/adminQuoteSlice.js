import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

// -------------------
// API Endpoints
// -------------------
const API = {
  PENDING_MANUAL_QUOTES: "/api/quote/pending-manual",
  PENDING_AUTO_QUOTES: "/api/quote/pending-auto",
  REJECTED_QUOTES: "/api/quote/rejected",
  ACCEPTED_QUOTES: "/api/quote/accepted",
  COLLECTED_QUOTES: "/api/quote/collected",
  REVIEW_QUOTE: (id) => `/api/quote/review-manual/${id}`,
  MARK_COLLECTED: (id) => `/api/quote/collection-status/${id}`,
  DELETE_QUOTE: (id) => `/api/quote/${id}`,
};

// -------------------
// Thunks
// -------------------
export const fetchPendingManualQuotes = createApiAsyncThunk({
  name: "fetchPendingManualQuotes",
  method: "GET",
  url: API.PENDING_MANUAL_QUOTES,
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

export const fetchPendingAutoQuotes = createApiAsyncThunk({
  name: "fetchPendingAutoQuotes",
  method: "GET",
  url: API.PENDING_AUTO_QUOTES,
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

export const fetchRejectedQuotes = createApiAsyncThunk({
  name: "fetchRejectedQuotes",
  method: "GET",
  url: API.REJECTED_QUOTES,
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

export const fetchAcceptedQuotes = createApiAsyncThunk({
  name: "fetchAcceptedQuotes",
  method: "GET",
  url: API.ACCEPTED_QUOTES,
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

export const fetchCollectedQuotes = createApiAsyncThunk({
  name: "fetchCollectedQuotes",
  method: "GET",
  url: API.COLLECTED_QUOTES,
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

export const reviewManualQuote = createApiAsyncThunk({
  name: "reviewManualQuote",
  method: "PATCH",
  url: ({ id }) => API.REVIEW_QUOTE(id),
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

export const markManualQuoteAsCollected = createApiAsyncThunk({
  name: "markManualQuoteAsCollected",
  method: "PATCH",
  url: ({ id }) => API.MARK_COLLECTED(id),
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

export const deleteQuote = createApiAsyncThunk({
  name: "deleteQuote",
  method: "DELETE",
  url: ({ id }) => API.DELETE_QUOTE(id),
  typePrefix: "adminQuotes",
  prepareHeaders: true,
});

// -------------------
// Initial State
// -------------------
const initialState = {
  pendingManual: {
    response: null,
    loading: false,
    error: null,
  },
  pendingAuto: {
    response: null,
    loading: false,
    error: null,
  },
  rejected: {
    response: null,
    loading: false,
    error: null,
  },
  accepted: {
    response: null,
    loading: false,
    error: null,
  },
  collected: {
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
  deletion: {
    loading: false,
    error: null,
  }
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
      state.pendingManual.error = null;
      state.pendingAuto.error = null;
      state.rejected.error = null;
      state.accepted.error = null;
      state.collected.error = null;
      state.review.error = null;
    },
    clearReviewError: (state) => {
      state.review.error = null;
    },
    clearDeletionError: (state) => {
      state.deletion.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === Fetch Pending Manual ===
      .addCase(fetchPendingManualQuotes.pending, (state) => {
        state.pendingManual.loading = true;
        state.pendingManual.error = null;
      })
      .addCase(fetchPendingManualQuotes.fulfilled, (state, action) => {
        state.pendingManual.loading = false;
        state.pendingManual.response = action.payload.data || {};
      })
      .addCase(fetchPendingManualQuotes.rejected, (state, action) => {
        state.pendingManual.loading = false;
        state.pendingManual.error =
          action.payload?.message || "Failed to fetch pending manual quotes.";
      })
      // === Fetch Pending Auto ===
      .addCase(fetchPendingAutoQuotes.pending, (state) => {
        state.pendingAuto.loading = true;
        state.pendingAuto.error = null;
      })
      .addCase(fetchPendingAutoQuotes.fulfilled, (state, action) => {
        state.pendingAuto.loading = false;
        state.pendingAuto.response = action.payload.data || {};
      })
      .addCase(fetchPendingAutoQuotes.rejected, (state, action) => {
        state.pendingAuto.loading = false;
        state.pendingAuto.error =
          action.payload?.message || "Failed to fetch pending auto quotes.";
      })
      // === Fetch Rejected Quotes ===
      .addCase(fetchRejectedQuotes.pending, (state) => {
        state.rejected.loading = true;
        state.rejected.error = null;
      })
      .addCase(fetchRejectedQuotes.fulfilled, (state, action) => {
        state.rejected.loading = false;
        state.rejected.response = action.payload.data || {};
      })
      .addCase(fetchRejectedQuotes.rejected, (state, action) => {
        state.rejected.loading = false;
        state.rejected.error =
          action.payload?.message || "Failed to fetch rejected quotes.";
      })
      // === Fetch Accepted ===
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
      })
      // === Fetch Collected ===
      .addCase(fetchCollectedQuotes.pending, (state) => {
        state.collected.loading = true;
        state.collected.error = null;
      })
      .addCase(fetchCollectedQuotes.fulfilled, (state, action) => {
        state.collected.loading = false;
        state.collected.response = action.payload.data || {};
      })
      .addCase(fetchCollectedQuotes.rejected, (state, action) => {
        state.collected.loading = false;
        state.collected.error =
          action.payload?.message || "Failed to fetch collected quotes.";
      })
      // === Review Quote ===
      .addCase(reviewManualQuote.pending, (state) => {
        state.review.loading = true;
        state.review.error = null;
      })
      .addCase(reviewManualQuote.fulfilled, (state, action) => {
        state.review.loading = false;
        const reviewed = action.payload.data?.manualQuote;
        if (reviewed && state.pendingManual.response?.quotes) {
          state.pendingManual.response.quotes = state.pendingManual.response.quotes.filter(
            (quote) => quote._id !== reviewed._id
          );
        }
      })
      .addCase(reviewManualQuote.rejected, (state, action) => {
        state.review.loading = false;
        state.review.error =
          action.payload?.message || "Failed to review quote.";
      })
      // === Mark as Collected ===
      .addCase(markManualQuoteAsCollected.pending, (state) => {
        // Defensive check to ensure the 'collect' state object exists
        if (!state.collect) {
          state.collect = { loading: false, error: null };
        }
        state.collect.loading = true;
        state.collect.error = null;
      })
      .addCase(markManualQuoteAsCollected.fulfilled, (state, action) => {
        // Defensive check
        if (!state.collect) {
          state.collect = { loading: false, error: null };
        }
        state.collect.loading = false;
        const updated = action.payload.data?.quote;
        if (updated && state.accepted.response?.quotes) {
          state.accepted.response.quotes = state.accepted.response.quotes.filter(
            (quote) => quote._id !== updated._id
          );
        }
      })
      .addCase(markManualQuoteAsCollected.rejected, (state, action) => {
        // Defensive check
        if (!state.collect) {
          state.collect = { loading: false, error: null };
        }
        state.collect.loading = false;
        state.collect.error =
          action.payload?.message || "Failed to mark as collected.";
      })
      // === Delete Quote ===
      .addCase(deleteQuote.pending, (state) => {
        state.deletion.loading = true;
        state.deletion.error = null;
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.deletion.loading = false;
        const deletedId = action.meta.arg.id;
        // Remove the deleted quote from all relevant state arrays
        const updateQuotes = (quotes) => quotes.filter((q) => q._id !== deletedId);
        if (state.pendingManual.response?.quotes) {
          state.pendingManual.response.quotes = updateQuotes(state.pendingManual.response.quotes);
        }
        if (state.pendingAuto.response?.quotes) {
          state.pendingAuto.response.quotes = updateQuotes(state.pendingAuto.response.quotes);
        }
        if (state.rejected.response?.quotes) {
          state.rejected.response.quotes = updateQuotes(state.rejected.response.quotes);
        }
        if (state.accepted.response?.quotes) {
          state.accepted.response.quotes = updateQuotes(state.accepted.response.quotes);
        }
        if (state.collected.response?.quotes) {
          state.collected.response.quotes = updateQuotes(state.collected.response.quotes);
        }
      })
      .addCase(deleteQuote.rejected, (state, action) => {
        state.deletion.loading = false;
        state.deletion.error = action.payload?.message || "Failed to delete quote.";
      });
  },
});

export const { clearQuoteErrors, clearReviewError, clearDeletionError, resetState, } = adminQuoteSlice.actions;
export default adminQuoteSlice.reducer;
