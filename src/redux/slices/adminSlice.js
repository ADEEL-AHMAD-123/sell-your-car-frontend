import { createSlice } from '@reduxjs/toolkit';
import { createApiAsyncThunk } from '../../utils/apiHelper';

// ==== API Thunks ====

// 1. Get All Users
export const fetchAllUsers = createApiAsyncThunk({
  name: 'getAllUsers',
  method: 'GET',
  url: '/api/admin/users',
  typePrefix: 'admin',
});

// 2. Search Users
export const searchUsers = createApiAsyncThunk({
  name: 'searchUsers',
  method: 'GET',
  url: (query) => `/api/admin/users/search?query=${query}`,
  typePrefix: 'admin',
});

// 3. Paginated Users
export const fetchPaginatedUsers = createApiAsyncThunk({
  name: 'fetchPaginatedUsers',
  method: 'GET',
  url: ({ page = 1, limit = 10 }) =>
    `/api/admin/users/paginated?page=${page}&limit=${limit}`,
  typePrefix: 'admin',
});

// 4. Get Quote History for a User
export const fetchUserQuotes = createApiAsyncThunk({
  name: 'fetchUserQuotes',
  method: 'GET',
  url: (userId) => `/api/admin/quotes/${userId}`,
  typePrefix: 'admin',
});

// 5. Update User
export const updateUser = createApiAsyncThunk({
  name: 'updateUser',
  method: 'PUT',
  url: (id) => `/api/admin/user/${id}`,
  typePrefix: 'admin',
});

// 6. Delete User
export const deleteUser = createApiAsyncThunk({
  name: 'deleteUser',
  method: 'DELETE',
  url: (id) => `/api/admin/user/${id}`,
  typePrefix: 'admin',
});

// 7. Get Admin Stats
export const fetchAdminStats = createApiAsyncThunk({
  name: 'fetchAdminStats',
  method: 'GET',
  url: '/api/admin/stats',
  typePrefix: 'admin',
});

// 8. Get Daily Quote Analytics
export const fetchDailyQuoteAnalytics = createApiAsyncThunk({
  name: 'fetchDailyQuoteAnalytics',
  method: 'GET',
  url: '/api/admin/analytics/daily-quotes',
  typePrefix: 'admin',
});

// ==== Initial State ====
const initialState = {
  users: [],
  paginatedUsers: [],
  userQuotes: [],
  quotes: [],
  stats: null,
  analytics: [],
  loading: false,
  error: null,
};

// ==== Admin Slice ====
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Utility helper
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Something went wrong';
    };

    // Get All Users
    builder
      .addCase(fetchAllUsers.pending, handlePending)
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data?.users || [];
      })
      .addCase(fetchAllUsers.rejected, handleRejected);

    // Search Users
    builder
      .addCase(searchUsers.pending, handlePending)
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data?.users || [];
      })
      .addCase(searchUsers.rejected, handleRejected);

    // Paginated Users
    builder
      .addCase(fetchPaginatedUsers.pending, handlePending)
      .addCase(fetchPaginatedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.paginatedUsers = action.payload.data || [];
      })
      .addCase(fetchPaginatedUsers.rejected, handleRejected);

    // User Quotes
    builder
      .addCase(fetchUserQuotes.pending, handlePending)
      .addCase(fetchUserQuotes.fulfilled, (state, action) => {
        state.loading = false;
        state.userQuotes = action.payload.data?.quotes || [];
      })
      .addCase(fetchUserQuotes.rejected, handleRejected);

    // Update User
    builder
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data?.user;
        state.users = state.users.map((u) =>
          u._id === updated.id ? { ...u, ...updated } : u
        );
      })
      .addCase(updateUser.rejected, handleRejected);

    // Delete User
    builder
      .addCase(deleteUser.pending, handlePending)
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.meta.arg;
        state.users = state.users.filter((u) => u._id !== deletedId);
      })
      .addCase(deleteUser.rejected, handleRejected);

    // Admin Stats
    builder
      .addCase(fetchAdminStats.pending, handlePending)
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchAdminStats.rejected, handleRejected);

    // Daily Analytics
    builder
      .addCase(fetchDailyQuoteAnalytics.pending, handlePending)
      .addCase(fetchDailyQuoteAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data?.data || [];
      })
      .addCase(fetchDailyQuoteAnalytics.rejected, handleRejected);
  },
});

export default adminSlice.reducer;
