import { type Task } from "../types/tasks"
import {
  type Project,
  type ProjectApiResponse,
  type ProjectStatusFilter
} from "../types/projects"
import dayjs from "dayjs"
import { type SortOrder } from "../types/common"

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

export function sortProjectsByDueDate(
  projects: Project[],
  sortOrder: SortOrder = "asc"
) {
  return [...projects].sort((a, b) =>
    sortOrder === "asc"
      ? dayjs(a.dueDate).diff(dayjs(b.dueDate))
      : dayjs(b.dueDate).diff(dayjs(a.dueDate))
  )
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

export function getDisplayedProjectStat(
  cancelled: boolean | undefined,
  progress: number,
  dueDate: string | undefined
) {
  let displayedStat: ProjectStatusFilter
  if (cancelled) displayedStat = "cancelled"
  else if (progress === 100) displayedStat = "completed"
  else if (dayjs(dueDate).isBefore(dayjs(), "day")) displayedStat = "overdue"
  else displayedStat = "active"

  return displayedStat
}

export function getOverdueProjets(projects: ProjectApiResponse[], tasks: Task[]) {
  const activeProjects = projects.filter(
    (project) =>
      calculateProgress(project.id, tasks) !== 100 && !project.cancelled
  )
  return activeProjects.filter((project) =>
    dayjs(project.dueDate).isBefore(dayjs(), "day")
  )
}

export function getActiveProjects(projects: ProjectApiResponse[], tasks: Task[]) {
  const activeProjects = projects.filter(
    (project) =>
      calculateProgress(project.id, tasks) !== 100 && !project.cancelled
  )

  return activeProjects.filter(
    (project) => !dayjs(project.dueDate).isBefore(dayjs(), "day")
  )
}

export function filterProjectsByStat(
  projects: ProjectApiResponse[],
  filter: ProjectStatusFilter,
  tasks: Task[]
) {
  switch (filter) {
    case "cancelled":
      return projects.filter((project) => project.cancelled)
    case "active":
      return getActiveProjects(projects, tasks)
    case "overdue":
      return getOverdueProjets(projects, tasks)

    case "completed":
      return projects.filter(
        (project) =>
          calculateProgress(project.id, tasks) === 100 && !project.cancelled
      )

    default:
      return projects
  }
}

export function getPageProjects(
  projects: ProjectApiResponse[],
  filter: ProjectStatusFilter,
  order: SortOrder,
  tasks: Task[]
) {
  const filteredProjects = filterProjectsByStat(projects, filter, tasks)

  return sortProjectsByDueDate(filteredProjects, order)
}
