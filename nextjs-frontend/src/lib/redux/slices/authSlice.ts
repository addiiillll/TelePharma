import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  doctor: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  token: null,
  doctor: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token?: string; doctor: any }>) => {
      if (action.payload.token) {
        state.token = action.payload.token;
      }
      state.doctor = action.payload.doctor;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.doctor = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;