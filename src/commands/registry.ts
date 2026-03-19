import type { CommandDef } from './types.js'

const commands = new Map<string, CommandDef>()

export function registerCommand(cmd: CommandDef) {
  commands.set(cmd.name, cmd)
}

export function getCommand(name: string): CommandDef | undefined {
  return commands.get(name)
}

export function getAllCommands(): CommandDef[] {
  return [...commands.values()]
}

/**
 * 匹配斜杠命令，如 "/help" 或 "/help foo bar"
 * 返回匹配的命令和剩余参数字符串
 */
export function matchSlashCommand(input: string): { cmd: CommandDef; rest: string } | null {
  if (!input.startsWith('/')) return null

  const spaceIdx = input.indexOf(' ')
  const name = spaceIdx === -1 ? input.slice(1) : input.slice(1, spaceIdx)
  const rest = spaceIdx === -1 ? '' : input.slice(spaceIdx + 1).trim()

  // 精确匹配命令名
  const cmd = commands.get(name)
  if (cmd) return { cmd, rest }

  // 匹配 slash 别名
  for (const c of commands.values()) {
    if (c.slash && c.slash === `/${name}`) {
      return { cmd: c, rest }
    }
  }

  return null
}

/**
 * 根据前缀过滤命令，用于自动补全
 */
export function filterCommands(prefix: string): CommandDef[] {
  const query = prefix.startsWith('/') ? prefix.slice(1) : prefix
  if (!query) return getAllCommands()
  return getAllCommands().filter((c) => c.name.startsWith(query))
}
