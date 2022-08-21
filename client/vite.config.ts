import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import {resolve} from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api/v1": "http://localhost:8080",
    },
  },

  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },
});
