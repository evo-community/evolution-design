import { relative } from 'node:path'
import * as process from 'node:process'
import { watch } from 'chokidar'
import { cosmiconfig, type CosmiconfigResult } from 'cosmiconfig'
import { Observable } from 'rxjs'
import { fromError } from 'zod-validation-error'
import type { ZodError } from 'zod'
import { EvolutionConfigSchema } from './schema'

const evoConfig = cosmiconfig('evo')

export async function loadConfig() {
  const result = await evoConfig.search()
  return parseConfigResult(result)
}

// TODO: restart on config change
export function watchConfigUpdate(path: string) {
  return watchFileUpdate(path)
}

function parseConfigResult(result: CosmiconfigResult) {
  if (!result?.filepath) {
    throw new ConfigurationNotFoundError()
  }

  const parseResult = EvolutionConfigSchema.safeParse(result?.config)

  if (!parseResult.success) {
    throw new ConfigurationInvalidError(parseResult.error, result?.filepath ?? '')
  }

  return {
    config: parseResult.data,
    configPath: result.filepath,
  }
}

function watchFileUpdate(path: string) {
  return new Observable<string>((observer) => {
    const wather = watch(path).on('change', () => {
      observer.next(path)
    })

    return () => {
      wather.close()
    }
  })
}

export class ConfigurationNotFoundError extends Error {
  constructor() {
    super(`Configuration not found in ${process.cwd()}`)
  }
}

export class ConfigurationInvalidError extends Error {
  constructor(public error: ZodError, filepath: string) {
    super(fromError(error, { prefix: `Invalid configuration in ${relative(process.cwd(), filepath)}` }).toString())
  }
}
