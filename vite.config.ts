import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // host: '0.0.0.0',
    // https: true,
    hmr: {
      host: 'avatars.darknexus.city',
      port: 443,
      // protocol: 'wss',
    },
  },
  resolve: {
  },
  plugins: [reactRefresh()],
  define: {
    "global": {},
  },
});
