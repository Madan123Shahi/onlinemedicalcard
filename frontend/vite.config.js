import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      // ⚡ Vite 8 Native ESM replacement for __dirname
      "@": path.resolve(import.meta.dirname, "./src"),
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
});
