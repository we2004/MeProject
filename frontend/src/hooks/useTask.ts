import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { type TaskStatus } from "../types/tasks"
import { deleteTask, getTaskById, updateTaskData } from "../api/tasks"
import type { EditInfoFields } from "../types/common"
import type { Task, TaskApiResponse } from "../types/tasks"

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

function useTask(token: string, taskId: number) {
  const queryClient = useQueryClient()
  const [updateTaskLoading, setUpdateTaskLoading] = useState(false)
  const [removeTaskLoading, setRemoveTaskLoading] = useState(false)
  const [mutationError, setMutationError] = useState("")

  const taskQuery = useQuery<Task>({
    queryKey: ["task", token, taskId],
    queryFn: () => getTaskById(taskId, token),
    enabled: Boolean(token && taskId),
    initialData: () =>
      queryClient
        .getQueriesData<TaskApiResponse>({
          queryKey: ["tasks", token]
        })
        .flatMap(([, response]) => response?.data ?? [])
        .find((task) => task.id === taskId),
    initialDataUpdatedAt: 0
  })

  const updateTask = async (
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus
  ) => {
    try {
      setMutationError("")
      setUpdateTaskLoading(true)
      await updateTaskData(taskId, field, data, token)

      queryClient.setQueryData<Task>(
        ["task", token, taskId],
        (currentTask) =>
          currentTask ? { ...currentTask, [field]: data } : currentTask
      )
      queryClient.setQueriesData<unknown>(
        { queryKey: ["tasks", token] },
        (current: unknown) => updateCachedTasks(current, taskId, field, data)
      )
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["task", token, taskId] }),
        queryClient.invalidateQueries({ queryKey: ["tasks", token] }),
        queryClient.invalidateQueries({ queryKey: ["projects", token] }),
        queryClient.invalidateQueries({ queryKey: ["project", token] })
      ])
      return true
    } catch (e) {
      setMutationError("Failed to update task")
      console.log(e)
      return false
    } finally {
      setUpdateTaskLoading(false)
    }
  }

  const removeTask = async () => {
    try {
      setMutationError("")
      setRemoveTaskLoading(true)
      await deleteTask(taskId, token)

      queryClient.removeQueries({ queryKey: ["task", token, taskId] })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tasks", token] }),
        queryClient.invalidateQueries({ queryKey: ["projects", token] }),
        queryClient.invalidateQueries({ queryKey: ["project", token] }),
        queryClient.removeQueries({ queryKey: ["notes", token, taskId] })
      ])
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
    task: taskQuery.data ?? null,
    taskLoading: taskQuery.isLoading,
    updateTaskLoading,
    removeTaskLoading,
    error: taskQuery.isError
      ? "Failed to fetch task"
      : mutationError,
    updateTask,
    removeTask
  }
}

export default useTask
