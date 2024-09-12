import {
  abstraction,
  defineConfig,
} from 'evolution-design'
import {
  importsDirection,
  noUnabstractionFiles,
  publicAbstraction,
} from 'evolution-design/rules'
import type {
  Abstraction,
  Rule,
} from 'evolution-design'

function layer({
  name,
  child,
  rules = [],
}: {
  name: string
  child: Abstraction
  rules?: Rule[]
}) {
  return abstraction({
    name,
    children: {
      '*': child,
    },
    rules: [...rules],
  })
}

function feature() {
  return abstraction({
    name: 'feature',
    children: {
      '*': abstraction({
        name: 'other',
        children: {},
      }),
      './model': abstraction({
        name: 'model',
        children: {},
      }),
      './vm': abstraction({
        name: 'model',
        children: {},
      }),
      './ui': abstraction({
        name: 'ui',
        children: {},
      }),
      './index.ts': abstraction({
        name: 'entry',
      }),
    },
    rules: [
      importsDirection(['entry', 'ui', 'vm', 'model', 'other']),
      publicAbstraction('entry'),
      noUnabstractionFiles(),
    ],
  })
}

const app = abstraction('app')

const features = layer({
  name: 'features',
  child: feature(),
})

const shared = abstraction('shared')

// Пример реализации слоёв FSD
function root() {
  return abstraction({ name: 'fsdApp', children: {
    app,
    features,
    shared,
  }, rules: [
    importsDirection(['app', 'features', 'shared']),
    noUnabstractionFiles(),
  ] })
}

export default defineConfig({
  root: root(),
  baseUrl: './src',
})
