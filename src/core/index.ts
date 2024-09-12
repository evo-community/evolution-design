export { abstraction, type Abstraction } from './abstraction'

export { parseAbstractionInstance } from './abstraction-instance/parse-abstraction-instance'
export type { AbstractionInstance } from './abstraction-instance/types'

export { defineConfig, type EvolutionConfig } from './config/define-config'
export { type ConfigResult, watchConfig } from './config/load'
export { rule } from './rule/rule'
export type { Diagnostic, Rule, RuleContext } from './rule/types'
export { getFlattenFiles } from './vfs/get-flatten-files'
export { getNodesRecord } from './vfs/get-nodes-record'
export type { Path, VfsEvents, VfsFile, VfsFolder, VfsNode } from './vfs/types'
export { watchFs } from './vfs/watch-fs'
