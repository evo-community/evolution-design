import type { Path, VfsFolder } from './types'
import { basename, join, relative, sep } from 'node:path'
import { produce } from 'immer'

export function addDirectory(tree: VfsFolder, newDirectoryPath: Path) {
  const rootPath = tree.path
  return produce(tree, (draft) => {
    const pathSegments = relative(rootPath, newDirectoryPath).split(sep)
    let currentFolder = draft

    for (const pathSegment of pathSegments.slice(0, -1)) {
      const existingChild = currentFolder.children.find(
        child => child.type === 'folder' && basename(child.path) === pathSegment,
      ) as VfsFolder | undefined

      if (existingChild === undefined) {
        currentFolder.children.push({
          type: 'folder',
          path: join(currentFolder.path, pathSegment),
          children: [],
        })
        currentFolder = currentFolder.children[currentFolder.children.length - 1] as VfsFolder
      }
      else {
        currentFolder = existingChild
      }
    }

    currentFolder.children.push({ type: 'folder', path: newDirectoryPath, children: [] })
  })
}
