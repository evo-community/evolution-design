#!/usr/bin/env node
import { defineCommand, runMain } from 'citty'
// TODO does not work with stub
// import { version } from 'evolution-design/meta'
import { commands } from './commands'

const main = defineCommand({
  meta: {
    name: 'evolution-design',
    version: '0.0.0',
    description: 'Evolution-design CLI',
  },
  subCommands: commands,
})

runMain(main)
