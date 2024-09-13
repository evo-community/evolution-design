import type { VfsNode } from '../vfs/types'
import type { DependenciesMap } from './types'
import * as fs from 'node:fs'
import { resolveImport } from 'evolution-design/kit'
import precinct from 'precinct'
import { parse as parseNearestTsConfig } from 'tsconfck'
import { getFlattenFiles } from '../vfs/get-flatten-files'

const { paperwork } = precinct

export async function parseDependenciesMap(vfs: VfsNode) {
  const dependenciesMap: DependenciesMap = {
    dependencies: {},
    dependencyFor: {},
  }

  const basePath = vfs.path
  const { tsconfig } = await parseNearestTsConfig(basePath)

  const files = getFlattenFiles(vfs)

  for (const file of files) {
    const dependencies = paperwork(file.path, { includeCore: false, fileSystem: fs })
    const resolvedDependencies = dependencies.map(dependency => resolveImport(
      dependency,
      file.path,
      tsconfig?.compilerOptions ?? {},
      fs.existsSync,
      fs.existsSync,
    )).filter(dependency => dependency !== null)

    dependenciesMap.dependencies[file.path] = new Set(resolvedDependencies)

    for (const dependency of resolvedDependencies) {
      if (!dependenciesMap.dependencyFor[dependency]) {
        dependenciesMap.dependencyFor[dependency] = new Set()
      }
      dependenciesMap.dependencyFor[dependency].add(file.path)
    }
  }

  return dependenciesMap
}
