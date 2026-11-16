import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// In development the Flask API runs on :5000; /api is proxied so the browser talks to one origin.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { "/api": { target: process.env.SAFEROUTE_API ?? "http://127.0.0.1:5000", changeOrigin: true } },
  },
});
