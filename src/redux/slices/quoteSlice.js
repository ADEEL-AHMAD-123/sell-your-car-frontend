import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

// Auto Quote (based on registration)
export const getQuote = createApiAsyncThunk({
  name: "getQuote",
  method: "POST",
  url: "/api/quote/get",
  typePrefix: "quote",
});

// Manual Quote (user enters vehicle details manually)
export const requestManualQuote = createApiAsyncThunk({
  name: "requestManualQuote",
  method: "POST",
  url: "/api/quote/manual-quote",
  typePrefix: "manualQuote",
});

const initialState = {
  quote: null,
  manualQuote: null,
  isLoading: false,
  manualLoading: false,
  error: null,
  manualError: null,
  status: "idle",
  manualStatus: "idle",
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    resetQuote: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Auto Quote reducers
      .addCase(getQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.status = "loading";
      })
      .addCase(getQuote.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quote = action.payload?.data?.vehicle || null;
        state.status = "succeeded";
      })
      .addCase(getQuote.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Something went wrong";
        state.status = "failed";
      })

      // Manual Quote reducers
      .addCase(requestManualQuote.pending, (state) => {
        state.manualLoading = true;
        state.manualError = null;
        state.manualStatus = "loading";
      })
      .addCase(requestManualQuote.fulfilled, (state, action) => {
        state.manualLoading = false;
        state.manualQuote = action.payload?.data || null;
        state.manualStatus = "succeeded";
      })
      .addCase(requestManualQuote.rejected, (state, action) => {
        state.manualLoading = false;
        state.manualError = action.payload?.message || "Something went wrong";
        state.manualStatus = "failed";
      });
  },
});

export const { resetQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
