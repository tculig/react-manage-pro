import { configureStore } from "@reduxjs/toolkit";
import templatesSlice from "./templatesSlice";
import fontEditorSlice from "./fontEditorSlice";

export default configureStore({
  reducer: {
    templates: templatesSlice,
    fontEditor: fontEditorSlice
  },
});
