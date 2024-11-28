import { createSlice } from "@reduxjs/toolkit";

const statisticsSlice = createSlice({
  name: "statisticsSlice",
  initialState: {
    statisticCreatedId: null,
  },

  reducers: {
    setStatisticCreatedId(state, action) {
      state.statisticCreatedId = action.payload;
    },
  },

});

export const {
    setStatisticCreatedId,
} = statisticsSlice.actions;

export default statisticsSlice.reducer;
