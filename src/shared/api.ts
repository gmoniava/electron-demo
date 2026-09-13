export interface Task {
  id: string
  title: string
  project: string
  status: 'In progress' | 'To do' | 'Done'
}

export interface TasksOverview {
  tasks: Task[]
  device: { hostname: string; platform: string; architecture: string }
  loadedAt: string
}

export interface Contact {
  id: string
  name: string
  role: string
  email: string
}

export interface DesktopApi {
  tasks: { getOverview: () => Promise<TasksOverview> }
  contacts: { list: () => Promise<Contact[]> }
}

export const IPC_CHANNELS = {
  tasks: { getOverview: 'tasks:get-overview' },
  contacts: { list: 'contacts:list' },
} as const
