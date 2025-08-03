import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './slices/apiSlice';
import authSlice from './slices/authSlice';
import deviceSlice from './slices/deviceSlice';
import sessionSlice from './slices/sessionSlice';

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    auth: authSlice,
    device: deviceSlice,
    session: sessionSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;