import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  quote: null,           // latest quote result
  checksLeft: 2,         // limit per user (starts at 2)
  status: 'idle',        // idle | loading | success | error
  error: null,
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    requestQuoteStart: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    requestQuoteSuccess: (state, action) => {
      state.status = 'success';
      state.quote = action.payload;
      state.checksLeft = Math.max(state.checksLeft - 1, 0); // never < 0
    },
    requestQuoteFail: (state, action) => {
      state.status = 'error';
      state.error = action.payload;
    },
    resetQuote: (state) => {
      state.quote = null;
      state.status = 'idle';
      state.error = null;
    },
  },
});

export const {
  requestQuoteStart,
  requestQuoteSuccess,
  requestQuoteFail,
  resetQuote,
} = quoteSlice.actions;

export default quoteSlice.reducer;
