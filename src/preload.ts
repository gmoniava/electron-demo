import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS } from './shared/api'
import type { DesktopApi } from './shared/api'

const api: DesktopApi = {
  tasks: { getOverview: () => ipcRenderer.invoke(IPC_CHANNELS.tasks.getOverview) },
  contacts: { list: () => ipcRenderer.invoke(IPC_CHANNELS.contacts.list) },
}

contextBridge.exposeInMainWorld('desktop', api)
