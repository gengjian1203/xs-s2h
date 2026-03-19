export type ScreenState = 'menu' | 'running' | 'result' | 'exit'

export interface AppProps {
  initialPrompt?: string
  stdinContent?: string
  onExitMessageChange?: (message: string) => void
}
