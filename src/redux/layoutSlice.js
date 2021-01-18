import { createSlice } from "@reduxjs/toolkit";

function modifyLayout(layout, gridletId, value) {
  for (let i = 0; i < layout.length; i++) {
    if (layout[i].gridletId === gridletId) {
      layout[i] = {
        ...layout[i],
        ...value
      };
      layout[i].modified = true;
    }
  }
  return layout;
}

export const layoutSlice = createSlice({
  name: "layouts",
  initialState: {
    layout: [],
    layoutId: null
  },
  reducers: {
    storeLayoutRedux: (state, action) => {
      state.layout = action.payload;
    },
    storeLayoutId: (state, action) => {
      state.layoutId = action.payload;
    },
    changeAttributeRedux: (state, action) => {
      let { layout } = state;
      layout = modifyLayout(layout, action.payload.gridletId, action.payload.value);
      state.layout = layout;
    },
    commitLayoutToDBRedux: () => {
      console.log("save");
      // const newConfig = entityDataConfiguration.filter(el => el.checked).map(el => el.id);
    },
    resetRedux: (state) => {
      state.layout = [];
      state.layoutId = null;
    }
  },
});

export const { storeLayoutRedux, changeAttributeRedux, commitLayoutToDBRedux, storeLayoutId, resetRedux } = layoutSlice.actions;

export const selectLayoutRedux = (state) => state.layouts.layout;

export const selectLayoutId = (state) => state.layouts.layoutId;

export default layoutSlice.reducer;
