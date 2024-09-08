/* eslint-disable no-console */
import { spawn } from 'node:child_process'
import { dirname, relative, resolve } from 'node:path'
import process from 'node:process'
import { defineCommand } from 'citty'
import { loadConfig } from 'evolution-design/config'
import { linter } from 'evolution-design/linter'
import prexit from 'prexit'
import { from, map, switchMap } from 'rxjs'
import { z, ZodError } from 'zod'
import { fromError } from 'zod-validation-error'

export default defineCommand({
  meta: {
    name: 'lint',
    description: 'Lint the project',
  },

  args: {
    watch: {
      type: 'boolean',
      description: 'Watch for changes',
      default: false,
    },
  },
  async run(ctx) {
    try {
      const { watch } = ctx.args

      const { configPath, config } = await loadConfig()

      const fullPath = resolve(dirname(configPath), config.baseUrl ?? './')

      const results$ = watch ? linter.watch(fullPath) : from(linter.run(fullPath))

      const subscription = results$.subscribe((result) => {
        if (watch) {
          // console.clear()
          console.log(result.tree)
        }
        else {
          console.log(result.tree)
          process.exit(0)
        }
      })

      prexit(() => subscription.unsubscribe())
    }
    catch (e) {
      if (e instanceof ZodError) {
        console.error(fromError(e).toString())
      }
      else if (e instanceof Error) {
        console.error(e.message)
      }

      process.exit(1)
    }
  },
})

export function restartProcess() {
  process.on('exit', () => {
    spawn(process.argv.shift()!, process.argv, {
      cwd: process.cwd(),
      detached: true,
      stdio: 'inherit',
    })
  })
  process.exit()
}
