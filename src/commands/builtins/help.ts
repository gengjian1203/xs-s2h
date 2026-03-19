import chalk from 'chalk'

import { getAllCommands, registerCommand } from '../registry.js'

registerCommand({
  name: 'help',
  description: '显示帮助信息',
  aliases: ['-h'],
  execute: async () => {
    const cmds = getAllCommands()
    const lines = cmds.map((c) => `  ${chalk.green(`/${c.name}`)}  ${chalk.gray(c.description)}`)
    const output = [chalk.bold('可用命令:'), '', ...lines, ''].join('\n')
    return { output }
  },
})
