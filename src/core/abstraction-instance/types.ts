import type { Abstraction } from '../abstraction'
import type { Path } from '../vfs/types'

export interface AbstractionInstance {
  abstraction: Abstraction
  children: AbstractionInstance[]
  path: Path
  childNodes: Path[]
}

export interface AbstractionInstancePathSection { instance: AbstractionInstance, path: Path }
export type AbstractionInstancesPath = AbstractionInstancePathSection[]
