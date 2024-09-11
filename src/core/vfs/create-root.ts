import type { Path, VfsFolder } from './types'

export function createVfsRoot(path: Path): VfsFolder {
  return {
    type: 'folder',
    path,
    children: [],
  }
}
