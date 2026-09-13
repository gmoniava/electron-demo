import { ipcMain } from 'electron'
import { IPC_CHANNELS } from '../shared/api'
import { getTasksOverview } from './tasks'
import { listContacts } from './contacts'

// Register once at startup. Each feature owns its backend implementation.
export function registerIpcHandlers() {
  ipcMain.handle(IPC_CHANNELS.tasks.getOverview, () => getTasksOverview())
  ipcMain.handle(IPC_CHANNELS.contacts.list, () => listContacts())
}
