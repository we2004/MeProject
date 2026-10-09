import {
  getTasks,
  getTasksByProject,
  createTask,
  deleteTask,
  updateTaskData
} from "../api/tasks"
import type { EditInfoFields, SortOrder } from "../types/common"
import type {
  TaskPriorityFilter,
  TaskStatusFilter,
  TaskApiResponse,
  Task,
  CreateTask,
  TaskStatus
} from "../types/tasks"
import { useState } from "react"
import { createNote } from "../api/notes"
import {
  useQuery,
  useQueryClient
} from "@tanstack/react-query"

function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false
  const task = value as Record<string, unknown>
  return (
    typeof task.id === "number" &&
    typeof task.name === "string" &&
    typeof task.projectId === "number" &&
    (task.status === "open" || task.status === "completed") &&
    (task.priority === "high" ||
      task.priority === "medium" ||
      task.priority === "low") &&
    typeof task.dueDate === "string" &&
    typeof task.description === "string"
  )
}

function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask)
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return value === "open" || value === "completed"
}

function isTaskPageResponse(value: unknown): value is TaskApiResponse {
  if (!value || typeof value !== "object") return false
  const response = value as Record<string, unknown>
  const pagination = response.pagination
  if (!pagination || typeof pagination !== "object") return false
  const page = pagination as Record<string, unknown>
  return (
    isTaskArray(response.data) &&
    typeof page.currentPage === "number" &&
    typeof page.limit === "number" &&
    typeof page.totalItems === "number" &&
    typeof page.totalPages === "number"
  )
}

function updateCachedTasks(
  current: unknown,
  taskId: number,
  field: EditInfoFields,
  data: string | boolean | string[] | TaskStatus
): unknown {
  if (isTaskArray(current)) {
    return current.map((task) =>
      task.id === taskId ? { ...task, [field]: data } : task
    )
  }

  if (
    current &&
    typeof current === "object" &&
    isTaskPageResponse(current)
  ) {
    return {
      ...current,
      data: current.data.map((task) =>
        task.id === taskId ? { ...task, [field]: data } : task
      )
    }
  }

  return current
}

function useTasks(
  token: string,
  filter: TaskStatusFilter,
  priority: TaskPriorityFilter,
  order: SortOrder,
  projectId?: number,
  page = 1
) {
  const queryClient = useQueryClient()
  const [addTaskLoading, setAddTaskLoading] = useState(false)
  const [udpateTaskLoading, setUpdateTaskLoading] = useState(false)
  const [removeTaskLoading, setRemoveTaskLoading] = useState(false)
  const [mutationError, setMutationError] = useState("")

  const tasksQuery = useQuery<TaskApiResponse>({
    queryKey: ["tasks", token, filter, priority, order, projectId, page],
    queryFn: () =>
      projectId
        ? getTasksByProject(projectId, token, filter, priority, order, page)
        : getTasks(token, filter, priority, order, page),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === token &&
      previousQuery?.queryKey[5] === projectId
        ? previousData
        : undefined
  })

  const invalidateTaskAndProjectLists = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["tasks", token] }),
      queryClient.invalidateQueries({ queryKey: ["projects", token] }),
      queryClient.invalidateQueries({ queryKey: ["project", token] })
    ])
  }

  const addTask = async (newTask: CreateTask, notes: string[]) => {
    try {
      setMutationError("")
      setAddTaskLoading(true)
      const response = await createTask(token, newTask)
      for (const content of notes) {
        await createNote(token, { content: content, taskId: response.id })
      }

      await invalidateTaskAndProjectLists()
      return true
    } catch (e) {
      await invalidateTaskAndProjectLists()
      setMutationError("Failed to add task")
      console.log(e)
      return false
    } finally {
      setAddTaskLoading(false)
    }
  }

  const updateTask = async (
    taskId: number,
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus
  ) => {
    let taskSnapshots: [readonly unknown[], unknown][] | undefined
    let taskSnapshot: Task | undefined

    try {
      setMutationError("")
      setUpdateTaskLoading(true)

      if (field === "status" && isTaskStatus(data)) {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: ["tasks", token] }),
          queryClient.cancelQueries({ queryKey: ["task", token, taskId] })
        ])
        taskSnapshots = queryClient.getQueriesData<unknown>({
          queryKey: ["tasks", token]
        })
        taskSnapshot = queryClient.getQueryData<Task>([
          "task",
          token,
          taskId
        ])

        queryClient.setQueriesData<unknown>(
          { queryKey: ["tasks", token] },
          (current: unknown) => updateCachedTasks(current, taskId, field, data)
        )
        queryClient.setQueryData<Task>(
          ["task", token, taskId],
          (current) =>
            current ? { ...current, [field]: data } : current
        )
      }

      await updateTaskData(taskId, field, data, token)

      if (field === "status" && isTaskStatus(data)) {
        void queryClient.invalidateQueries({
          queryKey: ["task", token, taskId]
        })
        void invalidateTaskAndProjectLists()
      } else {
        queryClient.setQueriesData<unknown>(
          { queryKey: ["tasks", token] },
          (current: unknown) => updateCachedTasks(current, taskId, field, data)
        )
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["task", token, taskId] }),
          invalidateTaskAndProjectLists()
        ])
      }
      return true
    } catch (e) {
      if (field === "status" && isTaskStatus(data) && taskSnapshots) {
        for (const [queryKey, previousData] of taskSnapshots) {
          if (previousData !== undefined) {
            queryClient.setQueryData(queryKey, previousData)
          }
        }
        if (taskSnapshot !== undefined) {
          queryClient.setQueryData(["task", token, taskId], taskSnapshot)
        }
        void queryClient.invalidateQueries({ queryKey: ["task", token, taskId] })
        void invalidateTaskAndProjectLists()
      }
      setMutationError("Failed to update task")
      console.log(e)
      return false
    } finally {
      setUpdateTaskLoading(false)
    }
  }

  const removeTask = async (taskId: number) => {
    try {
      setMutationError("")
      setRemoveTaskLoading(true)
      await deleteTask(taskId, token)
      await invalidateTaskAndProjectLists()
      return true
    } catch (e) {
      setMutationError("Failed to delete task")
      console.log(e)
      return false
    } finally {
      setRemoveTaskLoading(false)
    }
  }

  return {
    tasks: tasksQuery.data?.data ?? [],
    pagination: tasksQuery.data?.pagination ?? {
      currentPage: 1,
      limit: 10,
      totalItems: 0,
      totalPages: 0
    },
    tasksLoading: tasksQuery.isLoading,
    tasksFetching: tasksQuery.isFetching,
    tasksHasData: tasksQuery.data !== undefined,
    addTaskLoading,
    udpateTaskLoading,
    removeTaskLoading,
    error: tasksQuery.isError ? "Failed to fetch tasks" : mutationError,
    addTask,
    updateTask,
    removeTask
  }
}

export default useTasks
