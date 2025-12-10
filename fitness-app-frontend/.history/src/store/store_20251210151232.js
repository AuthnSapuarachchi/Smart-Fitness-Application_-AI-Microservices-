import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export default cons store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
