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

const app = abstraction('app')

const features = layer({
  name: 'features',
  child: feature(),
  rules: [restrictCrossImports(), noUnabstractionFiles()],
})

const shared = abstraction('shared')

// Пример реализации слоёв FSD
function root() {
  return abstraction({
    name: 'fsdApp',
    children: {
      app,
      features,
      shared,
    },
    rules: [
      dependenciesDirection(['app', 'features', 'shared']),
      noUnabstractionFiles(),
    ],
  })
}

export default defineConfig({
  root: root(),
  baseUrl: './src',
})
