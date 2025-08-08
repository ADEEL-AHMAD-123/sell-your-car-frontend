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
});

export const logoutUser = createApiAsyncThunk({
  name: "logout",
  method: "POST",
  url: "/api/auth/logout",
  typePrefix: "auth",
});

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      
      // Get Logged-in User
      .addCase(getLoggedInUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch user data";
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;