export type ScreenState = 'menu' | 'running' | 'result' | 'exit'

export interface AppProps {
  onExitMessageChange?: (message: string) => void
}
