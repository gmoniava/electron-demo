import type { DatabaseSync } from "node:sqlite";

export interface Migration {
  version: number;
  name: string;
  up: (database: DatabaseSync) => void;
  // Optional initial data, executed once in the same transaction as the schema.
  seed?: (database: DatabaseSync) => void;
}
