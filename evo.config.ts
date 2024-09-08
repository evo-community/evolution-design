import {
  abstraction,
  defineConfig,
  importsDirection,
  publicAbstraction,
} from 'evolution-design/config'
import type {
  Abstraction,
  Rule,
} from 'evolution-design/types'

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
    ],
  })
}

function app() {
  return abstraction({
    name: 'app',
  })
}

function features() {
  return layer({
    name: 'features',
    child: feature(),
  })
}

function shared() {
  return abstraction({
    name: 'shared',
  })
}

// Пример реализации слоёв FSD
function root() {
  return abstraction({ name: 'fsdApp', children: {
    './app': app(),
    './features': features(),
    './shared': shared(),
  }, rules: [importsDirection(['app', 'features', 'shared'])] })
}

export default defineConfig({
  root: root(),
  baseUrl: './src',
})