import type { Path, VfsFolder } from './types'
import { basename, relative, sep } from 'node:path'
import { produce } from 'immer'

export function removeNode(tree: VfsFolder, removedNodePath: Path) {
  const rootPath = tree.path
  return produce(tree, (draft) => {
    const pathSegments = relative(rootPath, removedNodePath).split(sep)
    let currentFolder = draft

    for (const pathSegment of pathSegments.slice(0, -1)) {
      const existingChild = currentFolder.children.find(
        child => child.type === 'folder' && basename(child.path) === pathSegment,
      ) as VfsFolder | undefined

      if (existingChild === undefined) {
        return tree
      }
      else {
        currentFolder = existingChild
      }
    }

    const removedNodeIndex = currentFolder.children.findIndex(
      child => child.path === removedNodePath,
    )

    if (removedNodeIndex === -1) {
      return tree
    }

    currentFolder.children.splice(removedNodeIndex, 1)
  })
}
