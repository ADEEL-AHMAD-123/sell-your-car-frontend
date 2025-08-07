import { createSlice } from '@reduxjs/toolkit';
import { createApiAsyncThunk } from "../../utils/apiHelper";

// === User-related Thunks ===
export const fetchAllUsers = createApiAsyncThunk({
  name: 'fetchAllUsers',
  method: 'GET',
  url: '/api/admin/users',
  typePrefix: 'admin',
});

export const updateUser = createApiAsyncThunk({
  name: 'updateUser',
  method: 'PUT',
  url: ({ id }) => `/api/admin/users/${id}`,
  typePrefix: 'admin',
});

export const deleteUser = createApiAsyncThunk({
  name: 'deleteUser',
  method: 'DELETE',
  url: ({ id }) => `/api/admin/users/${id}`,
  typePrefix: 'admin',
});

export const refillUserChecks = createApiAsyncThunk({
  name: 'refillUserChecks',
  method: 'PATCH',
  url: ({ id }) => `/api/admin/users/${id}/refill-checks`,
  typePrefix: 'admin',
});

// === Quote-related Thunks ===
export const fetchAnalyticsOverview = createApiAsyncThunk({
  name: 'fetchAnalyticsOverview',
  method: 'GET',
  url: '/api/admin/analytics/overview',
  typePrefix: 'admin',
});

export const fetchAdminSearchedQuotes = createApiAsyncThunk({
  name: 'fetchAdminSearchedQuotes',
  method: 'GET',
  url: '/api/admin/quotes/search',
  typePrefix: 'admin',
});

// === NEW: Settings Thunks ===
export const fetchSettings = createApiAsyncThunk({
  name: 'fetchSettings',
  method: 'GET',
  url: '/api/admin/settings',
  typePrefix: 'admin',
});

export const updateSettings = createApiAsyncThunk({
  name: 'updateSettings',
  method: 'PUT',
  url: '/api/admin/settings',
  typePrefix: 'admin',
});


// === Initial State ===
const initialState = {
  users: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10,
  },
  quotes: [],
  analyticsOverview: null,
  loading: false, 
  error: null,    

  // === STATE FOR SEARCHED QUOTES ===
  searchedQuotes: null,
  searchedQuotesLoading: false,
  searchedQuotesError: null,

  // === STATE FOR ADMIN SETTINGS ===
  settings: null,
  settingsLoading: false,
  settingsError: null,
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
  reducers: {
    clearAdminSearchedQuotes: (state) => {
      state.searchedQuotes = null;
      state.searchedQuotesError = null;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // === All Users ===
      .addCase(fetchAllUsers.pending, handlePending)
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data?.users || [];
        state.pagination.currentPage = action.payload.data?.currentPage || 1;
        state.pagination.totalPages = action.payload.data?.totalPages || 1;
        state.pagination.totalUsers = action.payload.data?.totalUsers || 0;
        state.pagination.limit = action.payload.data?.limit || 10;
      })
      .addCase(fetchAllUsers.rejected, handleRejected)

      // === Update User (Role, First Name, Last Name) ===
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

      // === Refill User Checks ===
      .addCase(refillUserChecks.pending, handlePending)
      .addCase(refillUserChecks.fulfilled, (state, action) => {
        state.loading = false;
        const refilledUser = action.payload.data?.user;
        state.users = state.users.map((u) =>
          u._id === refilledUser._id ? refilledUser : u
        );
      })
      .addCase(refillUserChecks.rejected, handleRejected)

      // === Fetch Analytics Overview ===
      .addCase(fetchAnalyticsOverview.pending, handlePending)
      .addCase(fetchAnalyticsOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsOverview = action.payload.data || null;
      })
      .addCase(fetchAnalyticsOverview.rejected, handleRejected)

      // === fetchAdminSearchedQuotes ===
      .addCase(fetchAdminSearchedQuotes.pending, (state) => {
        state.searchedQuotesLoading = true;
        state.searchedQuotesError = null;
        state.searchedQuotes = null;
      })
      .addCase(fetchAdminSearchedQuotes.fulfilled, (state, action) => {
        state.searchedQuotesLoading = false;
        state.searchedQuotes = action.payload.data?.quotes || [];
      })
      .addCase(fetchAdminSearchedQuotes.rejected, (state, action) => {
        state.searchedQuotesLoading = false;
        state.searchedQuotesError = action.payload?.message || "Failed to fetch quotes.";
        state.searchedQuotes = null;
      })

      // === NEW: fetchSettings ===
      .addCase(fetchSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload.data;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload?.message || "Failed to fetch settings.";
      })

      // === NEW: updateSettings ===
      .addCase(updateSettings.pending, (state) => {
        state.settingsLoading = true;
        state.settingsError = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.settingsLoading = false;
        state.settings = action.payload.data; 
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.settingsLoading = false;
        state.settingsError = action.payload?.message || "Failed to update settings.";
      });
  },
});

export const { clearAdminSearchedQuotes, setSettings } = adminSlice.actions;

export default adminSlice.reducer;
