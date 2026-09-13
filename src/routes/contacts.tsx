import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contacts')({
  loader: () => window.desktop.contacts.list(),
  component: ContactsPage,
})

function ContactsPage() {
  const contacts = Route.useLoaderData()
  return <>
    <header className="page-header"><div><p className="eyebrow">YOUR WORKSPACE</p><h1>Contacts</h1><p>The people who make things happen.</p></div><span className="badge purple">{contacts.length} contacts</span></header>
    <section className="panel"><div className="panel-heading"><h2>Your people</h2><span className="subtle">Sample data</span></div>
      {contacts.length === 0 ? <p className="state-message">No contacts yet.</p> : <div className="contacts-list">{contacts.map(contact => <article className="contact-row" key={contact.id}><span className="avatar">{contact.name.split(' ').map(part => part[0]).join('')}</span><div><h3>{contact.name}</h3><p>{contact.role}</p></div><span className="contact-email">{contact.email}</span></article>)}</div>}
    </section>
  </>
}
