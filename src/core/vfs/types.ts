export type Path = string

export type VfsNode = VfsFile | VfsFolder

export interface VfsFile {
  type: 'file'
  path: Path
}

export interface VfsFolder {
  type: 'folder'
  path: Path
  children: Array<VfsNode>
}

export interface VfsEvents {
  type: 'change' | 'add' | 'unlink' | 'ready' | 'unlinkDir' | 'addDir'
  vfs: VfsNode
}
