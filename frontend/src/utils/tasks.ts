import {
  type Task,
  type TaskStatusFilter,
  type TaskPriorityFilter
} from "../types/tasks"
import dayjs from "dayjs"

export function getOngoingTasks(tasks: Task[]) {
  const onGoionProjects = tasks.filter((task) => task.status != "completed")

  return onGoionProjects
}


export function getOverdueTasks(tasks: Task[]) {
  return tasks.filter(
    (task) =>
      task.status === "open" && dayjs(task.dueDate).isBefore(dayjs(), "day")
  )
}

export function getOpenTasks(tasks: Task[]) {
  return tasks.filter(
    (task) =>
      task.status === "open" && !dayjs(task.dueDate).isBefore(dayjs(), "day")
  )
}

export function getCompletedTasks(tasks: Task[]) {
  return tasks.filter((task) => task.status === "completed")
}

export function getTaskFilter(value: string | null): TaskStatusFilter {
  switch (value) {
    case "open":
    case "completed":
    case "overdue":
      return value
    default:
      return "all"
  }
}

export function getTaskPriority(value: string | null): TaskPriorityFilter {
  switch (value) {
    case "high":
    case "low":
    case "medium":
      return value

    default:
      return "all"
  }
}


