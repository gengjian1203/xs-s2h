import { Box } from 'ink'
import { useCallback, useState } from 'react'

import { ChatHistory } from '@/components/ChatHistory/index.js'
import { ChatInput } from '@/components/ChatInput/index.js'
import { ChatThinking } from '@/components/ChatThinking/index.js'
import { Welcome } from '@/components/Welcome/index.js'
import { MOCK_REPLIES } from '@/const/mock.js'
import type { AppProps } from '@/types/app.js'
import type { ChatMessage } from '@/types/chat.js'
import { sleep } from '@/utils/simulateTask.js'

export function App(_props: AppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = useCallback(
    async (content: string) => {
      if (loading) return

      setMessages((prev) => [...prev, { role: 'user', content }])
      setLoading(true)

      const delay = 5000
      await sleep(delay)
      const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setLoading(false)
    },
    [loading],
  )

  return (
    <Box flexDirection="column" padding={1}>
      {/* 欢迎界面 */}
      <Welcome />
      {/* 聊天历史 */}
      <ChatHistory messages={messages} />
      {/* 思考中 */}
      {loading && <ChatThinking />}
      {/* 输入框 */}
      <ChatInput disabled={loading} onSubmit={handleSend} />
    </Box>
  )
}
