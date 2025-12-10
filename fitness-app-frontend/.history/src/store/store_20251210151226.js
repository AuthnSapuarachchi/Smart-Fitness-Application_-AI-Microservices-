import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

export de store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
