import { join, sep } from 'node:path'
import chokidar from 'chokidar'
import { type GlobbyFilterFunction, isGitIgnored } from 'globby'
import { filter, from, Observable, switchMap } from 'rxjs'
import { addFile } from './add-file'
import { createVfsRoot } from './create-root'
import { removeFile } from './remove-file'
import type { Path, VfsEvents } from './types'

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

    watcher.on('change', async () => {
      observer.next({ type: 'change', vfs })
    })

    watcher.on('unlink', async (relativePath) => {
      vfs = removeFile(vfs, join(path, relativePath))
      observer.next({ type: 'unlink', vfs })
    })

    watcher.on('ready', () => {
      observer.next({ type: 'ready', vfs })
    })

    return () => {
      watcher.close()
    }
  })
}
