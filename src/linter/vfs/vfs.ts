import { basename, join, relative, sep } from 'node:path'
import { produce } from 'immer'
import type { Path, VfsFolder } from 'evolution-design/types'

export class Vfs {
  private tree: VfsFolder
  constructor(private rootPath: string) {
    this.tree = {
      type: 'folder',
      path: rootPath,
      children: [],
    }
  }

  get root() {
    return this.tree
  }

  flatFolders() {
    const folrders = (folder: VfsFolder): VfsFolder[] => {
      return folder.children.filter(child => child.type === 'folder').flatMap(child => folrders(child))
    }
    return folrders(this.tree)
  }

  addFile(newFilePath: Path) {
    this.tree = produce(this.tree, (draft) => {
      const pathSegments = relative(this.rootPath, newFilePath).split(sep)
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

      currentFolder.children.push({ type: 'file', path: newFilePath })
    })
    return this
  }

  removeFile(removedFilePath: Path) {
    this.tree = produce(this.tree, (draft) => {
      const pathSegments = relative(this.rootPath, removedFilePath).split(sep)
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
    return this
  }
}
