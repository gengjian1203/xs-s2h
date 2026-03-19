import { Box, useApp } from 'ink'
import { useCallback, useEffect, useRef, useState } from 'react'

import { matchSlashCommand } from '@/commands/registry.js'
import { ChatHistory } from '@/components/ChatHistory/index.js'
import { ChatInput } from '@/components/ChatInput/index.js'
import { ChatThinking } from '@/components/ChatThinking/index.js'
import { Welcome } from '@/components/Welcome/index.js'
import { MOCK_REPLIES } from '@/const/mock.js'
import type { AppProps } from '@/types/app.js'
import type { ChatMessage } from '@/types/chat.js'
import { sleep } from '@/utils/simulateTask.js'

export function App({
  initialPrompt,
  stdinContent,
  onExitMessageChange: _onExitMessageChange,
}: AppProps) {
  const { exit } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const initialSent = useRef(false)

  const handleSend = useCallback(
    async (content: string) => {
      if (loading) return

      // 斜杠命令处理
      const matched = matchSlashCommand(content)
      if (matched) {
        setMessages((prev) => [...prev, { role: 'user', content }])
        const result = await matched.cmd.execute({
          args: {},
          rawInput: content,
        })
        if (result.output) {
          setMessages((prev) => [...prev, { role: 'system', content: result.output! }])
        }
        if (result.exit) {
          exit()
        }
        return
      }

      // 正常聊天流程
      setMessages((prev) => [...prev, { role: 'user', content }])
      setLoading(true)

      const delay = 5000
      await sleep(delay)
      const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      setLoading(false)
    },
    [loading, exit],
  )

  // 处理初始 prompt（来自 CLI 位置参数或管道输入）
  useEffect(() => {
    if (initialSent.current) return
    initialSent.current = true

    let prompt = initialPrompt ?? ''
    if (stdinContent) {
      prompt = prompt ? `${prompt}\n\n${stdinContent}` : stdinContent
    }
    if (prompt) {
      void handleSend(prompt)
    }
  }, [initialPrompt, stdinContent, handleSend])

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
