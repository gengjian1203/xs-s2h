export type ActionId = 'init' | 'status' | 'exit'

export interface ActionOption {
  id: ActionId
  label: string
  description: string
}

export interface TaskItem {
  label: string
  status: 'done' | 'info'
}

export interface TaskResult {
  title: string
  summary: string
  tasks: TaskItem[]
}

export interface ActionMenuProps {
  options: ActionOption[]
  selectedIndex: number
  onChange: (index: number) => void
  onSubmit: () => void
}
