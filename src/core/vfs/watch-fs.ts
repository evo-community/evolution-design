import type { Path, VfsEvents } from './types'
import { join, sep } from 'node:path'
import chokidar from 'chokidar'
import { type GlobbyFilterFunction, isGitIgnored } from 'globby'
import { filter, from, Observable, switchMap } from 'rxjs'
import { addDirectory } from './add-directory'
import { addFile } from './add-file'
import { createVfsRoot } from './create-root'
import { removeNode } from './remove-node'

export function watchFs(path: Path, { onlyReady }: { onlyReady?: boolean } = {}) {
  const isIgnored$ = from(isGitIgnored({ cwd: path }))

  let vfs$ = isIgnored$.pipe(
    switchMap(isIgnored => createWatcherObservable({ path, isIgnored })),
  )

  if (onlyReady) {
    vfs$ = vfs$.pipe(filter(e => e.type === 'ready'))
  }

  return vfs$
}

function createWatcherObservable({ path, isIgnored }: { path: string, isIgnored: GlobbyFilterFunction }) {
  return new Observable<VfsEvents>((observer) => {
    let vfs = createVfsRoot(path)
    const watcher = chokidar.watch(path, {
      ignored: path => path.split(sep).includes('node_modules') || isIgnored(path),
      ignoreInitial: false,
      alwaysStat: true,
      awaitWriteFinish: true,
      disableGlobbing: true,
      cwd: path,
    })

    watcher.on('add', async (relativePath) => {
      vfs = addFile(vfs, join(path, relativePath))
      observer.next({ type: 'add', vfs })
    })

    watcher.on('addDir', async (relativePath) => {
      vfs = addDirectory(vfs, join(path, relativePath))
      observer.next({ type: 'addDir', vfs })
    })

    watcher.on('change', async () => {
      observer.next({ type: 'change', vfs })
    })

    watcher.on('unlink', async (relativePath) => {
      vfs = removeNode(vfs, join(path, relativePath))
      observer.next({ type: 'unlink', vfs })
    })

    watcher.on('unlinkDir', async (relativePath) => {
      vfs = removeNode(vfs, join(path, relativePath))
      observer.next({ type: 'unlinkDir', vfs })
    })

    watcher.on('ready', () => {
      observer.next({ type: 'ready', vfs })
    })

    return () => {
      watcher.close()
    }
  })
}
