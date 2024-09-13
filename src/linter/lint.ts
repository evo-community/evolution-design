import type { AugmentedDiagnostic } from './pretty-reporter'
import { dirname, resolve } from 'node:path'
import { type EvolutionConfig, parseAbstractionInstance, parseDependenciesMap, watchFs } from 'evolution-design/core'
import { debounceTime, type Observable, switchMap } from 'rxjs'
import { runRules } from './run-rules'

export interface LinterConfig {
  watch?: boolean
  config: EvolutionConfig
  configPath: string
}

export function lint({ watch, config, configPath }: LinterConfig): Observable<AugmentedDiagnostic[]> {
  const rootPath = resolve(dirname(configPath), config.baseUrl ?? './')

  const parseNode = parseAbstractionInstance(config.root)
  return watchFs(rootPath, { onlyReady: !watch }).pipe(
    debounceTime(500),
    switchMap(async ({ vfs }) => ({
      root: vfs,
      instance: parseNode(vfs),
      dependenciesMap: await parseDependenciesMap(vfs),
    })),
    switchMap(runRules),
  )
}
