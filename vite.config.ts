import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/components/index.ts"),
      name: "ProMobile",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [/^react(\/.*)?$/, /^react-dom(\/.*)?$/, /^antd-mobile(\/.*)?$/, /^antd-mobile-icons(\/.*)?$/, /^dayjs(\/.*)?$/, /^rc-field-form(\/.*)?$/],
    },
  },
  server: { host: "0.0.0.0", port: 80, allowedHosts: true },
});
