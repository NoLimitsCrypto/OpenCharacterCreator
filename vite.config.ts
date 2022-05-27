import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  mode: "development",
  resolve: {
    alias: {
      _: path.resolve(__dirname, "src"),
    },
  },
  plugins: [reactRefresh()],
  clearScreen: false,
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    https:true,
    hmr: {
      host: "avatars.darknexus.city",
      protocol: "ws",
      clientPort: 443,
      
    },
  },
});
