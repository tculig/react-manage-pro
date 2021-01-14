import { createSlice } from "@reduxjs/toolkit";

function modifyLayout(layout, gridletId, value) {
  for (let i = 0; i < layout.length; i++) {
    console.log(layout[i].gridletId);
    console.log(gridletId);
    if (layout[i].gridletId === gridletId) {
      console.log("MAGA");
      layout[i] = {
        ...layout[i],
        ...value
      };
      layout[i].modified = true;
    }
  }
  return layout;
}

export const templatesSlice = createSlice({
  name: "templates",
  initialState: {
    layout: [],
  },
  reducers: {
    storeLayoutRedux: (state, action) => {
      state.layout = action.payload;
    },
    changeAttributeRedux: (state, action) => {
      let { layout } = state;
      layout = modifyLayout(layout, action.payload.gridletId, action.payload.value);
      state.layout = layout;
    },
    commitLayoutToDBRedux: () => {
      console.log("save");
      // const newConfig = entityDataConfiguration.filter(el => el.checked).map(el => el.id);
    }
  },
});

export const { storeLayoutRedux, changeAttributeRedux, commitLayoutToDBRedux } = templatesSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state) => state.counter.value)`
export const selectLayoutRedux = (state) => state.templates.layout;

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched
export const incrementAsync = (layout) => (dispatch) => {
  setTimeout(() => {
    dispatch(selectLayoutRedux(layout));
  }, 1000);
};

export default templatesSlice.reducer;
