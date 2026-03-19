import chalk from 'chalk'
import { Box, Text, useApp } from 'ink'
import React, { useEffect, useState } from 'react'

import { ActionMenu } from '@/components/ActionMenu/index.js'
import { ResultPanel } from '@/components/ResultPanel/index.js'
import { Welcome } from '@/components/Welcome/index.js'
import { actionOptions } from '@/const/actions.js'
import type { TaskResult } from '@/types/actions.js'
import type { AppProps, ScreenState } from '@/types/app.js'
import { simulateTask } from '@/utils/simulateTask.js'

function createExitMessage(screen: ScreenState, result: TaskResult | null) {
  if (screen === 'result' && result) {
    return [
      '',
      chalk.green(`已结束：${result.title}`),
      chalk.gray(result.summary),
      chalk.gray('如需继续使用，请重新运行 `xs-s2h`。'),
    ].join('\n')
  }

  return ['', chalk.gray('CLI 已关闭。'), chalk.gray('如需继续使用，请重新运行 `xs-s2h`。')].join(
    '\n',
  )
}

export function App({ onExitMessageChange }: AppProps) {
  const { exit } = useApp()
  const [screen, setScreen] = useState<ScreenState>('menu')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [result, setResult] = useState<TaskResult | null>(null)

  useEffect(() => {
    onExitMessageChange?.(createExitMessage(screen, result))
  }, [onExitMessageChange, result, screen])

  useEffect(() => {
    if (screen === 'exit') {
      exit()
    }
  }, [exit, screen])

  const selectedAction = actionOptions[selectedIndex]

  const handleSubmit = async () => {
    if (selectedAction.id === 'exit') {
      setScreen('exit')
      return
    }

    setScreen('running')
    const nextResult = await simulateTask(selectedAction.id)
    setResult(nextResult)
    setScreen('result')
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Welcome />

      {screen === 'menu' && (
        <ActionMenu
          onChange={setSelectedIndex}
          onSubmit={() => {
            void handleSubmit()
          }}
          options={actionOptions}
          selectedIndex={selectedIndex}
        />
      )}

      {screen === 'running' && (
        <Box flexDirection="column">
          <Text>{chalk.bold('执行中')}</Text>
          <Text color="gray">│ 正在处理你的请求，请稍候...</Text>
        </Box>
      )}

      {screen === 'result' && result && (
        <Box flexDirection="column">
          <ResultPanel result={result} />
          <Text color="gray">{'\n│ 按 Ctrl+C 退出，或重新运行命令再次体验。'}</Text>
        </Box>
      )}
    </Box>
  )
}
