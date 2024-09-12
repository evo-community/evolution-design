import type { Abstraction } from '../abstraction'

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

export function defineConfig(config: EvolutionConfig) {
  return config
}
