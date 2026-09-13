import { contactsMigration } from "./001-contacts";
import { tasksMigration } from "./002-tasks";
import type { Migration } from "./types";

// Append new migrations here. Explicit imports also include them in packaged builds.
export const migrations: readonly Migration[] = [
  contactsMigration,
  tasksMigration,
];
