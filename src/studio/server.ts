import { debounceTime, Observable, switchMap } from 'rxjs';
import { createServer } from 'node:http';
import { resolve, dirname } from 'node:path';
import express from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { watchFs } from 'evolution-design/core';

export interface ServerConfig {
  configPath: string;
  watch?: boolean;
}

export function startServer({ configPath, watch }: ServerConfig): Observable<any> {
  const rootPath = resolve(dirname(configPath), './test');
  const app = express();
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer);

  return new Observable((observer) => {
    httpServer.listen(3000, () => {
      console.log('Сервер запущен на порту 3000!');
      observer.next({ message: 'Сервер запущен на порту 3000' });
    });

    app.get('/api/fs', (req, res) => {
      res.send('Подключитесь к WebSocket для получения событий');
    });

    const fsSubscription = watchFs(rootPath, { onlyReady: !watch }).pipe(
      debounceTime(500),
      switchMap(({ vfs }) => {
        console.log('Получены данные от файловой системы:', vfs);
        io.emit('fileChange', { vfs: JSON.stringify(vfs) });
        return [vfs];
      })
    ).subscribe({
      next: (data) => observer.next(data),
      error: (err) => observer.error(err),
    });

    io.on('connection', (socket) => {
      console.log('Клиент подключен');

      socket.on('disconnect', () => {
        console.log('Клиент отключен');
      });
    });

    return () => {
      console.log('Остановка сервера и завершение потоков');
      fsSubscription.unsubscribe();
      httpServer.close();
    };
  });
}

