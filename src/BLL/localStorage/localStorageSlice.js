import { createSlice } from '@reduxjs/toolkit';

const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: {
    newSelectedOrganizationId: localStorage.getItem('selectedOrganizationId') || null,
  },
  reducers: {
    setNewSelectedOrganizationId: (state, action) => {
      state.newSelectedOrganizationId = action.payload;
    },
  },
});

export const {setNewSelectedOrganizationId } = localStorageSlice.actions;
export default localStorageSlice.reducer;
