import { createRequire } from 'node:module'

import chalk from 'chalk'

import { registerCommand } from '../registry.js'

const require = createRequire(import.meta.url)
const pkg = require('../../../package.json') as { version: string }

registerCommand({
  name: 'version',
  description: '显示版本号',
  aliases: ['-v', '-V'],
  execute: async () => {
    return { output: `${chalk.bold('xs-s2h')} v${pkg.version}` }
  },
})
