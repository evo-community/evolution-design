import type { Rule } from './rule/types'
import type { Path } from './vfs/types'
import * as fs from 'node:fs'

export type AbstractionName = string
export type AbstractionMatcher = string
export interface Abstraction {
  name: AbstractionName
  children: Record<AbstractionMatcher, Abstraction>
  rules: Rule[]
  fractal?: AbstractionName
  fileTemplate?: (path: Path) => string
}

export interface AbstractionOptions {
  name: string
  children?: Record<string, Abstraction>
  rules?: Rule[]
  fractal?: string
  fileTemplate?: ((path: Path) => string) | string
  fileTemplateUrl?: string
}
export function abstraction(name: string, optionalConfig?: Omit<AbstractionOptions, 'name'>): Abstraction
export function abstraction(config: AbstractionOptions): Abstraction
export function abstraction(optionsOrName: AbstractionOptions | string, optionalConfig?: Omit<AbstractionOptions, 'name'>): Abstraction {
  if (typeof optionsOrName === 'string') {
    return {
      name: optionsOrName,
      children: optionalConfig?.children ?? {},
      rules: optionalConfig?.rules ?? [],
      fractal: optionalConfig?.fractal,
      fileTemplate: normalizeFileTemplate(optionalConfig?.fileTemplate, optionalConfig?.fileTemplateUrl),
    }
  }
  return {
    name: optionsOrName.name,
    children: optionsOrName.children ?? {},
    rules: optionsOrName.rules ?? [],
    fractal: optionsOrName.fractal,
    fileTemplate: normalizeFileTemplate(optionsOrName.fileTemplate, optionsOrName?.fileTemplateUrl),
  }
}

function normalizeFileTemplate(fileTemplate?: ((path: Path) => string) | string, fileTemplateUrl?: string): ((path: Path) => string) | undefined {
  if (fileTemplateUrl) {
    return () => fs.readFileSync(fileTemplateUrl, 'utf-8')
  }
  if (!fileTemplate) {
    return undefined
  }
  if (typeof fileTemplate === 'string') {
    return () => fileTemplate
  }

  return fileTemplate
}
