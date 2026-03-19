import type { ChatMessage } from '@/types/chat.js'

/** 命令参数定义 */
export interface ArgDef {
  name: string
  alias?: string
  description: string
  required?: boolean
  type: 'string' | 'boolean'
  default?: string | boolean
}

/** 命令执行上下文 */
export interface CommandContext {
  args: Record<string, string | boolean>
  stdin?: string
  rawInput?: string
}

/** 命令执行结果 */
export interface CommandResult {
  output?: string
  messages?: ChatMessage[]
  exit?: boolean
  launchInteractive?: boolean
  initialPrompt?: string
}

/** 命令定义 */
export interface CommandDef {
  name: string
  description: string
  aliases?: string[]
  slash?: string
  args?: ArgDef[]
  execute: (ctx: CommandContext) => Promise<CommandResult>
}
