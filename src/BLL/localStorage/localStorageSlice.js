import { createSlice } from '@reduxjs/toolkit';

const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: {
    oldSelectedOrganizationId: localStorage.getItem('selectedOrganizationId') || null,
    newSelectedOrganizationId: localStorage.getItem('selectedOrganizationId') || null,
  },
  reducers: {
    setOldSelectedOrganizationId: (state, action) => {
      state.oldSelectedOrganizationId = action.payload;
    },
    setNewSelectedOrganizationId: (state, action) => {
      state.newSelectedOrganizationId = action.payload;
    },
  },
});

export const { setOldSelectedOrganizationId, setNewSelectedOrganizationId } = localStorageSlice.actions;
export default localStorageSlice.reducer;
