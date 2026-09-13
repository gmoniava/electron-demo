import os from 'node:os'
import type { TasksOverview } from '../shared/api'

export function getTasksOverview(): TasksOverview {
  return {
    tasks: [
      { id: 'task-1', title: 'Plan the next release', project: 'Product', status: 'In progress' },
      { id: 'task-2', title: 'Review the contact directory', project: 'Operations', status: 'To do' },
      { id: 'task-3', title: 'Set up your workspace', project: 'Getting started', status: 'Done' },
    ],
    // Real OS data is read only in Electron's main process.
    device: { hostname: os.hostname(), platform: os.platform(), architecture: os.arch() },
    loadedAt: new Date().toISOString(),
  }
}
