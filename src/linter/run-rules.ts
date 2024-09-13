import type { AbstractionInstance, Rule, RuleContext } from 'evolution-design/core'
import type { AugmentedDiagnostic } from './pretty-reporter'

export async function runRules({ root, instance, dependenciesMap }: RuleContext) {
  const ruleDiagnostics = (currentInstance: AbstractionInstance) => async (rule: Rule) => {
    if (rule.severity === 'off') {
      return []
    }
    const { diagnostics } = await rule.check({ root, instance: currentInstance, dependenciesMap })
    return diagnostics.map(d => ({ ...d, rule }))
  }

  const runAbstractionRules = (currentInstance: AbstractionInstance): Promise<AugmentedDiagnostic[]>[] => {
    return currentInstance.abstraction.rules.map(ruleDiagnostics(currentInstance)).concat(
      ...currentInstance.children.flatMap(runAbstractionRules),
    )
  }

  return await Promise.all(runAbstractionRules(instance)).then(r => r.flat())
}
