import { createSlice } from "@reduxjs/toolkit";

export const genericSlice = createSlice({
  name: "genericSlice",
  initialState: {},
  reducers: {
    storeState: (state, action) => {
      state = {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { storeState } = genericSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const getState = (state) => state.genericSlice;

export default genericSlice.reducer;
