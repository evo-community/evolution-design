import { minimatch } from 'minimatch'
import type { Abstraction, AbstractionInstances, Folder } from 'evolution-design/types'
import { flattenFolderNodes } from '../lib/fs'
import { memoize } from '../lib/memoize'

const flatFolderMemo = memoize(flattenFolderNodes)

// TODO: implements create abstractions instances
export function buildAbstractions({ abstraction, root: folder, instances }: {
  abstraction: Abstraction
  root: Folder
  instances: AbstractionInstances
}): AbstractionInstances {
  const folderFlat = flatFolderMemo(folder)

  Object.entries(abstraction).reduce((lastInstances, [pattern, childAbstraction]) => {
    for (const node of folderFlat) {
      if (minimatch(node.path, folder.path + pattern)) {
        lastInstances[node.path] = {
          abstraction: childAbstraction,
          path: node.path,
          abstractionsPath: [],
        }
      }
    }
    return lastInstances
  }, instances)

  if (abstraction.children) {
    for (const [pattern, childAbstraction] of Object.entries(abstraction.children)) {
      buildAbstractions({
        abstraction: childAbstraction,
        root: folder.children.find(child => child.type === 'folder' && child.path === pattern) as Folder,
        instances,
      })
    }
  }

  return {}
}
