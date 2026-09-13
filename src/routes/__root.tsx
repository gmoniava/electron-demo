import { createRootRoute, Link, Outlet, useRouter } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: MainLayout,
  pendingComponent: () => <p className="state-message">Loading your workspace…</p>,
  errorComponent: RouteError,
})

function RouteError() {
  const router = useRouter()
  return <div className="state-message" role="alert">
    <h2>Unable to load this page</h2>
    <p>Please try again. This workspace needs to run in the desktop app.</p>
    <button onClick={() => void router.invalidate()}>Try again</button>
  </div>
}

function MainLayout() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">w</span>Workspace</div>
        <p className="nav-label">WORKSPACE</p>
        <nav aria-label="Main navigation">
          <Link to="/tasks" activeProps={{ className: 'nav-item active', 'aria-current': 'page' }} className="nav-item"><span aria-hidden="true">☑</span>Tasks</Link>
          <Link to="/contacts" activeProps={{ className: 'nav-item active', 'aria-current': 'page' }} className="nav-item"><span aria-hidden="true">◎</span>Contacts</Link>
        </nav>
        <div className="sidebar-footer"><span className="avatar">G</span><div>My workspace<small>Personal space</small></div></div>
      </aside>
      <main className="main-content"><Outlet /></main>
    </div>
  )
}
