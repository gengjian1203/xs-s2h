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

// 光影颜色梯度：暗 -> 亮 -> 暗
const SHIMMER_COLORS = ['cyan', '#00CCCC', '#00FFFF', '#88FFFF', '#FFFFFF', '#88FFFF', '#00FFFF', '#00CCCC', 'cyan'] as const
const SHIMMER_WIDTH = SHIMMER_COLORS.length

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function ShimmerText({ text }: { text: string }) {
  const [shimmerPos, setShimmerPos] = useState(-SHIMMER_WIDTH)
  const chars = [...text]

  useEffect(() => {
    const timer = setInterval(() => {
      setShimmerPos((p) => {
        const next = p + 1
        // 扫过整个文本后留一小段间隔再重新开始
        return next > chars.length + SHIMMER_WIDTH ? -SHIMMER_WIDTH : next
      })
    }, 60)
    return () => clearInterval(timer)
  }, [chars.length])

  return (
    <Text>
      {chars.map((char, i) => {
        const offset = i - shimmerPos
        const colorIdx = offset + Math.floor(SHIMMER_WIDTH / 2)
        const color = colorIdx >= 0 && colorIdx < SHIMMER_WIDTH ? SHIMMER_COLORS[colorIdx] : 'cyan'
        const bold = colorIdx >= 0 && colorIdx < SHIMMER_WIDTH
        return (
          <Text bold={bold} color={color} key={i}>
            {char}
          </Text>
        )
      })}
    </Text>
  )
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
      <Text color="cyan">{SPINNER_FRAMES[frame]} </Text>
      <ShimmerText text={group[textIdx]} />
    </Box>
  )
}
