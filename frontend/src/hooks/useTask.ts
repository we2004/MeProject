import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { type Task, type TaskStatus } from "../types/tasks"
import { deleteTask, getTaskById, updateTaskData } from "../api/tasks"
import type { EditInfoFields } from "../types/common"
import type { TaskApiResponse } from "../types/tasks"

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
      queryClient.setQueriesData<TaskApiResponse>(
        { queryKey: ["tasks", token] },
        (current) =>
          current && {
            ...current,
            data: current.data.map((task) =>
              task.id === taskId ? { ...task, [field]: data } : task
            )
          }
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
