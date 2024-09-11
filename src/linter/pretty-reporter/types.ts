import type { Diagnostic, Rule } from 'evolution-design/core'

export interface AugmentedDiagnostic extends Diagnostic {
  rule: Rule
}
