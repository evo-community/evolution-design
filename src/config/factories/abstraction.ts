import type { Abstraction, Rule } from 'evolution-design/types'

export interface AbstractionOptions {
  name: string
  children?: Record<string, Abstraction>
  rules?: Rule[]
  fractal?: string
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
  }
}
