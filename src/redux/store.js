import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import quoteReducer from './slices/quoteSlice';
import adminReducer from './slices/adminSlice';
const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  quote: quoteReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;
