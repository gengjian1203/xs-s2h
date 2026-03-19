import chalk from 'chalk'
import figures from 'figures'
import { Box, Text, useInput } from 'ink'

import type { ActionMenuProps } from '@/types/actions.js'

export function ActionMenu({ options, selectedIndex, onChange, onSubmit }: ActionMenuProps) {
  useInput((input, key) => {
    if (key.upArrow) {
      onChange((selectedIndex - 1 + options.length) % options.length)
      return
    }

    if (key.downArrow) {
      onChange((selectedIndex + 1) % options.length)
      return
    }

    if (key.return || input === ' ') {
      onSubmit()
    }
  })

  return (
    <Box flexDirection="column">
      <Text>{chalk.bold('想要执行的操作')}</Text>
      <Text color="gray">│ 使用 ↑ ↓ 选择，回车确认</Text>
      <Box flexDirection="column" marginTop={1}>
        {options.map((option, index) => {
          const active = index === selectedIndex
          const pointer = active ? chalk.green(figures.pointer) : chalk.gray(' ')
          const label = active ? chalk.green(option.label) : chalk.white(option.label)
          const description = chalk.gray(option.description)

          return (
            <Box
              flexDirection="column"
              key={option.id}
              marginBottom={index === options.length - 1 ? 0 : 1}
            >
              <Text>{`${pointer} ${index + 1}. ${label}`}</Text>
              <Text color="gray">{`│ ${description}`}</Text>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
