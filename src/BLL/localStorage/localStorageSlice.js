import { createSlice } from '@reduxjs/toolkit';

const localStorageSlice = createSlice({
  name: 'localStorage',
  initialState: {
    oldId: localStorage.getItem('selectedOrganizationId') || null,
    newId: localStorage.getItem('selectedOrganizationId') || null,
  },
  reducers: {
    setOldId: (state, action) => {
      state.value = action.payload;
    },
    setNewId: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setOldId, setNewId } = localStorageSlice.actions;
export default localStorageSlice.reducer;
