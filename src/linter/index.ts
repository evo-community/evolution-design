import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs'
import { VfsFactory } from './vfs/vfs-factory'
import type { Vfs } from './vfs'

/*
import { combine, createEffect, sample } from 'effector'
import { debounce, not } from 'patronum'
import type { AugmentedDiagnostic } from '@steiger/pretty-reporter'
import type { Folder, Rule, Severity } from '@steiger/types'

import { createWatcher, scan } from './features/transfer-fs-to-vfs'
import { $config, $rules } from './models/config'
import { defer } from './shared/defer'

function getRuleDescriptionUrl(ruleName: string) {
  return new URL(`https://github.com/feature-sliced/steiger/tree/master/packages/steiger-plugin-fsd/src/${ruleName}`)
}

type Config = typeof $config
type SeverityMap = Record<string, Exclude<Severity, 'off'>>

function getSeverity(value: Severity | [Severity, Record<string, unknown>]): Severity {
  return Array.isArray(value) ? value[0] : value
}

function isEnabled([, value]: [string, Severity | [Severity, Record<string, unknown>]]): boolean {
  return getSeverity(value) !== 'off'
}

const $enabledRules = combine($config, $rules, (config, rules) => {
  const ruleConfigs = config?.rules

  if (ruleConfigs === undefined) {
    return rules
  }

  return rules.filter(
    rule => !(rule.name in ruleConfigs) || ruleConfigs[rule.name as keyof typeof ruleConfigs] !== 'off',
  )
})

const $severities = $config.map(
  config =>
    Object.fromEntries(
      Object.entries(config?.rules ?? {})
        .filter(isEnabled)
        .map(([ruleName, severityOrTuple]) => [ruleName, getSeverity(severityOrTuple)]),
    ) as SeverityMap,
)

const $ruleOptions = $config.map(
  config =>
    Object.fromEntries(
      Object.entries(config?.rules ?? {})
        .filter(isEnabled)
        .map(([ruleName, severityOrTuple]) => [ruleName, Array.isArray(severityOrTuple) ? severityOrTuple[1] : {}]),
    ) as Record<string, Record<string, unknown>>,
)

async function runRules({ vfs, rules, severities }: { vfs: Folder, rules: Array<Rule>, severities: SeverityMap }) {
  const ruleResults = await Promise.all(
    rules.map((rule) => {
      const optionsForCurrentRule = $ruleOptions.getState()[rule.name]

      return Promise.resolve(rule.check(vfs, optionsForCurrentRule)).then(({ diagnostics }) =>
        diagnostics.map<AugmentedDiagnostic>(d => ({
          ...d,
          ruleName: rule.name,
          getRuleDescriptionUrl,
          severity: severities[rule.name],
        })),
      )
    }),
  )
  return ruleResults.flat()
}
*/

async function runRules(vfs: Vfs) {
  return { result: true, tree: vfs.root }
}

export const linter = {
  run: (path: string) => VfsFactory.create(path).then(vfs => runRules(vfs)),
  watch: (path: string) => {
    const vfs$ = VfsFactory.watch(path)

    const result$ = vfs$.pipe(debounceTime(500), switchMap(({ vfs }) => runRules(vfs)), distinctUntilChanged())

    return result$
  },
}
