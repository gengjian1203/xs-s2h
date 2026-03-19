import chalk from 'chalk'
import { Box, Text } from 'ink'
import { useEffect, useState } from 'react'

import type { ChatMessage } from '@/types/chat.js'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']
const THINKING_TEXTS = ['思考中', '思考中.', '思考中..', '思考中...']

interface ChatHistoryProps {
  messages: ChatMessage[]
  loading: boolean
}

function LoadingIndicator() {
  const [frame, setFrame] = useState(0)
  const [textIdx, setTextIdx] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length)
    }, 80)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIdx((i) => (i + 1) % THINKING_TEXTS.length)
    }, 400)
    return () => clearInterval(timer)
  }, [])

  return (
    <Box marginTop={1}>
      <Text color="cyan">
        {SPINNER_FRAMES[frame]} {THINKING_TEXTS[textIdx]}
      </Text>
    </Box>
  )
}

export function ChatHistory({ messages, loading }: ChatHistoryProps) {
  return (
    <Box flexDirection="column">
      {messages.map((msg, i) => (
        <Box key={i} marginTop={i === 0 ? 0 : 1}>
          {msg.role === 'user' && (
            <Text>
              {chalk.green.bold('❯ ')}
              {chalk.white(msg.content)}
            </Text>
          )}
          {msg.role === 'assistant' && (
            <Text>
              {chalk.cyan.bold('◆ ')}
              {chalk.gray(msg.content)}
            </Text>
          )}
          {msg.role === 'system' && (
            <Text>
              {chalk.yellow.bold('⚙ ')}
              {chalk.yellow.dim(msg.content)}
            </Text>
          )}
          {msg.role === 'tool' && (
            <Text>
              {chalk.magenta.bold('⚡ ')}
              {chalk.magenta(msg.content)}
            </Text>
          )}
          {msg.role === 'function' && (
            <Text>
              {chalk.blue.bold('ƒ ')}
              {chalk.blueBright(msg.content)}
            </Text>
          )}
        </Box>
      ))}
      {loading && <LoadingIndicator />}
    </Box>
  )
}
