import type { Rule } from 'evolution-design/types'

// TODO: Move default rules to separate folder

// Rules
export function indexPublicApi(): Rule {
  return {
    name: 'index-public-api',
    check() {
      return {
        diagnostics: [],
      }
    },
  }
}
// eslint-disable-next-line unused-imports/no-unused-vars
export function publicAbstraction(name: string): Rule {
  return {
    name: 'public-abstraction',
    check() {
      return {
        diagnostics: [],
      }
    },
  }
}
export function restrictCrossImports(): Rule {
  return {
    name: 'restrict-cross-imports',
    check() {
      return {
        diagnostics: [],
      }
    },
  }
}
// eslint-disable-next-line unused-imports/no-unused-vars
export function importsDirection(order: string[]): Rule {
  return {
    name: 'imports-direction',
    check() {
      return {
        diagnostics: [],
      }
    },
  }
}
