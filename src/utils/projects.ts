import { type Task } from "../types/tasks"
import {
  type ProjectApiResponse,
  type ProjectStatusFilter
} from "../types/projects"

export function calculateProgress(
  projectId: number,
  tasks: Task[] | undefined | null
) {
  if (!tasks) return 0

  const projectTasks = tasks.filter((task) => task.projectId === projectId)

  if (projectTasks.length === 0) return 0

  const completedTasksNum = projectTasks.filter(
    (task) => task.status === "completed"
  ).length

  return Math.round((completedTasksNum / projectTasks.length) * 100)
}

export function getOngoingProjects(
  projects: ProjectApiResponse[],
  tasks: Task[]
) {
  const onGoionProjects = projects.filter(
    (project) =>
      !project.cancelled && calculateProgress(project.id, tasks) < 100
  )

  return onGoionProjects
}


export function getProjectFilter(
  value: string | undefined | null
): ProjectStatusFilter {
  switch (value) {
    case "cancelled":
    case "active":
    case "completed":
    case "overdue":
      return value
    default:
      return "all"
  }
}
