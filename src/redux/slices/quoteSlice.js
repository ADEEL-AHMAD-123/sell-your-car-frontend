import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createApiAsyncThunk } from '../../utils/apiHelper';

export const quoteAsyncActions = {
  getQuote: createAsyncThunk('quote/getQuote', createApiAsyncThunk({
    name: 'getQuote',
    method: 'POST',
    url: '/quote/get',
  })),
};

const initialState = {
  quote: null,
  checksLeft: null,
  isLoading: false,
  error: null,
};

const quoteSlice = createSlice({
  name: 'quote',
  initialState,
  reducers: {
    resetQuote: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(quoteAsyncActions.getQuote.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(quoteAsyncActions.getQuote.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.quote = payload.quote;
        state.checksLeft = payload.checksLeft;
      })
      .addCase(quoteAsyncActions.getQuote.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      });
  },
});

export const { resetQuote } = quoteSlice.actions;
export default quoteSlice.reducer;
