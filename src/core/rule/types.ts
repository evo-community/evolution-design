import type { AbstractionInstance } from '../abstraction-instance/types'
import type { DependenciesMap } from '../dependencies-map/types'
import type { Path, VfsNode } from '../vfs/types'

export type RuleName = string

export interface Rule {
  name: RuleName
  severity: Severity
  descriptionUrl?: string
  check: (context: RuleContext) => RuleResult | Promise<RuleResult>
}

export interface RuleOptions {
  name: RuleName
  severity?: Severity
  descriptionUrl?: string
  check?: (context: RuleContext) => RuleResult | Promise<RuleResult>
}

export interface RuleContext {
  root: VfsNode
  instance: AbstractionInstance
  dependenciesMap: DependenciesMap
}

export type Fix =
  | {
    type: 'rename'
    path: Path
    newName: string
  }
  | {
    type: 'create-file'
    path: Path
    content: string
  }
  | {
    type: 'create-folder'
    path: Path
  }
  | {
    type: 'delete'
    path: Path
  }
  | {
    type: 'modify-file'
    path: Path
    content: string
  }

export type Severity = 'off' | 'warn' | 'error'

export interface RuleResult {
  diagnostics: Array<Diagnostic>
}

export interface Diagnostic {
  message: string
  fixes?: Array<Fix>
  location: {
    /** Absolute path to a folder or a file that contains the issue. */
    path: Path
    line?: number
    column?: number
  }
}
