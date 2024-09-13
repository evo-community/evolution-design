import { extname, join } from 'node:path'
import {
  type Diagnostic,
  getAbstractionInstanceLabel,
  getFlattenFiles,
  getNodesRecord,
  rule,
  type Rule,
} from 'evolution-design/core'
import isGlob from 'is-glob'

export function off<T extends Rule | Rule[]>(rule: T): T {
  if (Array.isArray(rule)) {
    return rule.map(r => ({ ...r, severity: 'off' as const })) as T
  }
  return { ...rule, severity: 'off' }
}

export function warn<T extends Rule | Rule[]>(rule: T): T {
  if (Array.isArray(rule)) {
    return rule.map(r => ({ ...r, severity: 'warn' as const })) as T
  }
  return { ...rule, severity: 'warn' }
}

export function requiredChildren(abstractions?: string[]) {
  return rule({
    name: 'default/required-children',
    severity: 'error',
    check({ instance, root }) {
      const diagnostics: Array<Diagnostic> = []
      const nodesRecord = getNodesRecord(root)

      const reuqiredAbstractions = Object.entries(instance.abstraction.children)
        .filter(([ext]) => !isGlob(ext))
        .filter(([, abstraction]) => !abstractions || abstractions.includes(abstraction.name))

      for (const [ext, abstraction] of reuqiredAbstractions) {
        const path = join(instance.path, ext)

        const instanceNode = nodesRecord[path]
        if (instanceNode !== undefined) {
          continue
        }

        const message = `Required abstraction "${abstraction.name}" in "${getAbstractionInstanceLabel(instance)}"`

        if (extname(path) === '') {
          diagnostics.push({
            message,
            location: { path },
            fixes: [
              {
                type: 'create-folder',
                path,
              },
            ],
          })
        }
        else {
          diagnostics.push({
            message,
            location: { path },
            fixes: [
              {
                type: 'create-file',
                path,
                content: abstraction.fileTemplate?.(path) ?? '',
              },
            ],
          })
        }
      }

      return {
        diagnostics,
      }
    },

  })
}

export function noUnabstractionFiles() {
  return rule({
    name: 'default/no-unabstraction-files',
    severity: 'error',
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
  })
}

export function publicAbstraction(name: string): Rule {
  return {
    name: 'default/public-abstraction',
    severity: 'error',
    check({ instance, dependenciesMap, root }) {
      const diagnostics: Array<Diagnostic> = []
      const nodesRecord = getNodesRecord(root)

      const childFilesEntires = instance.children.flatMap((childInstance) => {
        const instanceNode = nodesRecord[childInstance.path]
        const files = getFlattenFiles(instanceNode)
        return files.map(file => ([file.path, childInstance] as const))
      })

      const childFilesIndex = Object.fromEntries(childFilesEntires)

      for (const [path, childInstance] of childFilesEntires) {
        const importers = dependenciesMap.dependencyFor[path]

        if (childInstance.abstraction.name === name) {
          continue
        }

        for (const importer of importers) {
          const dependencyInstance = childFilesIndex[importer]
          if (dependencyInstance === undefined) {
            diagnostics.push({
              message: `Imports of "${getAbstractionInstanceLabel(instance)}" bypassing the public api are forbidden`,
              location: { path },
            })
          }
        }
      }

      return { diagnostics }
    },
  }
}

export function restrictCrossImports() {
  return rule({
    name: 'default/restrict-cross-imports',
    severity: 'error',
    async check({ root, instance, dependenciesMap }) {
      const diagnostics: Array<Diagnostic> = []
      const nodesRecord = getNodesRecord(root)

      const childFilesEntires = instance.children.flatMap((childInstance) => {
        const instanceNode = nodesRecord[childInstance.path]
        const files = getFlattenFiles(instanceNode)
        return files.map(file => ([file.path, childInstance] as const))
      })

      const childFilesIndex = Object.fromEntries(childFilesEntires)

      for (const [path, instance] of childFilesEntires) {
        const dependencies = dependenciesMap.dependencies[path]

        for (const dependency of dependencies) {
          const dependencyInstance = childFilesIndex[dependency]
          if (dependencyInstance === undefined) {
            continue
          }

          if (dependencyInstance.path !== instance.path) {
            diagnostics.push({
              message: `Forbidden dependency "${getAbstractionInstanceLabel(instance)}" <= "${getAbstractionInstanceLabel(dependencyInstance)}".
cross imports are not allowed!`,
              location: { path },
            })
          }
        }
      }

      return { diagnostics }
    },
  })
}

export function dependenciesDirection(order: string[]) {
  return rule({
    name: `default/dependencies-direction`,
    severity: 'error',
    async check({ root, instance, dependenciesMap }) {
      const diagnostics: Array<Diagnostic> = []
      const nodesRecord = getNodesRecord(root)

      const childFilesEntires = instance.children.flatMap((childInstance) => {
        const instanceNode = nodesRecord[childInstance.path]
        const files = getFlattenFiles(instanceNode)

        return files.map(file => ([file.path, childInstance] as const))
      })

      const childFilesIndex = Object.fromEntries(childFilesEntires)

      for (const [path, instance] of childFilesEntires) {
        const dependencies = dependenciesMap.dependencies[path]
        const instanceNameIndex = order.indexOf(instance.abstraction.name)

        for (const dependency of dependencies) {
          const dependencyInstance = childFilesIndex[dependency]
          if (dependencyInstance === undefined) {
            continue
          }

          const dependencyInstanceNameIndex = order.indexOf(dependencyInstance.abstraction.name)

          if (dependencyInstanceNameIndex < instanceNameIndex) {
            diagnostics.push({
              message: `Forbidden dependency "${instance.abstraction.name}" <= "${dependencyInstance.abstraction.name}".
allowed dependencies order: ${order.join(' <= ')}`,
              location: { path },
            })
          }
        }
      }

      return { diagnostics }
    },
  })
}
