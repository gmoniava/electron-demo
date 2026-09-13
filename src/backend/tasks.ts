import os from 'node:os'
import type { Task, TasksOverview } from '../shared/api'
import { getDatabase } from './database'

export function getTasksOverview(): TasksOverview {
  return {
    // The schema enforces text fields and the allowed task statuses.
    tasks: getDatabase()
      .prepare('SELECT id, title, project, status FROM tasks ORDER BY id')
      .all() as unknown as Task[],
    // Real OS data is read only in Electron's main process.
    device: { hostname: os.hostname(), platform: os.platform(), architecture: os.arch() },
    loadedAt: new Date().toISOString(),
  }
}
