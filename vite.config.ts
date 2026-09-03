import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), libInjectCss()],
  css: {
    transformer: "lightningcss",
    lightningcss: {
      targets: {
        chrome: 88 << 16,
        edge: 88 << 16,
        firefox: 78 << 16,
        safari: 14 << 16,
        ios_saf: 14 << 16,
      },
    },
  },
  build: {
    target: "es2021",
    lib: {
      entry: resolve(import.meta.dirname, "src/components/index.ts"),
      name: "ProMobile",
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [/^react(\/.*)?$/, /^react-dom(\/.*)?$/, /^antd-mobile(\/.*)?$/, /^antd-mobile-icons(\/.*)?$/, /^dayjs(\/.*)?$/, /^rc-field-form(\/.*)?$/, /^@bigflower\/utils(\/.*)?$/],
    },
  },
});
