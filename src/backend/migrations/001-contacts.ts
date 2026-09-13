import type { Migration } from "./types";

export const contactsMigration: Migration = {
  version: 1,
  name: "Create contacts",
  up(database) {
    database.exec(`
      CREATE TABLE contacts (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      ) STRICT;
    `);
  },
  seed(database) {
    const insert = database.prepare("INSERT INTO contacts (id, name, role, email) VALUES (?, ?, ?, ?)");
    insert.run("contact-1", "Alex Morgan", "Product designer", "alex@example.com");
    insert.run("contact-2", "Jamie Chen", "Software engineer", "jamie@example.com");
    insert.run("contact-3", "Sam Rivera", "Project manager", "sam@example.com");
  },
};
