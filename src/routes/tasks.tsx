import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/tasks")({
  loader: () => window.desktop.tasks.getOverview(),
  component: TasksPage,
});

function TasksPage() {
  const { tasks, device } = Route.useLoaderData();

  return (
    <section className="max-w-xl space-y-4">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-lg font-medium">Tasks</h1>
      </header>
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between gap-4 py-2">
              <span>{task.title}</span>
              <span className="shrink-0 text-gray-500">{task.status}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-500">
        Device: {device.hostname} ({device.platform})
      </p>
    </section>
  );
}
