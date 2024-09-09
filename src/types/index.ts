export type Path = string

export type Node = File | Folder

export interface File {
  type: 'file'
  path: Path
}

export interface Folder {
  type: 'folder'
  path: Path
  children: Array<Node>
}

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

export interface Rule {
  name: string
  check: (root: Folder) => RuleResult | Promise<RuleResult>
}

export type AbstractionName = string
export interface Abstraction {
  name: string
  children: Record<string, Abstraction>
  rules: Rule[]
  fractal?: string
}

export interface AbstractionInstance {
  abstraction: Abstraction
  children: AbstractionInstance[]
  path: Path
  childNodes: Path[]
}

export interface AbstractionPathSection { abstraction: Abstraction, path: Path }
export type AbstractionsPath = AbstractionPathSection[]
export type AbstractionInstances = Record<Path, AbstractionInstance>

export interface EvolutionConfig {
  /** Root abstraction */
  root: Abstraction
  /** Base url */
  baseUrl?: string
  /** Globs of files to check */
  files?: Array<string>
  /** Globs of files to ignore */
  ignores?: Array<string>
}
