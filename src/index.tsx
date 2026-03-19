#!/usr/bin/env node
import chalk from 'chalk'
import { render } from 'ink'

import { App } from '@/app.js'

const defaultExitMessage = [
  '',
  chalk.gray('CLI 已关闭。'),
  chalk.gray('如需继续使用，请重新运行 `xs-s2h`。'),
].join('\n')

async function main() {
  let exitMessage = defaultExitMessage

  const app = render(
    <App
      onExitMessageChange={(nextMessage) => {
        exitMessage = nextMessage
      }}
    />,
  )

  await app.waitUntilExit()
  console.log(exitMessage)
}

void main()
