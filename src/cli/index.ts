#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { version } from 'evolution-design/meta'
import { commands } from './commands'

const main = defineCommand({
  meta: {
    name: 'evolution-design',
    version,
    description: 'Evolution-design CLI',
  },
  subCommands: commands,
})

runMain(main)
