import type { Diagnostic, Rule } from 'evolution-design/types'

export interface AugmentedDiagnostic extends Diagnostic {
  rule: Rule
}
