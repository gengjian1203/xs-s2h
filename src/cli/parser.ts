import { getAllCommands } from '@/commands/registry.js'
import type { ArgDef } from '@/commands/types.js'

export interface ParsedCLI {
  command?: string
  args: Record<string, string | boolean>
  positional: string[]
  stdin?: string
}

/**
 * 从 stdin 读取管道输入（非 TTY 时）
 */
async function readStdin(): Promise<string | undefined> {
  if (process.stdin.isTTY) return undefined

  const chunks: Buffer[] = []
  for await (const chunk of process.stdin) {
    chunks.push(chunk as Buffer)
  }
  const text = Buffer.concat(chunks).toString('utf-8').trim()
  return text || undefined
}

/**
 * 构建参数查找表：--name / -alias → { argDef, commandName }
 */
function buildArgLookup() {
  const lookup = new Map<string, { arg: ArgDef; cmdName: string }>()
  for (const cmd of getAllCommands()) {
    if (!cmd.args) continue
    for (const arg of cmd.args) {
      lookup.set(`--${arg.name}`, { arg, cmdName: cmd.name })
      if (arg.alias) {
        lookup.set(arg.alias, { arg, cmdName: cmd.name })
      }
    }
  }
  return lookup
}

/**
 * 构建命令别名查找表：--name / -alias → commandName
 */
function buildCommandLookup() {
  const lookup = new Map<string, string>()
  for (const cmd of getAllCommands()) {
    lookup.set(`--${cmd.name}`, cmd.name)
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        lookup.set(alias, cmd.name)
      }
    }
  }
  return lookup
}

/**
 * 解析 CLI 参数
 */
export async function parseCLI(argv: string[]): Promise<ParsedCLI> {
  const tokens = argv.slice(2)
  const commandLookup = buildCommandLookup()
  const argLookup = buildArgLookup()

  let command: string | undefined
  const args: Record<string, string | boolean> = {}
  const positional: string[] = []

  let i = 0
  while (i < tokens.length) {
    const token = tokens[i]!

    // 匹配命令级别的 flag（如 --help, -h）
    const cmdMatch = commandLookup.get(token)
    if (cmdMatch) {
      command = cmdMatch
      i++
      continue
    }

    // 匹配参数级别的 flag（如 --prompt, -p）
    const argMatch = argLookup.get(token)
    if (argMatch) {
      if (argMatch.arg.type === 'boolean') {
        args[argMatch.arg.name] = true
      } else {
        const nextToken = tokens[i + 1]
        args[argMatch.arg.name] = nextToken ?? ''
        i++
      }
      // 如果参数属于某个命令，隐式选中该命令
      if (!command) {
        command = argMatch.cmdName
      }
      i++
      continue
    }

    // 位置参数
    positional.push(token)
    i++
  }

  const stdin = await readStdin()

  return { command, args, positional, stdin }
}
