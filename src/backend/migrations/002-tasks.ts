import type { Migration } from "./types";

export const tasksMigration: Migration = {
  version: 2,
  name: "Create tasks",
  up(database) {
    database.exec(`
      CREATE TABLE tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        project TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('In progress', 'To do', 'Done'))
      ) STRICT;
    `);
  },
  seed(database) {
    const insert = database.prepare("INSERT INTO tasks (id, title, project, status) VALUES (?, ?, ?, ?)");
    insert.run("task-1", "Plan the next release", "Product", "In progress");
    insert.run("task-2", "Review the contact directory", "Operations", "To do");
    insert.run("task-3", "Set up your workspace", "Getting started", "Done");
  },
};
