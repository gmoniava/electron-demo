import type { Task } from "../shared/api";
import { getDatabase } from "./database";

export function getTasks(): Promise<Task[]> {
  return getDatabase().prepare("SELECT id, title, project, status FROM tasks ORDER BY id").all() as unknown as Promise<
    Task[]
  >;
}
