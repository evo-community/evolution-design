import { memoize } from '../../kit/memoize'
import type { VfsFile, VfsFolder } from './types'

export const getFlattenFiles = memoize((folder: VfsFolder): VfsFile[] => {
  return folder.children.reduce((acc, child) => {
    if (child.type === 'file') {
      return [...acc, child]
    }

    return [...acc, ...getFlattenFiles(child)]
  }, [] as VfsFile[])
})
