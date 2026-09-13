import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/tasks')({
  loader: () => window.desktop.tasks.getOverview(),
  component: TasksPage,
})

function TasksPage() {
  const { tasks, device, loadedAt } = Route.useLoaderData()
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)
  async function refresh() {
    setRefreshing(true)
    try { await router.invalidate() } finally { setRefreshing(false) }
  }
  return <>
    <header className="page-header"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Tasks</h1><p>A little clarity for everything on your list.</p></div><button onClick={() => void refresh()} disabled={refreshing}>{refreshing ? 'Refreshing…' : '↻ Refresh'}</button></header>
    <div className="stats-grid">
      <div className="stat"><span>Total tasks</span><strong>{tasks.length}</strong></div>
      <div className="stat"><span>In progress</span><strong>{tasks.filter(task => task.status === 'In progress').length}</strong></div>
      <div className="stat"><span>Completed</span><strong>{tasks.filter(task => task.status === 'Done').length}</strong></div>
    </div>
    <section className="panel"><div className="panel-heading"><h2>All tasks</h2><span className="subtle">Sample data</span></div>
      {tasks.length === 0 ? <p className="state-message">No tasks yet.</p> : <div className="table-scroll"><table><thead><tr><th>Task name</th><th>Project</th><th>Status</th></tr></thead><tbody>{tasks.map(task => <tr key={task.id}><td><span className={`task-check ${task.status === 'Done' ? 'checked' : ''}`} aria-hidden="true">{task.status === 'Done' ? '✓' : ''}</span>{task.title}</td><td className="subtle">{task.project}</td><td><span className={`badge ${task.status === 'Done' ? 'green' : task.status === 'In progress' ? 'purple' : ''}`}>{task.status}</span></td></tr>)}</tbody></table></div>}
    </section>
    <section className="device-card"><div className="device-icon" aria-hidden="true">▣</div><div><h2>Connected to your device</h2><p>{device.hostname} · {device.platform} · {device.architecture}</p><small>Last refreshed at {new Date(loadedAt).toLocaleTimeString()}</small></div><span className="connection-dot" title="Device information loaded" /></section>
  </>
}
