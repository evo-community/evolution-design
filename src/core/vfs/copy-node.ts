import type { VfsNode } from './types'

export function copyNode<T extends VfsNode>(fsEntity: T, deep: boolean = false) {
  if (fsEntity.type === 'folder') {
    const newChildren: Array<VfsNode> = deep
      ? fsEntity.children.map(child => (child.type === 'folder' ? copyNode(child, true) : child))
      : []

    return {
      ...fsEntity,
      children: newChildren,
    }
  }

  return { ...fsEntity }
}
