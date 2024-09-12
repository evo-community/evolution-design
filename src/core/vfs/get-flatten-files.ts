import type { VfsFile, VfsNode } from './types'
import { memoize } from 'evolution-design/kit'

export const getFlattenFiles = memoize((node: VfsNode): VfsFile[] => {
  if (node.type === 'file') {
    return [node]
  }
  return node.children.reduce((acc, child) => {
    if (child.type === 'file') {
      return [...acc, child]
    }

    return [...acc, ...getFlattenFiles(child)]
  }, [] as VfsFile[])
})
