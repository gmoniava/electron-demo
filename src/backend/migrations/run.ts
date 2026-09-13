import type { DatabaseSync } from "node:sqlite";
import type { Migration } from "./types";

// Each migration is one database change, such as creating a table or adding a column.
// SQLite's `user_version` stores the last migration that was completed.
// We skip older migrations and only run the ones this database is missing.
export function runMigrations(database: DatabaseSync, migrations: readonly Migration[]): void {
  // Migrations must be numbered 1, 2, 3, ... with no gaps,
  // so the database version always matches the migration's position in this list.
  migrations.forEach((migration, index) => {
    if (migration.version !== index + 1) {
      throw new Error("Migrations must have consecutive versions starting at 1");
    }
  });

  // Acquire the write lock before reading the version so concurrent app
  // instances cannot both try to upgrade the database at the same time.
  database.exec("BEGIN IMMEDIATE");

  try {
    const version = database.prepare("PRAGMA user_version").get()?.user_version;

    // Reject corrupted, invalid, or newer-than-supported database versions.
    if (typeof version !== "number" || !Number.isInteger(version) || version < 0 || version > migrations.length) {
      throw new Error(`Unsupported database version: ${version}`);
    }

    // Skip migrations the database has already completed.
    for (const migration of migrations.slice(version)) {
      try {
        migration.up(database);
        migration.seed?.(database);

        // Only advance the version after the migration succeeds.
        database.exec(`PRAGMA user_version = ${migration.version}`);
      } catch (error) {
        throw new Error(`Migration ${migration.version} (${migration.name}) failed`, { cause: error });
      }
    }

    database.exec("COMMIT");
  } catch (error) {
    // Schema, seed data, and version changes roll back together.
    database.exec("ROLLBACK");
    throw error;
  }
}
