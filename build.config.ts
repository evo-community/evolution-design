import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineBuildConfig } from 'unbuild'

const srcDir = fileURLToPath(new URL('src', import.meta.url))

export const subpaths = [
  'cli',
  'meta',
  'config',
  'types',
  'linter',
]

export default defineBuildConfig({
  declaration: true,
  name: 'evolution-design',
  failOnWarn: false,
  entries: [
    // CLI
    { input: 'src/cli/index.ts' },
    // // Config
    { input: 'src/config/index.ts' },
    // // Meta
    { input: 'src/meta/index.ts' },
    // // Types
    { input: 'src/types/index.ts' },
  ],
  alias: {
    'evolution-design': 'evolution-design',
    'evolution-design/meta': resolve(srcDir, '../meta.ts'),
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
