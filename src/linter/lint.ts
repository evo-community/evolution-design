import { dirname, resolve } from 'node:path'
import { type EvolutionConfig, parseAbstractionInstance, type Path, watchFs } from 'evolution-design/core'
import { debounceTime, map, type Observable, switchMap } from 'rxjs'
import { runRules } from './run-rules'
import type { AugmentedDiagnostic } from './pretty-reporter'

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
    map(({ vfs }) => ({ root: vfs, instance: parseNode(vfs) })),
    switchMap(runRules),
  )
}
