import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { migrations } from "./migrations";
import { runMigrations } from "./migrations/run";

let database: DatabaseSync | undefined;

export function initializeDatabase(filePath: string): void {
  // Already initialized in this process.
  if (database) return;

  mkdirSync(path.dirname(filePath), { recursive: true });
  const connection = new DatabaseSync(filePath);
  try {
    connection.exec("PRAGMA busy_timeout = 5000");
    runMigrations(connection, migrations);
    database = connection;
  } catch (error) {
    connection.close();
    throw error;
  }
}

export function getDatabase(): DatabaseSync {
  if (!database) throw new Error("Database has not been initialized");
  return database;
}

export function closeDatabase(): void {
  database?.close();
  database = undefined;
}
