import { createSlice } from "@reduxjs/toolkit";
import { commitLayoutToDB } from "./dbcalls";

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
    layoutId: null,
    layoutTable: null
  },
  reducers: {
    storeLayoutRedux: (state, action) => {
      state.layout = action.payload;
    },
    storeLayoutData: (state, action) => {
      state.layoutId = action.payload.id;
      state.layoutTable = action.payload.table;
    },
    changeAttributeRedux: (state, action) => {
      let { layout } = state;
      layout = modifyLayout(layout, action.payload.gridletId, action.payload.value);
      state.layout = layout;
    },
    commitLayoutToDBRedux: (state) => {
      console.log("save");
      commitLayoutToDB(state.layoutTable, state.layout);
    },
    resetRedux: (state) => {
      state.layout = [];
      state.layoutId = null;
      state.layoutTable = null;
    }
  },
});

export const { storeLayoutRedux, changeAttributeRedux, commitLayoutToDBRedux, storeLayoutData, resetRedux } = layoutSlice.actions;

export const selectLayoutRedux = (state) => state.layouts.layout;

export const selectLayoutId = (state) => state.layouts.layoutId;

export default layoutSlice.reducer;
