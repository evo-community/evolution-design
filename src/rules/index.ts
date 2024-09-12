import * as fs from 'node:fs'
import {
  type Diagnostic,
  getFlattenFiles,
  getNodesRecord,
  rule,
  type Rule,
} from 'evolution-design/core'
import { resolveImport } from 'evolution-design/kit'
import precinct from 'precinct'

import { parse as parseNearestTsConfig } from 'tsconfck'
import { NAMESPACE } from '../constants.js'

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
      const files = instance.childNodes.filter(
        node => record[node]?.type === 'file',
      )
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
const { paperwork } = precinct

export function importsDirection(order: string[]): Rule {
  return rule({
    name: `default/imports-direction`,
    async check({ root, instance }) {
      const diagnostics: Array<Diagnostic> = []
      const { tsconfig } = await parseNearestTsConfig(root.path)
      const nodesRecord = getNodesRecord(root)

      const childFilesEntires = instance.children.flatMap((childInstance) => {
        const instanceNode = nodesRecord[childInstance.path]
        const files = getFlattenFiles(instanceNode)

        return files.map(file => ([file.path, childInstance] as const))
      })

      const childFilesIndex = Object.fromEntries(childFilesEntires)

      for (const [path, instance] of childFilesEntires) {
        const dependencies = paperwork(path, { includeCore: false, fileSystem: fs })
        const instanceNameIndex = order.indexOf(instance.abstraction.name)

        for (const dependency of dependencies) {
          const resolvedDependency = resolveImport(
            dependency,
            path,
            tsconfig?.compilerOptions ?? {},
            fs.existsSync,
            fs.existsSync,
          )
          if (resolvedDependency === null) {
            continue
          }

          const dependencyInstance = childFilesIndex[resolvedDependency]
          if (dependencyInstance === undefined) {
            continue
          }

          const dependencyInstanceNameIndex = order.indexOf(dependencyInstance.abstraction.name)

          if (dependencyInstanceNameIndex < instanceNameIndex) {
            diagnostics.push({
              message: `Forbidden import "${dependencyInstance.abstraction.name}" from abstraction "${instance.abstraction.name}".
allowed order: ${order.join(' => ')}`,
              location: { path },
            })
          }
        }
      }

      return { diagnostics }
    },
  })
}
