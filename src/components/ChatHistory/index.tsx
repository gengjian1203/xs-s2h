import chalk from 'chalk'
import { Box, Text } from 'ink'

import type { ChatMessage } from '@/types/chat.js'

const ROLE_STYLES: Record<ChatMessage['role'], { icon: string; format: (s: string) => string }> = {
  user: { icon: chalk.green.bold('❯ '), format: chalk.white },
  assistant: { icon: chalk.green.bold('◆ '), format: chalk.gray },
  system: { icon: chalk.yellow.bold('⚙ '), format: chalk.yellow.dim },
  tool: { icon: chalk.magenta.bold('⚡ '), format: chalk.magenta },
  function: { icon: chalk.blue.bold('ƒ '), format: chalk.blueBright },
}

interface ChatHistoryProps {
  messages: ChatMessage[]
}

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <Box flexDirection="column">
      {messages.map((msg, i) => {
        const style = ROLE_STYLES[msg.role]

        return (
          <Box key={i} marginTop={1}>
            <Text>
              {style.icon}
              {style.format(msg.content)}
            </Text>
          </Box>
        )
      })}
    </Box>
  )
}
