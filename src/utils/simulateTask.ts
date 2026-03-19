import { oraPromise } from 'ora'

import { actionLabels, resultsByAction } from '@/const/actions.js'
import type { ActionId, TaskResult } from '@/types/actions.js'

export const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })

export async function simulateTask(actionId: Exclude<ActionId, 'exit'>): Promise<TaskResult> {
  await oraPromise(sleep(5000), {
    text: `${actionLabels[actionId]}中...`,
    color: 'cyan',
    spinner: 'dots',
  })

  return resultsByAction[actionId]
}
