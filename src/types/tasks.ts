export type Task = {
  id: number
  name: string
  projectId: number
  status: TaskStatus
  priority: TaskPriority
  dueDate: string
  description: string
}

export type CreateTask = {
  name: string
  projectId: number
  status: TaskStatus
  priority: TaskPriority | string
  dueDate: string
  description: string
}

export type TaskApiResponse = {
  data: Task[]
  pagination: {
    currentPage: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

export type TaskCardProps = {
  id: number
  name: string
  projectName: string | undefined
  status: TaskStatus
  dueDate: string
  priority: TaskPriority
  onStatusChange?: (taskId: number, newStatus: TaskStatus) => void
}

export type TaskStatus = "open" | "completed"
export type TaskPriority = "high" | "medium" | "low"
export type TaskPriorityFilter = "all" | "high" | "medium" | "low"
export type TaskStatusFilter = "all" | "open" | "completed" | "overdue"
