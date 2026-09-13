import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contacts')({
  loader: () => window.desktop.contacts.list(),
  component: ContactsPage,
})

function ContactsPage() {
  const contacts = Route.useLoaderData()
  return (
    <section className="max-w-xl space-y-4">
      <h1 className="text-lg font-medium">Contacts</h1>
      {contacts.length === 0 ? <p>No contacts yet.</p> : (
        <ul className="divide-y divide-gray-200">
          {contacts.map(contact => (
            <li key={contact.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2">
              <span>{contact.name}</span>
              <span className="text-gray-500">{contact.email}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
