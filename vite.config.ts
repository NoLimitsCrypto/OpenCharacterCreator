import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 443
  },
  resolve: {
  },
  plugins: [reactRefresh()],
  define: {
    "global": {},
  },
});
