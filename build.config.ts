import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

const srcDir = fileURLToPath(new URL('src', import.meta.url))

export const subpaths = [
  'core',
  'rules',
  'linter',
  'cli',
  'meta',
  'kit',
]

export default defineBuildConfig({
  declaration: true,
  name: 'evolution-design',
  entries: [
    { input: 'src/index.ts' },
    { input: 'src/core/index.ts' },
    { input: 'src/rules/index.ts' },
    { input: 'src/linter/index.ts' },
    { input: 'src/cli/index.ts' },
    { input: 'src/meta/index.ts' },
    { input: 'src/kit/index.ts' },
  ],
  alias: {
    'evolution-design': 'evolution-design',
    ...Object.fromEntries(
      subpaths.map(subpath => [
        `evolution-design/${subpath}`,
        resolve(srcDir, `${subpath}/index.ts`),
      ]),
    ),
  },
  externals: [
    'evolution-design',
    ...subpaths.map(subpath => `evolution-design/${subpath}`),
  ],
})
