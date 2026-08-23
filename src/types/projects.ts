export type Project = {
  name: string
  description: string
  dueDate: string
  cancelled: boolean
  techStack: string[]
}

export type ProjectApiResponse = Project & {
  id: number
  derivedStatus: ProjectStatus
}

export type ProjectCardProps = {
  id: number
  name: string
  description: string
  dueDate: string
  showDaysLeft?: boolean
  derivedStatus: ProjectStatus
}

export type ProjectStatus = "cancelled" | "overdue" | "active" | "completed"
export type ProjectFields =
  | "name"
  | "description"
  | "dueDate"
  | "cancelled"
  | "techStack"

export type ProjectStatusFilter = ProjectStatus | "all"
export type ProjectInfoFields = "name" | "description" | "dueDate"
