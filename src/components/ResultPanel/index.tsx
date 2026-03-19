import chalk from 'chalk'
import { Box, Text } from 'ink'

import type { ResultPanelProps } from '@/types/resultPanel.js'

export function ResultPanel({ result }: ResultPanelProps) {
  return (
    <Box borderColor="gray" borderStyle="round" flexDirection="column" marginTop={1} paddingX={1}>
      <Text color="greenBright">{chalk.bold(result.title)}</Text>
      <Text color="gray">{result.summary}</Text>
      <Box flexDirection="column" marginTop={1}>
        {result.tasks.map((task) => {
          const icon = task.status === 'done' ? chalk.green('✔') : chalk.gray('ℹ')
          const textColor = task.status === 'done' ? 'white' : 'gray'

          return (
            <Text color={textColor} key={task.label}>
              {`${icon} ${task.label}`}
            </Text>
          )
        })}
      </Box>
    </Box>
  )
}
