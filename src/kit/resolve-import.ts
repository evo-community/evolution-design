import { sep } from 'node:path'
import ts from 'typescript'
import type { CompilerOptions } from 'typescript'

/**
 * Given a file name, an imported path, and a TSConfig object, produce a path to the imported file, relative to TypeScript's `baseUrl`.
 *
 * The resulting path uses OS-appropriate path separators.
 *
 * @example
 * ```tsx
 * // ./src/pages/home/ui/HomePage.tsx
 * import { Button } from "~/shared/ui";
 * ```
 *
 * ```json
 * // ./tsconfig.json
 * {
 *   "compilerOptions": {
 *     "moduleResolution": "Bundler",
 *     "baseUrl": ".",
 *     "paths": {
 *       "~/*": ["./src/*"],
 *     },
 *   },
 * }
 * ```
 *
 * ```tsx
 * resolveImport(
 *   "~/shared/ui",
 *   "./src/pages/home/ui/HomePage.tsx",
 *   { moduleResolution: "Bundler", baseUrl: ".", paths: { "~/*": ["./src/*"] } },
 *   fs.existsSync
 * );
 * ```
 * Expected output: `src/shared/ui/index.ts`
 */
export function resolveImport(
  importedPath: string,
  importerPath: string,
  tsCompilerOptions: ImperfectCompilerOptions,
  fileExists: (path: string) => boolean,
  directoryExists?: (path: string) => boolean,
): string | null {
  return (
    ts
      .resolveModuleName(
        importedPath,
        importerPath,
        normalizeCompilerOptions(tsCompilerOptions),
        {
          ...ts.sys,
          fileExists,
          directoryExists,
        },
      )
      .resolvedModule
      ?.resolvedFileName
      ?.replaceAll('/', sep) ?? null
  )
}

const imperfectKeys = {
  module: ts.ModuleKind,
  moduleResolution: {
    ...ts.ModuleResolutionKind,
    node: ts.ModuleResolutionKind.Node10,
  },
  moduleDetection: ts.ModuleDetectionKind,
  newLine: ts.NewLineKind,
  target: ts.ScriptTarget,
}

/** TypeScript has a few fields which have values from an internal enum, and refuses to take the literal values from the tsconfig.json. */
function normalizeCompilerOptions(
  compilerOptions: ImperfectCompilerOptions,
): CompilerOptions {
  return Object.fromEntries(
    Object.entries(compilerOptions).map(([key, value]) => {
      if (
        Object.keys(imperfectKeys).includes(key)
        && typeof value === 'string'
      ) {
        for (const [enumKey, enumValue] of Object.entries(
          imperfectKeys[key as keyof typeof imperfectKeys],
        )) {
          if (enumKey.toLowerCase() === value.toLowerCase()) {
            return [key, enumValue]
          }
        }
      }
      return [key, value]
    }),
  ) as CompilerOptions
}

export interface ImperfectCompilerOptions
  extends Omit<CompilerOptions, keyof typeof imperfectKeys> {
  module?: ts.ModuleKind | keyof typeof ts.ModuleKind
  moduleResolution?:
    | ts.ModuleResolutionKind
    | keyof typeof ts.ModuleResolutionKind
    | 'node'
  moduleDetection?:
    | ts.ModuleDetectionKind
    | keyof typeof ts.ModuleDetectionKind
  newLine?: ts.NewLineKind | keyof typeof ts.NewLineKind
  target?: ts.ScriptTarget | keyof typeof ts.ScriptTarget
}
