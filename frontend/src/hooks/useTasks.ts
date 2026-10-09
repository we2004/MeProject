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
  CreateTask,
  TaskStatus
} from "../types/tasks"
import { useState } from "react"
import { createNote } from "../api/notes"
import {
  useQuery,
  useQueryClient
} from "@tanstack/react-query"

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
    try {
      setMutationError("")
      setUpdateTaskLoading(true)

      await updateTaskData(taskId, field, data, token)

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
      await invalidateTaskAndProjectLists()
      return true
    } catch (e) {
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
