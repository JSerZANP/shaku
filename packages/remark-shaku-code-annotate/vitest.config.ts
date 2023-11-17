import { defineConfig } from "vitest/config";
/// <reference types="vitest" />
export default defineConfig({
  test: {
    testTimeout: 1000 * 60 * 5,
  },
});
