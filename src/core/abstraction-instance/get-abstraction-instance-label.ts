import type { AbstractionInstance } from './types'

import { parse } from 'node:path'

export function getAbstractionInstanceLabel(instance: AbstractionInstance) {
  const { name } = parse(instance.path)

  if (name === instance.abstraction.name) {
    return name
  }

  return `${name} (${instance.abstraction.name})`
}
