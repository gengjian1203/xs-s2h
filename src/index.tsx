#!/usr/bin/env node
import chalk from 'chalk'
import { render } from 'ink'

import { App } from '@/app.js'
import { parseCLI } from '@/cli/parser.js'

import '@/commands/builtins/index.js'

import { getCommand } from '@/commands/registry.js'

const defaultExitMessage = [
  '',
  chalk.gray('CLI 已关闭。'),
  chalk.gray('如需继续使用，请重新运行 `xs-s2h`。'),
].join('\n')

function renderApp(props: { initialPrompt?: string; stdinContent?: string }) {
  let exitMessage = defaultExitMessage

  const app = render(
    <App
      initialPrompt={props.initialPrompt}
      onExitMessageChange={(nextMessage) => {
        exitMessage = nextMessage
      }}
      stdinContent={props.stdinContent}
    />,
  )

  return app.waitUntilExit().then(() => {
    console.log(exitMessage)
  })
}

async function main() {
  const parsed = await parseCLI(process.argv)

  // CLI 命令模式：匹配到命令则直接执行
  if (parsed.command) {
    const cmd = getCommand(parsed.command)
    if (cmd) {
      const result = await cmd.execute({
        args: parsed.args,
        stdin: parsed.stdin,
      })
      if (result.output) console.log(result.output)
      if (result.launchInteractive) {
        await renderApp({ initialPrompt: result.initialPrompt })
        return
      }
      if (result.exit !== false) process.exit(0)
      return
    }
  }

  // 交互模式：位置参数作为初始 prompt
  const initialPrompt = parsed.positional.join(' ') || undefined
  const stdinContent = parsed.stdin

  await renderApp({ initialPrompt, stdinContent })
}

void main()
