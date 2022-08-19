import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': 'http://localhost:8080',
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          // "@primary-color": "#00ab94", // 全局主色
        },
      },
    },
  },
});
