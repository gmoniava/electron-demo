import type { Contact } from '../shared/api'

export function listContacts(): Contact[] {
  return [
    { id: 'contact-1', name: 'Alex Morgan', role: 'Product designer', email: 'alex@example.com' },
    { id: 'contact-2', name: 'Jamie Chen', role: 'Software engineer', email: 'jamie@example.com' },
    { id: 'contact-3', name: 'Sam Rivera', role: 'Project manager', email: 'sam@example.com' },
  ]
}
