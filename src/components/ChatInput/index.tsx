import { Box, Text, useInput, useStdout } from 'ink'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { filterCommands } from '@/commands/registry.js'

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
  suggestionIndex: number
}

const INIT_STATE: InputState = {
  value: '',
  cursor: 0,
  draft: '',
  history: [],
  historyIndex: -1,
  suggestionIndex: 0,
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
  tab: boolean
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

export function ChatInput({ disabled, onSubmit }: ChatInputProps) {
  const [state, setState] = useState<InputState>(INIT_STATE)
  const { value, cursor, suggestionIndex } = state

  // 斜杠命令补全
  const suggestions = useMemo(() => {
    if (!value.startsWith('/') || value.includes(' ')) return []
    return filterCommands(value)
  }, [value])

  const showSuggestions = suggestions.length > 0 && value.length > 0

  const handleInput = useCallback(
    (input: string, key: InputKey) => {
      // Tab 补全
      if (key.tab && showSuggestions) {
        setState((s) => {
          const cmd = suggestions[s.suggestionIndex]
          if (!cmd) return s
          const completed = `/${cmd.name} `
          return {
            ...s,
            value: completed,
            cursor: completed.length,
            suggestionIndex: 0,
          }
        })
        return
      }

      if (key.return) {
        if (disabled) {
          return
        }

        // 补全列表显示时，回车 = 选中补全项
        if (showSuggestions) {
          setState((s) => {
            const cmd = suggestions[s.suggestionIndex]
            if (!cmd) return s
            const completed = `/${cmd.name} `
            return {
              ...s,
              value: completed,
              cursor: completed.length,
              suggestionIndex: 0,
            }
          })
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
            suggestionIndex: 0,
          }
        })
        return
      }

      if (key.upArrow) {
        if (showSuggestions) {
          // 在补全列表中上移
          setState((s) => ({
            ...s,
            suggestionIndex: Math.max(0, s.suggestionIndex - 1),
          }))
          return
        }
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
        if (showSuggestions) {
          // 在补全列表中下移
          setState((s) => ({
            ...s,
            suggestionIndex: Math.min(suggestions.length - 1, s.suggestionIndex + 1),
          }))
          return
        }
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
            suggestionIndex: 0,
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
            suggestionIndex: 0,
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
          suggestionIndex: 0,
          value: replaceRange(s.value, s.cursor, s.cursor, input),
          cursor: s.cursor + input.length,
        }))
      }
    },
    [disabled, onSubmit, showSuggestions, suggestions],
  )

  useInput(handleInput)

  const before = value.slice(0, cursor)
  const currentChar = value[cursor] ?? ' '
  const after = value.slice(Math.min(cursor + 1, value.length))
  const cursorColor = disabled ? 'gray' : 'cyan'
  const { stdout } = useStdout()
  const [columns, setColumns] = useState(stdout.columns ?? 80)

  useEffect(() => {
    const onResize = () => setColumns(stdout.columns ?? 80)
    stdout.on('resize', onResize)
    return () => {
      stdout.off('resize', onResize)
    }
  }, [stdout])

  const divider = '─'.repeat(Math.floor(columns - 2))

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* 输入行 */}
      <Box flexDirection="column">
        <Text dimColor>{divider}</Text>
        <Box flexDirection="row">
          <Text color={cursorColor}>❯ </Text>
          <Text>{before}</Text>
          <Text inverse>{currentChar}</Text>
          <Text>{after}</Text>
        </Box>
        <Text dimColor>{divider}</Text>
      </Box>
      {/* 斜杠命令补全提示 */}
      {showSuggestions && (
        <Box flexDirection="column" marginBottom={0}>
          {suggestions.map((cmd, i) => (
            <Text color={i === suggestionIndex ? 'cyan' : 'gray'} key={cmd.name}>
              {i === suggestionIndex ? '▸ ' : '  '}/{cmd.name}
              {'  '}
              <Text dimColor>{cmd.description}</Text>
            </Text>
          ))}
        </Box>
      )}
    </Box>
  )
}
