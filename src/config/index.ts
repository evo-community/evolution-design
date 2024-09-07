/* eslint-disable no-empty-pattern */
/* eslint-disable unused-imports/no-unused-vars */
/*
 * Архитектура - это абстракции и правила их взаимодействия
 *
 *
 * Предлагаю иерархичную структуру абстракций и правил взаимодействия
 *
 *
 * Должна быть возможность описывать вот такую иерархию абстракций
 * apps
 *   fsdApp
 *     features
 *       feature
 *         domain
 *         model
 *         ui
 *         index.ts
 *     entities
 *       entity
 *         *
 *         index.ts
 *
 *     shared
 *      *
 * pakcages
 *   package
 *     index.ts
 *     *
 *
 *
 * Правила
 * apps может импортировать packages но не наоборот
 * apps не могут импортировать друг друга
 * fsdApp - работают базовые правила fsd
 * ...
 *
 *
 * Каждая абстракция может описать правила взаимодействия своих дочерних абстракций
 * */

class Rule {}

function indexPublicApi(): Rule {
  return {}
}
function publicAbstraction(name: string): Rule {
  return {}
}
function restrictCrossImports(): Rule {
  return {}
}
function importsOrder(order: string[]): Rule {
  return {}
}

class Abstraction {}
function abstraction({}: {
  name: string
  children?: Record<string, Abstraction>
  rules?: Rule[]
  fractal?: string
}): Abstraction {
  return {}
}

export function defineConfig(path: string, abstraction: Abstraction) {}

// Абстракция которая не имеет никаких правил, и просто будет использоваться для разметки
// Все дочерние файлы и папки будут считаться частью этой абстракции

function shared() {
  return abstraction({
    name: 'shared',
  })
}

// Абстракция которая разрешает импортировать себя только через index.ts
// Все дочерние файлы и папки будут считаться частью этой абстракции

function entity() {
  return abstraction({
    name: 'entity',
    rules: [indexPublicApi()],
  })
}

// Абстракция которая содержит другие абстракции
// По умолчанию все дочерние файлы и папки становятся частью абстракции
// Но мы можем пометить файлы и папки как дочерние абстракции.
// Дальше папка или файл рассматриваются как дочерняя абстракция, со своими правилами
function entities() {
  return abstraction({
    name: 'entities',
    children: {
      '*': entity(),
    },
    rules: [restrictCrossImports()],
  })
}

// Абстрактная абстркция) абстракция, которая позволяет по верх себя строить другие абстракции
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
      // Помечаем папки и файлы внутри этой бстракциией
      '*': child,
    },
    // Запрещаем импортировать элементам друг друга
    rules: [...rules],
  })
}

function fsdLayer({
  name,
  child,
  rules = [],
}: {
  name: string
  child: Abstraction
  rules?: Rule[]
}) {
  return layer({
    name,
    child,
    // Запрещаем импортировать элементам друг друга
    rules: [restrictCrossImports(), ...rules],
  })
}

// Абстракция может разметить дочерние модули, и управлять их взаимодействием
// Абстракция которая разрешает импортировать себя только через index.ts
function feature() {
  return abstraction({
    name: 'feature',
    children: {
      '*': abstraction({
        name: 'other',
        children: {},
      }),
      // Важно -- приоритет разметки у нижних правил
      './domain': abstraction({
        name: 'domain',
        children: {},
      }),
      './model': abstraction({
        name: 'model',
        children: {},
      }),
      './ui': abstraction({
        name: 'ui',
        children: {},
      }),
      './index.ts': abstraction({
        name: 'index',
      }),
    },
    rules: [
      importsOrder(['domain', 'other', 'model', 'ui', 'index']),
      publicAbstraction('index'),
    ],
  })
}

// Пример реализации слоёв FSD
function fsdApp() {
  return abstraction({
    name: 'fsdApp',
    children: {
      './src/features': fsdLayer({
        name: 'features',
        child: feature(),
      }),
      './src/entities': fsdLayer({
        name: 'entities',
        child: entity(),
      }),
      './src/shared': shared(),
    },
    rules: [importsOrder(['shared', 'entities', 'features'])],
  })
}

function packageAbstraction() {
  return abstraction({
    name: 'package',
    children: {},
    rules: [indexPublicApi()],
  })
}

defineConfig(
  '.',
  abstraction({
    name: 'app',
    children: {
      './apps': abstraction({
        name: 'apps',
        children: {
          web1: fsdApp(),
          web2: fsdApp(),
          web3: abstraction({
            name: 'another',
          }),
        },
        rules: [restrictCrossImports()],
      }),
      './packages': layer({
        name: 'packages',
        child: {
          '*': packageAbstraction(),
        },
      }),
    },
    rules: [importsOrder(['apps', 'packages'])],
  }),
)

// ВОПРОСЫ:
//
//  1. Надо продумать проблему саб гридов. Когда есть правила взаимодействия между дочерними модулями
//  (Возможно решается через точку importsOrder(['*.domain', '*.other', '*.model', '*.ui', '*.index'])
//
//
//
/*
      "./apps": abstraction({
        name: "apps",
        children: {
          web1: fsdApp(),
          web2: fsdApp(),
          web3: abstraction({
            name: "another",
          }),
        },
        rules: [importsOrder(["fsdApp.features", "fsdApp.entities", "fsdApp.shared"])],
      })
*/
//
//  2. Группы FSD
const features = abstraction({
  name: 'features',
  children: {
    '*': feature,
    '*.group': abstraction({
      name: 'group',
      children: {
        '*': feature(),
      },
      rules: [restrictCrossImports()],
    }),
  },
  rules: [restrictCrossImports()],
})

// 3. Описание фрактальных структур????????
const features3 = abstraction({
  name: 'features',
  children: {
    '*': feature,
    '*.group': abstraction({
      name: 'group',
      fractal: 'features',
      rules: [restrictCrossImports()],
    }),
  },
  rules: [restrictCrossImports()],
})
