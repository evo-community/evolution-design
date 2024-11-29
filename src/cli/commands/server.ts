import process from 'node:process'
import { defineCommand } from 'citty'
import { watchConfig } from 'evolution-design/core'
import prexit from 'prexit'
import { switchMap } from 'rxjs'
import { startServer } from '../../studio/server'

export default defineCommand({
  meta: {
    name: 'server',
    description: 'Запустить сервер и отслеживать изменения',
  },
  args: {
    watch: {
      type: 'boolean',
      description: 'Отслеживать изменения в файловой системе',
      default: true,
    },
  },
  async run(ctx) {
    const { watch } = ctx.args

    const subscription = watchConfig({
      cwd: process.cwd(),
      onlyOne: true,
    })
      .pipe(
        switchMap(({ configPath, config }) => {
          console.log('Получена конфигурация:', { configPath, config })
          return startServer({ configPath, config, watch })
        }),
      )
      .subscribe({
        next: (data) => {
          console.log('Данные от сервера:', data)
        },
        error: (err) => {
          console.error('Ошибка при получении данных от сервера:', err)
        }
      })

    prexit(() => subscription.unsubscribe())
  },
})
