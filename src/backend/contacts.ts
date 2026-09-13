import type { Contact } from '../shared/api'
import { getDatabase } from './database'

export function listContacts(): Contact[] {
  // The schema guarantees these fields are non-null text values.
  return getDatabase()
    .prepare('SELECT id, name, role, email FROM contacts ORDER BY name COLLATE NOCASE, id')
    .all() as unknown as Contact[]
}
