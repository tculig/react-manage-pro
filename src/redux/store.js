import { configureStore } from "@reduxjs/toolkit";
import layoutsSlice from "./layoutSlice";

export default configureStore({
  reducer: {
    layouts: layoutsSlice
  },
});
