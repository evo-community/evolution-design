import type { CommandDef } from 'citty'

const _rDefault = (r: any) => (r.default || r) as Promise<CommandDef>

export const commands = {
  'add': () => import('./init').then(_rDefault),
} as const
