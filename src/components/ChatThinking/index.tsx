import { Box, Text } from 'ink'
import { useEffect, useState } from 'react'

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

const THINKING_GROUPS = [
  ['思考中', '思考中.', '思考中..', '思考中...'],
  ['正在分析', '正在分析.', '正在分析..', '正在分析...'],
  ['让我想想', '让我想想.', '让我想想..', '让我想想...'],
  ['处理中', '处理中.', '处理中..', '处理中...'],
  ['正在推理', '正在推理.', '正在推理..', '正在推理...'],
  ['深入思考', '深入思考.', '深入思考..', '深入思考...'],
  ['整理思路', '整理思路.', '整理思路..', '整理思路...'],
  ['正在理解', '正在理解.', '正在理解..', '正在理解...'],
]

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export function ChatThinking() {
  const [frame, setFrame] = useState(0)
  const [textIdx, setTextIdx] = useState(0)
  const [group] = useState(() => pickRandom(THINKING_GROUPS))

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((f) => (f + 1) % SPINNER_FRAMES.length)
    }, 80)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTextIdx((i) => (i + 1) % group.length)
    }, 400)
    return () => clearInterval(timer)
  }, [group])

  return (
    <Box marginTop={1}>
      <Text color="cyan">
        {SPINNER_FRAMES[frame]} {group[textIdx]}
      </Text>
    </Box>
  )
}
