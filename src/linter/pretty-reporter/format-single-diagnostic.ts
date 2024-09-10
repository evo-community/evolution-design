import { relative } from 'node:path'
import chalk from 'chalk'
import figures from 'figures'
import terminalLink from 'terminal-link'
import type { AugmentedDiagnostic } from './types'

export function formatSingleDiagnostic(d: AugmentedDiagnostic, cwd: string): string {
  const x = d.rule.severity === 'error' ? chalk.red(figures.cross) : chalk.yellow(figures.warning)
  const s = chalk.reset(figures.lineDownRight)
  const bar = chalk.reset(figures.lineVertical)
  const e = chalk.reset(figures.lineUpRight)
  const message = chalk.reset(d.message)
  const autofixable = d.fixes !== undefined && d.fixes.length > 0 ? chalk.green(`${figures.tick} Auto-fixable`) : null
  const location = chalk.gray(formatLocation(d.location, cwd))
  const ruleName = d.rule.descriptionUrl ? chalk.blue(terminalLink(d.rule.name, d.rule.descriptionUrl!)) : d.rule.name

  return `
${s} ${location}
${x} ${message}
${autofixable ? `${autofixable}\n${bar}` : bar}
${e} ${ruleName}
`.trim()
}

function formatLocation(location: AugmentedDiagnostic['location'], cwd: string) {
  let path = relative(cwd, location.path)
  if (location.line !== undefined) {
    path += `:${location.line}`

    if (location.column !== undefined) {
      path += `:${location.column}`
    }
  }

  return path
}
