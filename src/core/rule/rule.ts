import type { Rule, RuleName, RuleOptions } from './types'

export function rule(name: RuleName): Rule
export function rule(options: RuleOptions): Rule
export function rule(config: RuleOptions | RuleName): Rule {
  const defaultCheck = () => ({ diagnostics: [] })

  if (typeof config === 'string') {
    return {
      name: config,
      severity: 'error',
      descriptionUrl: undefined,
      check: defaultCheck,
    }
  }

  return {
    name: config.name,
    severity: config.severity ?? 'error',
    descriptionUrl: config.descriptionUrl,
    check: config.check ?? defaultCheck,
  }
}
