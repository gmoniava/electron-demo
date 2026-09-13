# Database migrations

`database.ts` manages the connection. This directory owns schema changes and
optional initial data. `run.ts` applies pending migrations in a transaction,
tracking progress with SQLite's `PRAGMA user_version`.

## Add a table that starts empty

1. Create `003-notes.ts` (use the next available version).
2. Export a migration with `version`, `name`, and `up`:

```ts
import type { Migration } from "./types";

export const notesMigration: Migration = {
  version: 3,
  name: "Create notes",
  up(database) {
    database.exec(`
      CREATE TABLE notes (
        id TEXT PRIMARY KEY NOT NULL,
        body TEXT NOT NULL
      ) STRICT;
    `);
  },
};
```

3. Import it and append it to `migrations` in `index.ts`.

No `seed` function means no initial rows. When initial data is needed, add an
optional `seed(database)` function with prepared inserts. It runs only when that
migration first applies, not on every startup or when the table becomes empty.

## Change an existing table

Append another numbered migration containing the appropriate `ALTER TABLE`,
index creation, or data transformation. A migration represents a change, not
necessarily a new table. Never modify, remove, or reorder an already applied
migration; existing databases will not rerun it.

Versions must be consecutive from 1. The runner rejects databases from newer
app versions, and rolls back all pending changes if any schema or seed step
fails. Migration functions must be synchronous and must not open their own
transactions or change `user_version`.

Versions 1 and 2 preserve the original contacts/tasks schemas and sample data,
so existing databases remain compatible and their data is preserved.
