import { createSlice } from '@reduxjs/toolkit';
import { createApiAsyncThunk } from "../../utils/apiHelper";

// === User-related Thunks ===
export const fetchAllUsers = createApiAsyncThunk({
  name: 'fetchAllUsers',
  method: 'GET',
  url: '/api/admin/users',
  typePrefix: 'admin',
});

export const fetchPaginatedUsers = createApiAsyncThunk({
  name: 'fetchPaginatedUsers',
  method: 'GET',
  url: '/api/admin/users/paginated',
  typePrefix: 'admin',
});

export const searchUsers = createApiAsyncThunk({
  name: 'searchUsers',
  method: 'GET',
  url: (query) => `/api/admin/users/search?query=${query}`,
  typePrefix: 'admin',
});

export const updateUser = createApiAsyncThunk({
  name: 'updateUser',
  method: 'PUT',
  url: (id) => `/api/admin/user/${id}`,
  typePrefix: 'admin',
});

export const deleteUser = createApiAsyncThunk({
  name: 'deleteUser',
  method: 'DELETE',
  url: (id) => `/api/admin/user/${id}`,
  typePrefix: 'admin',
});

// === Quote-related Thunks ===
export const fetchUserQuotes = createApiAsyncThunk({
  name: 'fetchUserQuotes',
  method: 'GET',
  url: (userId) => `/api/admin/quotes/${userId}`,
  typePrefix: 'admin',
});

export const fetchAdminStats = createApiAsyncThunk({
  name: 'fetchAdminStats',
  method: 'GET',
  url: '/api/admin/stats',
  typePrefix: 'admin',
});

export const fetchDailyQuoteAnalytics = createApiAsyncThunk({
  name: 'fetchDailyQuoteAnalytics',
  method: 'GET',
  url: '/api/admin/analytics/daily-quotes',
  typePrefix: 'admin',
});

// === Manual Quote Admin Thunks ===
export const fetchPendingManualQuotes = createApiAsyncThunk({
  name: 'fetchPendingManualQuotes',
  method: 'GET',
  url: '/api/admin/manual-quotes/pending',
  typePrefix: 'admin',
});

export const reviewManualQuote = createApiAsyncThunk({
  name: 'reviewManualQuote',
  method: 'PUT',
  url: (id) => `/api/admin/manual-quotes/review/${id}`,
  typePrefix: 'admin',
});

// === Initial State ===
const initialState = {
  users: [],
  paginatedUsers: [],
  userQuotes: [],
  quotes: [],
  manualQuotes: [],
  stats: null,
  analytics: [],
  loading: false,
  error: null,
};


// === Utility Handlers ===
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || "Something went wrong";
};


// === Slice ===
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === All Users ===
      .addCase(fetchAllUsers.pending, handlePending)
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data?.users || [];
      })
      .addCase(fetchAllUsers.rejected, handleRejected)

      // === Paginated Users ===
      .addCase(fetchPaginatedUsers.pending, handlePending)
      .addCase(fetchPaginatedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.paginatedUsers = action.payload.data?.users || [];
      })
      .addCase(fetchPaginatedUsers.rejected, handleRejected)

      // === Search Users ===
      .addCase(searchUsers.pending, handlePending)
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data?.users || [];
      })
      .addCase(searchUsers.rejected, handleRejected)

      // === Update User ===
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload.data?.user;
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
      })
      .addCase(updateUser.rejected, handleRejected)

      // === Delete User ===
      .addCase(deleteUser.pending, handlePending)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.meta.arg;
        state.users = state.users.filter((u) => u._id !== id);
      })
      .addCase(deleteUser.rejected, handleRejected)

      // === User Quotes ===
      .addCase(fetchUserQuotes.pending, handlePending)
      .addCase(fetchUserQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.userQuotes = action.payload.data?.quotes || [];
      })
      .addCase(fetchUserQuotes.rejected, handleRejected)

      // === Admin Stats ===
      .addCase(fetchAdminStats.pending, handlePending)
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data?.stats || null;
      })
      .addCase(fetchAdminStats.rejected, handleRejected)

      // === Daily Analytics ===
      .addCase(fetchDailyQuoteAnalytics.pending, handlePending)
      .addCase(fetchDailyQuoteAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data?.analytics || [];
      })
      .addCase(fetchDailyQuoteAnalytics.rejected, handleRejected)

      // === Pending Manual Quotes ===
      .addCase(fetchPendingManualQuotes.pending, handlePending)
      .addCase(fetchPendingManualQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.manualQuotes = action.payload.data?.quotes || [];
      })
      .addCase(fetchPendingManualQuotes.rejected, handleRejected)

      // === Review Manual Quote ===
      .addCase(reviewManualQuote.pending, handlePending)
      .addCase(reviewManualQuote.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data?.manualQuote;
        if (updated) {
          state.manualQuotes = state.manualQuotes.map((quote) =>
            quote._id === updated._id ? updated : quote
          );
        }
      })
      .addCase(reviewManualQuote.rejected, handleRejected);
  },
});

export default adminSlice.reducer;
