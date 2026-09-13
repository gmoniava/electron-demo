import { ipcMain } from "electron";
import { IPC_CHANNELS } from "../shared/api";
import { getTasks } from "./tasks";
import { getContacts } from "./contacts";

// Register once at startup. Each feature owns its backend implementation.
export function registerIpcHandlers() {
  ipcMain.handle(IPC_CHANNELS.tasks.getTasks, () => getTasks());
  ipcMain.handle(IPC_CHANNELS.contacts.getContacts, () => getContacts());
}
