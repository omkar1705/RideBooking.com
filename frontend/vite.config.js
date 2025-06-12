// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  define: {
    // Add this to suppress the warning
    "process.env.ROUTER_FUTURE_FLAGS": JSON.stringify({
      v7_relativeSplatPath: true,
    }),
  },
});
