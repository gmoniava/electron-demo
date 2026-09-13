// Electron bridge tools
import { contextBridge, ipcRenderer } from "electron";

// Shared IPC channel names
import { IPC_CHANNELS } from "./shared/api";

// Type for window.desktop
import type { DesktopApi } from "./shared/api";

// API exposed to the renderer
const api: DesktopApi = {
  tasks: {
    // Ask main process for task overview
    getTasks: () => ipcRenderer.invoke(IPC_CHANNELS.tasks.getTasks),
  },

  contacts: {
    // Ask main process for contacts
    getContacts: () => ipcRenderer.invoke(IPC_CHANNELS.contacts.getContacts),
  },
};

// Makes it available as window.desktop
contextBridge.exposeInMainWorld("desktop", api);
