import type { Path, VfsFile, VfsFolder, VfsNode } from 'evolution-design/types'
import { memoize } from './memoize'

export const nodesRecord = memoize((folder: VfsNode): Record<Path, VfsNode> => {
  if (folder.type === 'file') {
    return { [folder.path]: folder }
  }

  return folder.children.reduce((acc, child) => {
    if (child.type === 'file') {
      return { ...acc, [child.path]: child }
    }

    return { ...acc, [child.path]: child, ...nodesRecord(child) }
  }, {} as Record<Path, VfsNode>)
})
/**
 * Turn a tree folder structure into a flat array of files.
 */
export const flattenFolderNodes = memoize((folder: VfsFolder): VfsNode[] => {
  return folder.children.reduce((acc, child): VfsNode[] => {
    if (child.type === 'file') {
      return [...acc, child]
    }

    return [...acc, child, ...flattenFolderNodes(child)]
  }, [] as VfsNode[])
})

/**
 * Turn a tree folder structure into a flat array of files.
 */
export const flattenFolderFiles = memoize((folder: VfsFolder): VfsFile[] => {
  return folder.children.reduce((acc, child) => {
    if (child.type === 'file') {
      return [...acc, child]
    }

    return [...acc, ...flattenFolderFiles(child)]
  }, [] as VfsFile[])
})

export function copyFsEntity<T extends VfsFolder | VfsFile>(fsEntity: T, deep: boolean = false) {
  if (fsEntity.type === 'folder') {
    const newChildren: Array<VfsFolder | VfsFile> = deep
      ? fsEntity.children.map(child => (child.type === 'folder' ? copyFsEntity(child, true) : child))
      : []

    return {
      ...fsEntity,
      children: newChildren,
    }
  }

  return { ...fsEntity }
}
