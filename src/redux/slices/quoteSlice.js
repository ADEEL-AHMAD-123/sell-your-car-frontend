// src/redux/slices/quoteSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

/**
 * 🚗 Auto Quote (via registration)
 * backend sends: { data: { quote, autoQuoteAvailable } }
 */
export const getQuote = createApiAsyncThunk({
  name: "getQuote",
  method: "POST",
  url: "/api/quote/get", 
  typePrefix: "quote",
});

/**
 * 📝 Manual Quote Request (user fills form)
 */
export const requestManualQuote = createApiAsyncThunk({
  name: "requestManualQuote",
  method: "POST",
  url: "/api/quote/manual-quote",
  typePrefix: "manualQuote",
});

/**
 * ✅ Client confirms acceptance + provides collection details (combined)
 * Backend route: PATCH /api/quote/:id/confirm
 */
export const confirmQuote = createApiAsyncThunk({
  name: "confirmQuote",
  method: "PATCH",
  url: ({ id }) => `/api/quote/${id}/confirm`,
  typePrefix: "confirmQuote",
  prepareHeaders: true,
});

/**
 * 🚚 Admin updates collection status (mark collected)
 */
export const updateCollectionStatus = createApiAsyncThunk({
  name: "updateCollectionStatus",
  method: "PATCH",
  url: ({ id }) => `/api/quote/collection-status/${id}`,
  typePrefix: "collectionStatus",
  prepareHeaders: true,
});

const initialState = {
  // main data
  quote: null,
  manualQuote: null,

  // auto quote
  isLoading: false,
  status: "idle",
  error: null,
  quoteStatus: null,


  // manual quote
  manualLoading: false,
  manualStatus: "idle",
  manualError: null,
  manualQuoteStatus: null, 


  // client confirm (accept + collection)
  confirmLoading: false,
  confirmStatus: "idle",
  confirmError: null,

  // admin collection mark
  collectionLoading: false,
  collectionStatus: "idle",
  collectionError: null,
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    resetQuote: () => initialState,
    resetConfirmStatus: (state) => {
      state.confirmStatus = "idle";
      state.confirmError = null;
      state.confirmLoading = false;
    },
    resetManualState: (state) => {
      state.manualLoading = false;
      state.manualError = null;
      state.manualStatus = "idle";
      state.manualQuote = null; 
      state.manualQuoteStatus = null;

    },
  },
  extraReducers: (builder) => {
    builder
      // === Auto Quote ===
      .addCase(getQuote.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
        state.error = null;
      })
      .addCase(getQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.quote = action.payload?.data?.quote || null;
        state.quoteStatus = action.payload?.data?.status || null;
        state.error=null;
      })
      .addCase(getQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.payload?.message || "Auto quote failed";
      })

      // === Manual Quote ===
      .addCase(requestManualQuote.pending, (state) => {
        state.manualLoading = true;
        state.manualStatus = "loading";
        state.manualError = null;
      })
      .addCase(requestManualQuote.fulfilled, (state, action) => {
        state.manualLoading = false;
        state.manualStatus = "succeeded";
        state.manualError = null;
        state.manualQuote = action.payload?.data?.quote || action.payload?.data || null;
        state.manualQuoteStatus = action.payload?.data?.status || null;
      })
      .addCase(requestManualQuote.rejected, (state, action) => {
        state.manualLoading = false;
        state.manualStatus = "failed";
        state.manualError = action.payload?.message || "Manual quote failed";
      })

      // === Client: confirm (accept + collection in one go) ===
      .addCase(confirmQuote.pending, (state) => {
        state.confirmLoading = true;
        state.confirmStatus = "loading";
        state.confirmError = null;
      })
      .addCase(confirmQuote.fulfilled, (state, action) => {
        state.confirmLoading = false;
        state.confirmStatus = "succeeded";
        const updated = action.payload?.data?.quote;
        if (updated) {
          // Update main quote if it's the same one
          if (state.quote && state.quote._id === updated._id) {
            state.quote = updated;
          }
          // Also update manualQuote if needed
          if (state.manualQuote && state.manualQuote._id === updated._id) {
          state.manualQuote = updated;
          }
        }
      })
      .addCase(confirmQuote.rejected, (state, action) => {
        state.confirmLoading = false;
        state.confirmStatus = "failed";
        state.confirmError = action.payload?.message || "Confirmation failed";
      })

      // === Admin: Collection Status ===
      .addCase(updateCollectionStatus.pending, (state) => {
        state.collectionLoading = true;
        state.collectionStatus = "loading";
        state.collectionError = null;
      })
      .addCase(updateCollectionStatus.fulfilled, (state, action) => {
        state.collectionLoading = false;
        state.collectionStatus = "succeeded";
        const updated = action.payload?.data?.quote;
        if (updated && state.quote && state.quote._id === updated._id) {
          state.quote = updated;
        }
      })
      .addCase(updateCollectionStatus.rejected, (state, action) => {
        state.collectionLoading = false;
        state.collectionStatus = "failed";
        state.collectionError =
          action.payload?.message || "Collection status update failed";
      });
  },
});

export const { resetQuote,resetConfirmStatus,resetManualState } = quoteSlice.actions;
export default quoteSlice.reducer;
