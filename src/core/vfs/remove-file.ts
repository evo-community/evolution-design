import { basename, relative, sep } from 'node:path'
import { produce } from 'immer'
import type { Path, VfsFolder } from './types'

export function removeFile(tree: VfsFolder, removedFilePath: Path) {
  const rootPath = tree.path
  return produce(tree, (draft) => {
    const pathSegments = relative(rootPath, removedFilePath).split(sep)
    const parents = [draft]
    let currentFolder = draft

    for (const pathSegment of pathSegments.slice(0, -1)) {
      const existingChild = currentFolder.children.find(
        child => child.type === 'folder' && basename(child.path) === pathSegment,
      ) as VfsFolder | undefined

      if (existingChild === undefined) {
        throw new Error(`Folder ${pathSegment} not found`)
      }
      else {
        currentFolder = existingChild
        parents.push(currentFolder)
      }
    }

    const removedFileIndex = currentFolder.children.findIndex(
      child => child.type === 'file' && child.path === removedFilePath,
    )

    if (removedFileIndex === -1) {
      throw new Error(`File ${removedFilePath} not found`)
    }

    currentFolder.children.splice(removedFileIndex, 1)
    parents.reverse().forEach((parent, index) => {
      if (parent.children.length === 0 && parents[index + 1] !== undefined) {
        parents[index + 1].children.splice(parents[index + 1].children.indexOf(parent), 1)
      }
    })
  })
}
