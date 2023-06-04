import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  treeshake: true,
  splitting: true,
  outDir: "dist",
  format: "esm",
  esbuildOptions(options, context) {
    options.banner = {
      js: '"use client";',
    };
  },
});
