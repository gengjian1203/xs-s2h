import { Box } from 'ink'
import { useCallback, useState } from 'react'

import { ChatHistory } from '@/components/ChatHistory/index.js'
import { ChatInput } from '@/components/ChatInput/index.js'
import { Welcome } from '@/components/Welcome/index.js'
import type { AppProps } from '@/types/app.js'
import type { ChatMessage } from '@/types/chat.js'

const MOCK_REPLIES = [
  '收到，正在为你处理...',
  '好的，让我看看这个问题。',
  '这是一个很好的问题，我来分析一下。',
  '已理解你的需求，稍后给你反馈。',
  '没问题，马上安排。',
]

export function App(_props: AppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = useCallback(
    (content: string) => {
      if (loading) return

      setMessages((prev) => [...prev, { role: 'user', content }])
      setLoading(true)

      const delay = 800 + Math.random() * 1500
      setTimeout(() => {
        const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
        setLoading(false)
      }, delay)
    },
    [loading],
  )

  const showHistory = messages.length > 0 || loading

  return (
    <Box flexDirection="column" padding={1}>
      <Welcome />
      {showHistory && <ChatHistory loading={loading} messages={messages} />}
      <ChatInput disabled={loading} onSubmit={handleSend} />
    </Box>
  )
}
