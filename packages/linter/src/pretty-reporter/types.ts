import type { Diagnostic, Rule } from "@evod/core";

export interface AugmentedDiagnostic extends Diagnostic {
  rule: Rule;
}
