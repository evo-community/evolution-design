import type { Path } from '../vfs/types'

export interface DependenciesMap {
  dependencies: Record<Path, Set<Path>>
  dependencyFor: Record<Path, Set<Path>>
}
