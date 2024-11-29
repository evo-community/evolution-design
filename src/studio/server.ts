import { createServer } from 'node:http'
import { dirname, resolve } from 'node:path'
import { watchFs } from 'evolution-design/core'
import express from 'express'
import { Server as SocketIOServer } from 'socket.io'

export interface LinterConfig {
  configPath: string
  watch?: boolean
}

export function startServer({ configPath, watch }: LinterConfig) {
  const app = express()
  const httpServer = createServer(app)
  const io = new SocketIOServer(httpServer)

  httpServer.listen(3000, () => {
    console.log('Сервер запущен на порту 3000!')
  })

  app.get('/api/fs', (req, res) => {
    res.send('Подключитесь к WebSocket для получения событий')
  })

  const rootPath = resolve(dirname(configPath), './test') // Укажите правильный путь к вашему проекту
  console.log('rootPath', rootPath)

  watchFs(rootPath, { onlyReady: !watch }).subscribe({
    next: (data) => {
      console.log('Получены данные от watchFs:', data)
      if (data.vfs) {
        io.emit('fileChange', { vfs: data.vfs }) // Отправляем данные через WebSocket
      }
    },
    error: (err) => {
      console.error('Ошибка при получении событий:', err)
    }
  })

  io.on('connection', (socket) => {
    console.log('Клиент подключен')

    socket.on('disconnect', () => {
      console.log('Клиент отключен')
    })
  })
}
