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
  Task,
  CreateTask,
  TaskStatus
} from "../types/tasks"
import { useState, useEffect } from "react"
import { createNote } from "../api/notes"

function useTasks(
  token: string,
  filter: TaskStatusFilter,
  priority: TaskPriorityFilter,
  order: SortOrder,
  projectId?: number,
  page = 1
) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalItems: 0,
    totalPages: 0
  })
  const [tasksLoading, setTasksLoading] = useState(false)
  const [addTaskLoading, setAddTaskLoading] = useState(false)
  const [udpateTaskLoading, setUpdateTaskLoading] = useState(false)
  const [removeTaskLoading, setRemoveTaskLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const handleFetchTasks = async () => {
      try {
        setError("")
        setTasksLoading(true)
        if (projectId) {
          const response = await getTasksByProject(
            projectId,
            token,
            filter,
            priority,
            order,
            page
          )
          setTasks(response.data)
          setPagination(response.pagination)
        } else {
          const response = await getTasks(token, filter, priority, order, page)
          setTasks(response.data)
          setPagination(response.pagination)
        }
      } catch (e) {
        setError("Failed to fetch tasks")
        console.log(e)
      } finally {
        setTasksLoading(false)
      }
    }
    handleFetchTasks()
  }, [token, filter, priority, order, page, projectId])

  const addTask = async (newTask: CreateTask, notes: string[]) => {
    try {
      setError("")
      setAddTaskLoading(true)
      const response = await createTask(token, newTask)
      for (const content of notes) {
        await createNote(token, { content: content, taskId: response.id })
      }

      if (projectId) {
        const response = await getTasksByProject(
          Number(projectId),
          token,
          filter,
          priority,
          order,
          page
        )

        setTasks(response.data)
        setPagination(response.pagination)
      } else {
        const response = await getTasks(token, filter, priority, order, page)

        setTasks(response.data)
        setPagination(response.pagination)
      }

      return true
    } catch (e) {
      setError("Failed to add task")
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
      setError("")
      setUpdateTaskLoading(true)

      await updateTaskData(taskId, field, data, token)

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? { ...task, [field]: data } : task
        )
      )
      return true
    } catch (e) {
      setError("Failed to update task")
      console.log(e)
      return false
    } finally {
      setUpdateTaskLoading(false)
    }
  }

  const removeTask = async (taskId: number) => {
    try {
      setError("")
      setRemoveTaskLoading(true)
      await deleteTask(taskId, token)

      const updatedTasks = await getTasksByProject(
        Number(projectId),
        token,
        "all",
        "all",
        "asc"
      )
      setTasks(updatedTasks.data)
      return true
    } catch (e) {
      setError("Failed to delete task")
      console.log(e)

      return false
    } finally {
      setRemoveTaskLoading(false)
    }
  }

  return {
    tasks,
    pagination,
    tasksLoading,
    addTaskLoading,
    udpateTaskLoading,
    removeTaskLoading,
    error,
    addTask,
    updateTask,
    removeTask
  }
}

export default useTasks
