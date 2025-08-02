import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  sessions: any[];
  activeSession: any | null;
  onlineDoctors: string[];
}

const initialState: SessionState = {
  sessions: [],
  activeSession: null,
  onlineDoctors: [],
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSessions: (state, action: PayloadAction<any[]>) => {
      state.sessions = action.payload;
    },
    setActiveSession: (state, action: PayloadAction<any>) => {
      state.activeSession = action.payload;
    },
    updateOnlineDoctors: (state, action: PayloadAction<string[]>) => {
      state.onlineDoctors = action.payload;
    },
  },
});

export const { setSessions, setActiveSession, updateOnlineDoctors } = sessionSlice.actions;
export default sessionSlice.reducer;