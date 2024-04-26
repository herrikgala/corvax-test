import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import mixPackage from "vite-plugin-mix";
const mix = mixPackage.default;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mix({
      handler: "./handler.ts",
    }),
  ],
});
