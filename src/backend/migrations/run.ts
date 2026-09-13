import type { DatabaseSync } from "node:sqlite";
import type { Migration } from "./types";

export function runMigrations(database: DatabaseSync, migrations: readonly Migration[]): void {
  migrations.forEach((migration, index) => {
    if (migration.version !== index + 1) {
      throw new Error("Migrations must have consecutive versions starting at 1");
    }
  });

  // Read the version after acquiring the write lock to avoid concurrent upgrades.
  database.exec("BEGIN IMMEDIATE");
  try {
    const version = database.prepare("PRAGMA user_version").get()?.user_version;
    if (typeof version !== "number" || !Number.isInteger(version) || version < 0 || version > migrations.length) {
      throw new Error(`Unsupported database version: ${version}`);
    }

    for (const migration of migrations.slice(version)) {
      try {
        migration.up(database);
        migration.seed?.(database);
        database.exec(`PRAGMA user_version = ${migration.version}`);
      } catch (error) {
        throw new Error(`Migration ${migration.version} (${migration.name}) failed`, { cause: error });
      }
    }
    database.exec("COMMIT");
  } catch (error) {
    // Schema, data, and version changes all roll back together.
    database.exec("ROLLBACK");
    throw error;
  }
}
