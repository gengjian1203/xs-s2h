import { registerCommand } from '../registry.js'

registerCommand({
  name: 'exit',
  description: '退出程序',
  execute: async () => {
    return { exit: true }
  },
})
