import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allows HMR to work properly in development
    middlewareMode: false,
    // Enable CORS headers
    cors: true,
  },
  // Ensure JSX Fast Refresh works correctly
  define: {
    "process.env.NODE_ENV": '"development"',
  },
});
