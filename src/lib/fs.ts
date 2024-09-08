import type { File, Folder, Node } from 'evolution-design/types'
import { memoize } from './memoize'

/**
 * Turn a tree folder structure into a flat array of files.
 */
export const flattenFolderNodes = memoize((folder: Folder): Node[] => {
  return folder.children.reduce((acc, child): Node[] => {
    if (child.type === 'file') {
      return [...acc, child]
    }

    return [...acc, child, ...flattenFolderNodes(child)]
  }, [] as Node[])
})

/**
 * Turn a tree folder structure into a flat array of files.
 */
export const flattenFolderFiles = memoize((folder: Folder): File[] => {
  return folder.children.reduce((acc, child) => {
    if (child.type === 'file') {
      return [...acc, child]
    }

    return [...acc, ...flattenFolderFiles(child)]
  }, [] as File[])
})

export function copyFsEntity<T extends Folder | File>(fsEntity: T, deep: boolean = false) {
  if (fsEntity.type === 'folder') {
    const newChildren: Array<Folder | File> = deep
      ? fsEntity.children.map(child => (child.type === 'folder' ? copyFsEntity(child, true) : child))
      : []

    return {
      ...fsEntity,
      children: newChildren,
    }
  }

  return { ...fsEntity }
}
