import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs'
import type { Abstraction, AbstractionInstance, Rule, RuleContext } from 'evolution-design/types'
import { buildAbstractionInstance } from './abstraction-instance/build-abstraction-instance'
import { VfsFactory } from './vfs/vfs-factory'
import type { AugmentedDiagnostic } from './pretty-reporter'

async function runRules({ root, instance }: RuleContext) {
  const ruleDiagnostics = (currentInstance: AbstractionInstance) => async (rule: Rule) => {
    if (rule.severity === 'off') {
      return []
    }
    const { diagnostics } = await rule.check({ root, instance: currentInstance })
    return diagnostics.map<AugmentedDiagnostic>(d => ({ ...d, rule }))
  }

  const runAbstractionRules = (currentInstance: AbstractionInstance): Promise<AugmentedDiagnostic[]>[] => {
    return currentInstance.abstraction.rules.map(ruleDiagnostics(currentInstance)).concat(
      ...currentInstance.children.flatMap(runAbstractionRules),
    )
  }

  return await Promise.all(runAbstractionRules(instance)).then(r => r.flat())
}

export const linter = {
  run: (path: string, abstraction: Abstraction) =>
    VfsFactory
      .create(path)
      .then(root => runRules({
        root,
        instance: buildAbstractionInstance(abstraction, root),
      })),
  watch: (path: string, abstraction: Abstraction) => {
    const vfsEvents$ = VfsFactory.watch(path)

    const result$ = vfsEvents$
      .pipe(
        debounceTime(500),
        switchMap(({ rootNode }) => runRules({
          root: rootNode,
          instance: buildAbstractionInstance(abstraction, rootNode),
        })),
        distinctUntilChanged(),
      )

    return result$
  },
}
