import process from "node:process";
import { defineCommand } from "citty";
import { watchConfig } from "@evod/core";
import { applyAutofixes, lint } from "../../lint";
import prexit from "prexit";
import { catchError, map, switchMap } from "rxjs";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";
import { reportPretty, type AugmentedDiagnostic } from "../../pretty-reporter";

export default defineCommand({
  meta: {
    name: "lint",
    description: "Lint the project",
  },

  args: {
    watch: {
      type: "boolean",
      description: "Watch for changes",
      default: false,
    },
    fix: {
      type: "boolean",
      description: "Apply autofixes",
      default: false,
    },
    "fail-on-warning": {
      type: "boolean",
      description: "Fail on warnings",
      default: false,
    },
  },
  async run(ctx) {
    const { watch, fix, "fail-on-warning": failOnWarning } = ctx.args;

    const subscription = watchConfig({
      cwd: process.cwd(),
      onlyOne: !watch,
    })
      .pipe(
        map(({ configPath, config }) => ({ configPath, config, watch })),
        switchMap(lint),
        catchError((e) => {
          if (e instanceof ZodError) {
            console.error(fromError(e).toString());
          } else if (e instanceof Error) {
            console.error(e.message);
          }

          process.exit(1);
        })
      )
      .subscribe(async (diagnostics) => {
        if (watch) {
          // eslint-disable-next-line no-console
          console.clear();
          reportPretty(diagnostics, process.cwd());
          if (fix) {
            await applyAutofixes(diagnostics);
          }
        } else {
          let stillRelevantDiagnostics = diagnostics;

          reportPretty(diagnostics, process.cwd());

          if (fix) {
            stillRelevantDiagnostics = await applyAutofixes(diagnostics);
          }

          if (stillRelevantDiagnostics.length > 0) {
            const onlyWarnings = stillRelevantDiagnostics.every(
              (d: AugmentedDiagnostic) => d.rule.severity === "warn"
            );
            if (failOnWarning || !onlyWarnings) {
              process.exit(1);
            }
          }
          process.exit(0);
        }
      });

    prexit(() => subscription.unsubscribe());
  },
});
