import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  noExternal: ["@evod/kit"],

  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    "c12",
    "chokidar",
    "globby",
    "immer",
    "is-glob",
    "minimatch",
    "precinct",
    "rxjs",
    "tsconfck",
    "typescript",
    "zod",
    "zod-validation-error",
  ],
});
