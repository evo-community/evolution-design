export { abstraction, type Abstraction } from './abstraction'

export { getAbstractionInstanceLabel } from './abstraction-instance/get-abstraction-instance-label'
export { parseAbstractionInstance } from './abstraction-instance/parse-abstraction-instance'
export type { AbstractionInstance } from './abstraction-instance/types'

export { defineConfig, type EvolutionConfig } from './config/define-config'
export { type ConfigResult, watchConfig } from './config/load'

export { parseDependenciesMap } from './dependencies-map/parse-dependencies-map'
export type { DependenciesMap } from './dependencies-map/types'

export { rule } from './rule/rule'
export type { Diagnostic, Rule, RuleContext } from './rule/types'

export { getFlattenFiles } from './vfs/get-flatten-files'
export { getNodesRecord } from './vfs/get-nodes-record'
export type { Path, VfsEvents, VfsFile, VfsFolder, VfsNode } from './vfs/types'
export { watchFs } from './vfs/watch-fs'
