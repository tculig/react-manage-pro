import { configureStore } from "@reduxjs/toolkit";
import templatesSlice from "./templatesSlice";

export default configureStore({
  reducer: {
    templates: templatesSlice,
  },
});
