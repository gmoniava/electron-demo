import { createRootRoute, Link, Outlet, useRouter } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: MainLayout,
  pendingComponent: () => <p className="p-4">Loading…</p>,
  errorComponent: RouteError,
})

function RouteError() {
  const router = useRouter()
  return (
    <div className="space-y-2 p-4" role="alert">
      <p>Unable to load this page. Please try again in the desktop app.</p>
      <button className="rounded border border-gray-300 px-3 py-1 hover:bg-gray-100" onClick={() => void router.invalidate()}>
        Try again
      </button>
    </div>
  )
}

function MainLayout() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-sm text-gray-900">
      <aside className="w-40 shrink-0 border-r border-gray-200 p-4">
        <nav aria-label="Main navigation" className="space-y-1">
          <Link to="/tasks" className="block rounded px-3 py-2 hover:bg-gray-100" activeProps={{ className: 'bg-gray-100 font-medium', 'aria-current': 'page' }}>
            Tasks
          </Link>
          <Link to="/contacts" className="block rounded px-3 py-2 hover:bg-gray-100" activeProps={{ className: 'bg-gray-100 font-medium', 'aria-current': 'page' }}>
            Contacts
          </Link>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-6"><Outlet /></main>
    </div>
  )
}
