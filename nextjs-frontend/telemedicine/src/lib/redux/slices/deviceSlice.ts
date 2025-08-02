import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DeviceState {
  devices: any[];
  selectedDevice: any | null;
}

const initialState: DeviceState = {
  devices: [],
  selectedDevice: null,
};

const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<any[]>) => {
      state.devices = action.payload;
    },
    selectDevice: (state, action: PayloadAction<any>) => {
      state.selectedDevice = action.payload;
    },
  },
});

export const { setDevices, selectDevice } = deviceSlice.actions;
export default deviceSlice.reducer;