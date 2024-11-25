import { createSlice } from "@reduxjs/toolkit";

const policySlice = createSlice({
  name: "policySlice",
  initialState: {
    policyCreatedId: null,
  },

  reducers: {
    setPolicyCreatedId(state, action) {
      state.policyCreatedId = action.payload;
    },
  },

});

export const {
    setPolicyCreatedId,
} = policySlice.actions;

export default policySlice.reducer;
