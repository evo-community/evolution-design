import { relative } from 'node:path'
import * as process from 'node:process'
import { fromError } from 'zod-validation-error'
import type { ZodError } from 'zod'

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
