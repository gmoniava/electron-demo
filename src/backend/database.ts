import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { DatabaseSync } from 'node:sqlite'

let database: DatabaseSync | undefined

export function initializeDatabase(filePath: string): void {
  if (database) return

  mkdirSync(path.dirname(filePath), { recursive: true })
  const connection = new DatabaseSync(filePath)
  try {
    connection.exec('PRAGMA busy_timeout = 5000')
    connection.exec('BEGIN IMMEDIATE')
    try {
      const version = connection.prepare('PRAGMA user_version').get()?.user_version
      if (version === 0) {
        connection.exec(`
          CREATE TABLE contacts (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
          ) STRICT;
        `)

        const insert = connection.prepare(
          'INSERT INTO contacts (id, name, role, email) VALUES (?, ?, ?, ?)',
        )
        insert.run('contact-1', 'Alex Morgan', 'Product designer', 'alex@example.com')
        insert.run('contact-2', 'Jamie Chen', 'Software engineer', 'jamie@example.com')
        insert.run('contact-3', 'Sam Rivera', 'Project manager', 'sam@example.com')
        // Seed only during the initial migration, preserving later edits/deletions.
        connection.exec('PRAGMA user_version = 1')
      } else if (version !== 1) {
        throw new Error(`Unsupported database version: ${version}`)
      }
      connection.exec('COMMIT')
    } catch (error) {
      connection.exec('ROLLBACK')
      throw error
    }
    database = connection
  } catch (error) {
    connection.close()
    throw error
  }
}

export function getDatabase(): DatabaseSync {
  if (!database) throw new Error('Database has not been initialized')
  return database
}

export function closeDatabase(): void {
  database?.close()
  database = undefined
}
