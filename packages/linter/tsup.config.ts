import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    cli: "src/cli/index.ts",
  },
  format: ["esm", "cjs"],
  noExternal: ["@evod/kit"],
  dts: true,
  clean: true,

  external: [
    "chalk",
    "citty",
    "figures",
    "prexit",
    "rxjs",
    "terminal-link",
    "zod",
    "zod-validation-error",
  ],
  esbuildOptions(options) {
    // Ensure Node.js built-ins are not bundled
    options.packages = "external";
  },
});
