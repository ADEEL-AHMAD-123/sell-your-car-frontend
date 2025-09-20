import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

// API Thunks
export const sendPromotionalEmail = createApiAsyncThunk({
  name: "sendPromotionalEmail",
  method: "POST",
  url: "/api/promo/sendPromotionalEmail",
  typePrefix: "promo",
  prepareHeaders: true,
});

// MODIFIED: This thunk now accepts a token as a parameter.
// The `url` function dynamically builds the URL with the token.
export const unsubscribeUser = createApiAsyncThunk({
  name: "unsubscribeUser",
  method: "GET",
  url: (data) => {
    const { token } = data;
    if (!token) {
      throw new Error("Unsubscribe token is missing.");
    }
    return `/api/promo/unsubscribe?token=${token}`;
  },
  typePrefix: "promo",
});

const initialState = {
  isLoading: false,
  error: null,
  successMessage: null,
  unsubscribeIsLoading: false,
  unsubscribeError: null,
  unsubscribeSuccessMessage: null,
};

const promoSlice = createSlice({
  name: "promo",
  initialState,
  reducers: {
    // A reducer to reset the state after the email is sent or on page leave
    resetPromoState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
    // A reducer to reset only the unsubscribe state
    resetUnsubscribeState: (state) => {
      state.unsubscribeIsLoading = false;
      state.unsubscribeError = null;
      state.unsubscribeSuccessMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPromotionalEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(sendPromotionalEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload?.message || "Emails sent successfully!";
      })
      .addCase(sendPromotionalEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to send emails.";
        state.successMessage = null;
      })
      .addCase(unsubscribeUser.pending, (state) => {
        state.unsubscribeIsLoading = true;
        state.unsubscribeError = null;
        state.unsubscribeSuccessMessage = null;
      })
      .addCase(unsubscribeUser.fulfilled, (state, action) => {
        state.unsubscribeIsLoading = false;
        state.unsubscribeSuccessMessage = action.payload?.message || "You have been successfully unsubscribed from our marketing emails.";
      })
      .addCase(unsubscribeUser.rejected, (state, action) => {
        state.unsubscribeIsLoading = false;
        state.unsubscribeError = action.payload?.message || "The unsubscribe link is invalid or has expired.";
        state.unsubscribeSuccessMessage = null;
      });
  },
});

export const { resetPromoState, resetUnsubscribeState } = promoSlice.actions;
export default promoSlice.reducer;
