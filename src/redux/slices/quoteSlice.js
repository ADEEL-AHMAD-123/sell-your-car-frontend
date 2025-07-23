// src/redux/slices/quoteSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

export const getQuote = createApiAsyncThunk({
  name: "getQuote",
  method: "POST",
  url: "/api/quote/get",
  typePrefix: "quote",
});

const initialState = {
  quote: null,
  isLoading: false,
  error: null,
  status: "idle",
};

const quoteSlice = createSlice({
  name: "quote",
  initialState,
  reducers: {
    resetQuote: () => initialState,
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { resetQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
