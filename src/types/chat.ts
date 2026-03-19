export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function'
  content: string
}
