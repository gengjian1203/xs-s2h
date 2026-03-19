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

function replaceRange(value: string, start: number, end: number, nextText = '') {
  return value.slice(0, start) + nextText + value.slice(end)
}

function removeBackward(value: string, cursor: number) {
  if (cursor <= 0) {
    return { value, cursor }
  }

  const nextCursor = cursor - 1

  return {
    value: replaceRange(value, nextCursor, cursor),
    cursor: nextCursor,
  }
}

// function removeForward(value: string, cursor: number) {
//   if (cursor >= value.length) {
//     return { value, cursor }
//   }

//   return {
//     value: replaceRange(value, cursor, cursor + 1),
//     cursor,
//   }
// }

export function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [state, setState] = useState<InputState>(INIT_STATE)
  const { value, cursor } = state

  const handleInput = useCallback(
    (input: string, key: InputKey) => {
      if (key.return) {
        if (disabled) {
          return
        }

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

      if (key.backspace || input === '\x7f' || input === '\x08' || (key.ctrl && input === 'h')) {
        setState((s) => {
          const nextState = removeBackward(s.value, s.cursor)
          if (nextState.value === s.value) return s

          return {
            ...s,
            historyIndex: -1,
            value: nextState.value,
            cursor: nextState.cursor,
          }
        })
        return
      }

      if (key.delete) {
        setState((s) => {
          const nextState = removeBackward(s.value, s.cursor)

          if (nextState.value === s.value) return s

          return {
            ...s,
            historyIndex: -1,
            value: nextState.value,
            cursor: nextState.cursor,
          }
        })
        return
      }

      if (input && !key.ctrl && !key.meta) {
        setState((s) => ({
          ...s,
          historyIndex: -1,
          value: replaceRange(s.value, s.cursor, s.cursor, input),
          cursor: s.cursor + input.length,
        }))
      }
    },
    [disabled, onSubmit],
  )

  useInput(handleInput)

  const before = value.slice(0, cursor)
  const currentChar = value[cursor] ?? ' '
  const after = value.slice(Math.min(cursor + 1, value.length))
  const cursorColor = disabled ? 'gray' : 'cyan'

  return (
    <Box marginTop={1}>
      {/* ◇ */}
      <Text color={cursorColor}>❯ </Text>
      <Text>{before}</Text>
      <Text inverse>{currentChar}</Text>
      <Text>{after}</Text>
    </Box>
  )
}
