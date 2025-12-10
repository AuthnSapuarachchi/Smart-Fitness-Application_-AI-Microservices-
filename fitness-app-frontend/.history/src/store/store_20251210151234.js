import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export default const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
