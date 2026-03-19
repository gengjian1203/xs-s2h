import type { ActionId, ActionOption, TaskResult } from '@/types/actions.js'

export const actionOptions: ActionOption[] = [
  {
    id: 'init',
    label: '初始化项目',
    description: '创建基础目录、配置文件与默认任务流',
  },
  {
    id: 'status',
    label: '查看状态',
    description: '检查当前环境、任务队列与最近一次执行记录',
  },
  {
    id: 'exit',
    label: '退出',
    description: '关闭当前演示程序',
  },
]

export const actionLabels: Record<ActionId, string> = {
  init: '初始化项目',
  status: '查看状态',
  exit: '退出',
}

export const resultsByAction: Record<Exclude<ActionId, 'exit'>, TaskResult> = {
  init: {
    title: '初始化完成',
    summary: '已生成演示用项目骨架，所有关键步骤均已模拟完成。',
    tasks: [
      { label: '创建 src/ 与 config/ 目录', status: 'done' },
      { label: '写入 TypeScript 基础配置', status: 'done' },
      { label: '注册默认脚本与命令入口', status: 'done' },
      { label: '准备后续扩展任务位', status: 'info' },
    ],
  },
  status: {
    title: '状态检查完成',
    summary: '当前环境稳定，可继续执行后续演示任务。',
    tasks: [
      { label: 'Node.js 运行时已就绪', status: 'done' },
      { label: 'CLI UI 层状态正常', status: 'done' },
      { label: '最近一次任务记录已同步', status: 'done' },
      { label: '无待处理阻塞项', status: 'info' },
    ],
  },
}
