import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

let database: DatabaseSync | undefined;

export function initializeDatabase(filePath: string): void {
  // Already initialized in this process
  if (database) return;

  // Make sure the DB folder exists
  mkdirSync(path.dirname(filePath), { recursive: true });

  // Open/create the SQLite database
  const connection = new DatabaseSync(filePath);

  try {
    // Wait briefly if the DB is locked
    connection.exec("PRAGMA busy_timeout = 5000");

    // Start a write transaction
    connection.exec("BEGIN IMMEDIATE");

    try {
      // Read schema version
      const version = connection.prepare("PRAGMA user_version").get()?.user_version;

      if (version !== 0 && version !== 1 && version !== 2) {
        throw new Error(`Unsupported database version: ${version}`);
      }

      if (version === 0) {
        // First-time database setup
        connection.exec(`
          CREATE TABLE contacts (
            id TEXT PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
          ) STRICT;
        `);

        // Prepare reusable insert statement
        const insert = connection.prepare("INSERT INTO contacts (id, name, role, email) VALUES (?, ?, ?, ?)");

        // Seed initial data
        insert.run("contact-1", "Alex Morgan", "Product designer", "alex@example.com");
        insert.run("contact-2", "Jamie Chen", "Software engineer", "jamie@example.com");
        insert.run("contact-3", "Sam Rivera", "Project manager", "sam@example.com");

        // Mark migration as complete
        connection.exec("PRAGMA user_version = 1");
      }

      // Add tasks to both new databases and existing contacts-only databases.
      if (version === 0 || version === 1) {
        connection.exec(`
          CREATE TABLE tasks (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            project TEXT NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('In progress', 'To do', 'Done'))
          ) STRICT;
        `);

        const insert = connection.prepare("INSERT INTO tasks (id, title, project, status) VALUES (?, ?, ?, ?)");
        insert.run("task-1", "Plan the next release", "Product", "In progress");
        insert.run("task-2", "Review the contact directory", "Operations", "To do");
        insert.run("task-3", "Set up your workspace", "Getting started", "Done");
        // Seed only once so subsequent edits and deletions persist.
        connection.exec("PRAGMA user_version = 2");
      }

      // Save transaction
      connection.exec("COMMIT");
    } catch (error) {
      // Undo failed migration
      connection.exec("ROLLBACK");
      throw error;
    }

    // Store the active connection
    database = connection;
  } catch (error) {
    connection.close();
    throw error;
  }
}

export function getDatabase(): DatabaseSync {
  // DB must be initialized first
  if (!database) throw new Error("Database has not been initialized");

  return database;
}

export function closeDatabase(): void {
  // Close and reset connection
  database?.close();
  database = undefined;
}
