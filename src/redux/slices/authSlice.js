// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { createApiAsyncThunk } from "../../utils/apiHelper";

// API thunks
export const registerUser = createApiAsyncThunk({
  name: "register",
  method: "POST",
  url: "/api/auth/register",
  typePrefix: "auth",
});

export const loginUser = createApiAsyncThunk({
  name: "login",
  method: "POST",
  url: "/api/auth/login",
  typePrefix: "auth",
});

export const getLoggedInUser = createApiAsyncThunk({
  name: "getLoggedInUser",
  method: "GET",
  url: "/api/auth/me",
  typePrefix: "auth",
  prepareHeaders: true,
});

export const logoutUser = createApiAsyncThunk({
  name: "logout",
  method: "POST",
  url: "/api/auth/logout",
  typePrefix: "auth",
  prepareHeaders: true,
});

export const verifyEmail = createApiAsyncThunk({
  name: "verifyEmail",
  method: "GET",
  url: (rest) => `/api/auth/verifyemail/${rest.token}`,
  typePrefix: "auth",
});

export const forgotPassword = createApiAsyncThunk({
  name: "forgotPassword",
  method: "POST",
  url: "/api/auth/forgotpassword",
  typePrefix: "auth",
});

export const resetPassword = createApiAsyncThunk({
  name: "resetPassword",
  method: "PUT",
  url: (rest) => `/api/auth/resetpassword/${rest.token}`,
  typePrefix: "auth",
});

export const updatePassword = createApiAsyncThunk({
  name: "updatePassword",
  method: "PUT",
  url: "/api/auth/updatepassword",
  typePrefix: "auth",
  prepareHeaders: true,
});

export const resendVerificationEmail = createApiAsyncThunk({
  name: "resendVerificationEmail",
  method: "POST",
  url: "/api/auth/resendVerificationEmail",
  typePrefix: "auth",
});

const initialState = {
  user: null,
  token: null, // New: Store the token separately
  isAuthenticated: false,
  isLoading: false,
  error: null,
  authError: null,
  resendLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: () => initialState,
    clearAuthError: (state) => {
      state.authError = null;
    },
  },
  extraReducers: (builder) => {
    builder // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.payload?.message || "Registration failed";
      }) // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user; // Update user data
        state.token = action.payload.data.token; // Update the token
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        if (action.payload?.message.includes("Please verify your email")) {
          state.authError = action.payload.message;
        } else {
          state.authError = action.payload?.message || "Login failed";
        }
      }) // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null; // Clear the token on logout
        state.isAuthenticated = false;
        state.isLoading = false;
        state.authError = null;
      }) // Get Logged-in User
      .addCase(getLoggedInUser.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.data.user) {
          state.user = action.payload.data.user;
        }
      })
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.authError =
          action.payload?.message || "Failed to fetch user data";
      })
      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.authError =
          action.payload?.message || "Email verification failed";
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.authError =
          action.payload?.message || "Forgot password request failed";
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.payload?.message || "Password reset failed";
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.authError = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.authError = action.payload?.message || "Password update failed";
      })
      // Resend Verification Email
      .addCase(resendVerificationEmail.pending, (state) => {
        state.resendLoading = true;
        state.authError = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.resendLoading = false;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.resendLoading = false;
        state.authError = action.payload?.message || "Failed to resend email";
      });
  },
});

export const { resetAuthState, clearAuthError } = authSlice.actions;
export default authSlice.reducer;