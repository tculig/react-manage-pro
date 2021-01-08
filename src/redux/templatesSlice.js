import { createSlice } from "@reduxjs/toolkit";

export const templatesSlice = createSlice({
  name: "templates",
  initialState: {
    layout: [],
  },
  reducers: {
    storeLayout: (state, action) => {
      state.layout = action.payload;
    },
  },
});

export const { storeLayout } = templatesSlice.actions;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = layout => dispatch => {
  setTimeout(() => {
    dispatch(storeLayout(layout));
  }, 1000);
};

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectLayout = state => state.templates.layout;

export default templatesSlice.reducer;
