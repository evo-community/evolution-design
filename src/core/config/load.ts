import type { EvolutionConfig } from './define-config'
import { loadConfig, watchConfig as watchConfigC12 } from 'c12'
import { from, map, Observable, switchMap } from 'rxjs'
import { ConfigurationInvalidError, ConfigurationNotFoundError } from './errors'
import { EvolutionConfigSchema } from './schema'

const CONFIG_NAME = 'evo'

export interface ConfigResult {
  config: EvolutionConfig
  configPath: string
}

export function watchConfig({ cwd, onlyOne }: { cwd: string, onlyOne?: boolean }) {
  const config$ = from(loadConfig({
    cwd,
    name: CONFIG_NAME,
  }))
    .pipe(map(({ configFile, config }) => {
      if (!configFile) {
        throw new ConfigurationNotFoundError()
      }
      return parseConfigResult(configFile, config)
    }))

  if (onlyOne) {
    return config$
  }

  return config$.pipe(
    switchMap(({ configPath, config }) => new Observable<ConfigResult>((subscriber) => {
      subscriber.next({ configPath, config })

      let unwatchCallback = () => {}

      watchConfigC12({
        cwd,
        name: CONFIG_NAME,
        onUpdate: (config) => {
          subscriber.next(parseConfigResult(configPath, config.newConfig.config))
        },
      }).then(({ unwatch }) => {
        unwatchCallback = unwatch
      })

      return () => unwatchCallback()
    })),
  )
}

function parseConfigResult(filepath: string, data: unknown): ConfigResult {
  const parseResult = EvolutionConfigSchema.safeParse(data)

  if (!parseResult.success) {
    throw new ConfigurationInvalidError(parseResult.error, filepath)
  }

  return {
    config: parseResult.data,
    configPath: filepath,
  }
}
