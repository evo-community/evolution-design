import { getNodesRecord, type Rule } from 'evolution-design/core'

// Rules
export function indexPublicApi(): Rule {
  return {
    name: 'index-public-api',
    severity: 'warn',
    check() {
      return {
        diagnostics: [],
      }
    },
  }
}

export function noUnabstractionFiles(): Rule {
  return {
    name: 'no-unabstraction-files',
    severity: 'warn',
    check({ instance, root }) {
      const record = getNodesRecord(root)
      const files = instance.childNodes.filter(node => record[node]?.type === 'file')
      if (files.length > 0) {
        return {
          diagnostics: files.map(node => ({
            message: ` 'Unabstraction files are not allowed in ${instance.abstraction.name}'`,
            location: { path: node },
          })),
        }
      }

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
    severity: 'warn',
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
    severity: 'warn',
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
    severity: 'warn',
    check() {
      return {
        diagnostics: [],
      }
    },
  }
}
