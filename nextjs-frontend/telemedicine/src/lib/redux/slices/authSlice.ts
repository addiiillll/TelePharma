import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  doctor: any | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  doctor: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; doctor: any }>) => {
      state.token = action.payload.token;
      state.doctor = action.payload.doctor;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.doctor = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;