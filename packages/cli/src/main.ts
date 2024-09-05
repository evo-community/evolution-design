import { defineCommand } from "citty";
import { commands } from './commands' 
import {consola} from 'consola'
import pkg from '../package.json' assert { type: 'json' }

export const main = defineCommand({
  meta: {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
  },
  subCommands: commands,
  run() {
    consola.success('it works!')
  }
})
