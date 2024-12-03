import { createServer } from 'node:http'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { watchFs } from 'evolution-design/core'
import express from 'express'
import { debounceTime, Observable, switchMap } from 'rxjs'
import { Server as SocketIOServer } from 'socket.io'

export interface ServerConfig {
  configPath: string
  watch?: boolean
}

export function startServer({ configPath, watch }: ServerConfig): Observable<any> {
  const rootPath = resolve(dirname(configPath), './test')
  const app = express()
  const httpServer = createServer(app)
  const io = new SocketIOServer(httpServer)

  app.use(express.static(`${process.cwd()}/src/studio`))

  return new Observable((observer) => {
    httpServer.listen(3000, () => {
      observer.next({ message: 'Сервер запущен на порту 3000' })
    })

    app.get('/api/fs', (req, res) => {
      res.sendFile(`${process.cwd()}/src/studio/index.html`)
    })

    const fsSubscription = watchFs(rootPath, { onlyReady: !watch }).pipe(
      debounceTime(500),
      switchMap(({ vfs }) => {
        io.emit('fileChange', { vfs })
        return [vfs]
      }),
    ).subscribe({
      next: data => observer.next(data),
      error: err => observer.error(err),
    })

    io.on('connection', (socket) => {
      socket.on('disconnect', () => {
      })
    })

    return () => {
      fsSubscription.unsubscribe()
      httpServer.close()
    }
  })
}
