import type { Path, VfsNode } from './types'
import { memoize } from '../../kit/memoize'

export const getNodesRecord = memoize((node: VfsNode): Record<Path, VfsNode> => {
  if (node.type === 'file') {
    return { [node.path]: node }
  }

  return node.children.reduce((acc, child) => {
    if (child.type === 'file') {
      return { ...acc, [child.path]: child }
    }

    return { ...acc, [child.path]: child, ...getNodesRecord(child) }
  }, {} as Record<Path, VfsNode>)
})
