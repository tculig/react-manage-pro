import { createSlice } from "@reduxjs/toolkit";

export const fontEditorSlice = createSlice({
  name: "fontEditor",
  initialState: {},
  reducers: {
    storeState: (state, action) => {
      state = action.payload;
    },
  },
});

export const { storeState } = fontEditorSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const getState = (state) => state.fontEditor;

export default fontEditorSlice.reducer;
