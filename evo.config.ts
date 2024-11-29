import { basename, dirname } from 'node:path'
import { camelCase, capitalize } from 'lodash'
import { abstraction, defineConfig } from './src'
import {
  dependenciesDirection,
  noUnabstractionFiles,
  publicAbstraction,
  requiredChildren,
  restrictCrossImports,
} from './src/rules'

const pageTemplate = `
export function Page() {
  return <div>Page</div>
}
`

const pageIndexTemplate = function (path: string) {
  return `export { Page as ${capitalize(
    camelCase(basename(dirname(path)))
  )}Page} from './page'`
}

const createAbstraction = function (name: string, template: string) {
  return abstraction(name, {
    children: {
      'index.ts': abstraction('public-api', {
        fileTemplate: template,
      }),
    },
    rules: [publicAbstraction('public-api'), requiredChildren()],
  })
}

const commonIndexTemplate = function () {
  return `export {} from ''`
}

const page = abstraction('page', {
  children: {
    'index.ts': abstraction('public-api', {
      fileTemplate: pageIndexTemplate,
    }),
    'page.tsx': abstraction('page', {
      fileTemplate: pageTemplate,
    }),
  },
  rules: [publicAbstraction('public-api'), requiredChildren()],
})

const appLayer = createAbstraction('app-layer', commonIndexTemplate())
const widget = createAbstraction('widget', commonIndexTemplate())
const feature = createAbstraction('feature', commonIndexTemplate())
const entity = createAbstraction('entity', commonIndexTemplate())

const app = abstraction('app', {
  children: {
    '*': appLayer,
  },
})

const pages = abstraction('pages', {
  children: { '*': page },
  rules: [restrictCrossImports()],
})

const widgets = abstraction('widgets', {
  children: { '*': widget },
  rules: [restrictCrossImports()],
})

const features = abstraction('features', {
  children: { '*': feature },
  rules: [restrictCrossImports()],
})

const entities = abstraction('entities', {
  children: { '*': entity },
  rules: [restrictCrossImports()],
})

const shared = abstraction('shared')

const root = abstraction('root', {
  children: {
    app,
    pages,
    widgets,
    features,
    entities,
    shared,
  },
  rules: [
    dependenciesDirection([
      'app',
      'pages',
      'widgets',
      'features',
      'entities',
      'shared',
    ]),
    noUnabstractionFiles(),
    requiredChildren(),
  ],
})

export default defineConfig({
  root,
  baseUrl: './test',
})
