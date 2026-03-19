import { Box, Text, useInput } from 'ink'
import { useCallback, useState } from 'react'

interface ChatInputProps {
  disabled?: boolean
  onSubmit: (message: string) => void
}

interface InputState {
  value: string
  cursor: number
  draft: string
  history: string[]
  historyIndex: number
}

const INIT_STATE: InputState = {
  value: '',
  cursor: 0,
  draft: '',
  history: [],
  historyIndex: -1,
}

type InputKey = {
  return: boolean
  upArrow: boolean
  downArrow: boolean
  leftArrow: boolean
  rightArrow: boolean
  backspace: boolean
  delete: boolean
  ctrl: boolean
  meta: boolean
}

function clampCursor(cursor: number, value: string) {
  return Math.max(0, Math.min(cursor, value.length))
}

export function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [state, setState] = useState<InputState>(INIT_STATE)
  const { value, cursor } = state

  const handleInput = useCallback(
    (input: string, key: InputKey) => {
      if (key.return) {
        setState((s) => {
          const trimmed = s.value.trim()
          if (!trimmed) return s
          onSubmit(trimmed)
          return {
            ...s,
            value: '',
            cursor: 0,
            draft: '',
            history: [trimmed, ...s.history],
            historyIndex: -1,
          }
        })
        return
      }

      if (key.upArrow) {
        setState((s) => {
          if (s.history.length === 0) return s
          const nextIdx = Math.min(s.historyIndex + 1, s.history.length - 1)
          const msg = s.history[nextIdx]
          if (!msg) return s
          const draft = s.historyIndex === -1 ? s.value : s.draft
          return {
            ...s,
            draft,
            historyIndex: nextIdx,
            value: msg,
            cursor: msg.length,
          }
        })
        return
      }

      if (key.downArrow) {
        setState((s) => {
          if (s.historyIndex <= 0) {
            return {
              ...s,
              historyIndex: -1,
              value: s.draft,
              cursor: s.draft.length,
            }
          }
          const nextIdx = s.historyIndex - 1
          const msg = s.history[nextIdx]
          return { ...s, historyIndex: nextIdx, value: msg, cursor: msg.length }
        })
        return
      }

      if (key.leftArrow) {
        setState((s) => ({ ...s, cursor: clampCursor(s.cursor - 1, s.value) }))
        return
      }

      if (key.rightArrow) {
        setState((s) => ({ ...s, cursor: clampCursor(s.cursor + 1, s.value) }))
        return
      }

      if (key.backspace || input === '\x7f' || input === '\x08') {
        setState((s) => {
          if (s.cursor <= 0) return s
          return {
            ...s,
            historyIndex: -1,
            value: s.value.slice(0, s.cursor - 1) + s.value.slice(s.cursor),
            cursor: s.cursor - 1,
          }
        })
        return
      }

      if (key.delete) {
        setState((s) => {
          if (s.cursor >= s.value.length) return s
          return {
            ...s,
            historyIndex: -1,
            value: s.value.slice(0, s.cursor) + s.value.slice(s.cursor + 1),
          }
        })
        return
      }

      if (input && !key.ctrl && !key.meta) {
        setState((s) => ({
          ...s,
          historyIndex: -1,
          value: s.value.slice(0, s.cursor) + input + s.value.slice(s.cursor),
          cursor: s.cursor + input.length,
        }))
      }
    },
    [onSubmit],
  )

  useInput(handleInput, { isActive: !disabled })

  const before = value.slice(0, cursor)
  const currentChar = value[cursor] ?? ' '
  const after = value.slice(Math.min(cursor + 1, value.length))
  const cursorColor = disabled ? 'gray' : 'cyan'

  return (
    <Box marginTop={1}>
      <Text color={cursorColor}>◇ </Text>
      <Text>{before}</Text>
      <Text inverse>{currentChar}</Text>
      <Text>{after}</Text>
    </Box>
  )
}
