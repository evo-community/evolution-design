import type { Rule } from './rule/types'
import type { Path } from './vfs/types'

export type AbstractionName = string
export type AbstractionMahter = string
export interface Abstraction {
  name: AbstractionName
  children: Record<AbstractionMahter, Abstraction>
  rules: Rule[]
  fractal?: AbstractionName
  fileTemplate?: (path: Path) => string
}

export interface AbstractionOptions {
  name: string
  children?: Record<string, Abstraction>
  rules?: Rule[]
  fractal?: string
  fileTemplate?: (path: Path) => string
}
export function abstraction(name: string): Abstraction
export function abstraction(config: AbstractionOptions): Abstraction
export function abstraction(options: AbstractionOptions | string): Abstraction {
  if (typeof options === 'string') {
    return {
      name: options,
      children: {},
      rules: [],
    }
  }

  return {
    name: options.name,
    children: options.children ?? {},
    rules: options.rules ?? [],
    fractal: options.fractal,
    fileTemplate: options.fileTemplate,
  }
}
