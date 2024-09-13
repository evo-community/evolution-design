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
    { input: 'src/cli/index.ts' },
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
