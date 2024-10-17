import type { Abstraction, Rule } from 'evolution-design'
import {
  abstraction,
  defineConfig,
} from 'evolution-design'

import {
  dependenciesDirection,
  noUnabstractionFiles,
  publicAbstraction,
  requiredChildren,
  restrictCrossImports,
} from 'evolution-design/rules'

export default defineConfig({
  root: root(),
  baseUrl: './src',
})

// Пример реализации слоёв FSD
function root() {
  return abstraction({
    name: 'fsdApp',
    children: {
      app: app(),
      features: features(),
      shared: shared(),
    },
    rules: [
      dependenciesDirection(['app', 'features', 'shared']),
      noUnabstractionFiles(),
    ],
  })
}

function app() {
  return abstraction('app')
}

function features() {
  return layer({
    name: 'features',
    child: feature(),
    rules: [restrictCrossImports(), noUnabstractionFiles()],
  })
}

function shared() {
  return abstraction('shared')
}

function feature() {
  return abstraction({
    name: 'feature',
    children: {
      '*': abstraction('other'),
      'model': abstraction('model'),
      'vm': abstraction('vm'),
      'ui': abstraction('ui'),
      'index.ts': abstraction('entry'),
    },
    rules: [
      requiredChildren(),
      noUnabstractionFiles(),
      dependenciesDirection(['entry', 'ui', 'vm', 'model', 'other']),
      publicAbstraction('entry'),
    ],
  })
}

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
