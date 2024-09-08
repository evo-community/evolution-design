import { join, sep } from 'node:path'
import chokidar from 'chokidar'
import { type GlobbyFilterFunction, isGitIgnored } from 'globby'
import { filter, firstValueFrom, from, Observable, switchMap } from 'rxjs'
import { Vfs } from './vfs'

export interface VfsEvents { type: 'change' | 'add' | 'unlink' | 'ready', vfs: Vfs }
export class VfsFactory {
  static watch(path: string) {
    const vfs = new Vfs(path)
    const isIgnored$ = from(isGitIgnored({ cwd: path }))

    return isIgnored$.pipe(
      switchMap(isIgnored => VfsFactory.createWatcherObservable({ vfs, path, isIgnored })),
    )
  }

  private static createWatcherObservable({ vfs, path, isIgnored }: { path: string, isIgnored: GlobbyFilterFunction, vfs: Vfs }) {
    return new Observable<VfsEvents>((observer) => {
      const watcher = chokidar.watch(path, {
        ignored: path => path.split(sep).includes('node_modules') || isIgnored(path),
        ignoreInitial: false,
        alwaysStat: true,
        awaitWriteFinish: true,
        disableGlobbing: true,
        cwd: path,
      })

      watcher.on('add', async (relativePath) => {
        vfs.addFile(join(path, relativePath))
        observer.next({ type: 'add', vfs })
      })

      watcher.on('change', async () => {
        observer.next({ type: 'change', vfs })
      })

      watcher.on('unlink', async (relativePath) => {
        vfs.removeFile(join(path, relativePath))
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

  /** Scan a folder once without watching and return its virtual file system. */
  static async create(path: string): Promise<Vfs> {
    const vfs$ = await VfsFactory.watch(path)

    const event = await firstValueFrom(vfs$.pipe(filter(e => e.type === 'ready')))
    return event.vfs
  }
}
