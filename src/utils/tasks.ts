import {
  type Task,
  type TaskStatusFilter,
  type TaskPriorityFilter
} from "../types/tasks"
import dayjs from "dayjs"
import { type SortOrder } from "../types/common"

export function getOngoingTasks(tasks: Task[]) {
  const onGoionProjects = tasks.filter((task) => task.status != "completed")

  return onGoionProjects
}

export function sortTasksByDueDate(
  tasks: Task[],
  sortOrder: SortOrder = "asc"
) {
  return [...tasks].sort((a, b) =>
    sortOrder === "asc"
      ? dayjs(a.dueDate).diff(dayjs(b.dueDate))
      : dayjs(b.dueDate).diff(dayjs(a.dueDate))
  )
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

export function filterTasksByStat(tasks: Task[], filter: TaskStatusFilter) {
  switch (filter) {
    case "open":
      return getOpenTasks(tasks)
    case "completed":
      return getCompletedTasks(tasks)

    case "overdue":
      return getOverdueTasks(tasks)
    default:
      return tasks
  }
}

export function filterTasksByPriority(
  tasks: Task[],
  priority: TaskPriorityFilter
) {
  if (priority === "all") return tasks
  return tasks.filter((task) => task.priority === priority)
}

export function getTasksByProjectId(tasks: Task[], projectId: string | null | undefined, order:SortOrder='asc') {
  return sortTasksByDueDate(tasks.filter((task) => task.projectId === Number(projectId)), order)
}

export function getPageTasks(
  tasks: Task[],
  filter: TaskStatusFilter,
  order: SortOrder,
  priority: TaskPriorityFilter,
  projectId: string | null | undefined
) {
  const realTasks = projectId ? getTasksByProjectId(tasks, projectId) : tasks
  const filteredTasks = filterTasksByPriority(
    filterTasksByStat(realTasks, filter),
    priority
  )
  return sortTasksByDueDate(filteredTasks, order)
}
