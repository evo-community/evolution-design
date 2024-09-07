#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
import { consola } from 'consola'
import { version } from 'evolution-design/meta'
import { commands } from './commands'

const main = defineCommand({
  meta: {
    name: 'evolution-design',
    version,
    description: 'Evolution-design CLI',
  },
  subCommands: commands,
  run() {
    consola.success('it works!!!')
  },
})

runMain(main)
