import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    minify: "terser",
    outDir: "../backend/src/public",
  },
});
