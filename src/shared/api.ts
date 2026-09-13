export interface Task {
  id: string;
  title: string;
  project: string;
  status: "In progress" | "To do" | "Done";
}

export interface Contact {
  id: string;
  name: string;
  role: string;
  email: string;
}

export interface DesktopApi {
  tasks: { getTasks: () => Promise<Task[]> };
  contacts: { getContacts: () => Promise<Contact[]> };
}

export const IPC_CHANNELS = {
  tasks: { getTasks: "tasks:getTasks" },
  contacts: { getContacts: "contacts:getContacts" },
} as const;
