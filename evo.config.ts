import { resolve } from 'node:path'
import { abstraction, defineConfig, requiredChildren } from './src'

const children = abstraction({ name: 'index', fileTemplateUrl: resolve(__dirname, './src/kit/memoize.ts'), fractal: 'string' })
const component = abstraction(
  {
    name: 'component',
    rules: [requiredChildren()],
    children: {
      'index.ts': children,
    },
  },
)

export default defineConfig({
  root: abstraction({ name: 'root', children: { '*': component } }),
  baseUrl: './test',
})
