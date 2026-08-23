import {
  getTasks,
  getTasksByProject,
  createTask,
  deleteTask
} from "../api/tasks"
import type { SortOrder } from "../types/common"
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
  projectId?: number
) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const handleFetchTasks = async () => {
      try {
        setLoading(true)
        if (projectId) {
          const response = await getTasksByProject(
            projectId,
            token,
            filter,
            priority,
            order
          )
          setTasks(response.data)
        } else {
          const response = await getTasks(token, filter, priority, order)
          setTasks(response.data)
        }
      } catch (e) {
        setError("Failed to fetch tasks")
      } finally {
        setLoading(false)
      }
    }
    handleFetchTasks()
  }, [token, filter, priority, order, projectId])

  const addTask = async (newTask: CreateTask, notes: string[]) => {
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
        order
      )

      setTasks(response.data)
    } else {
      const response = await getTasks(token, filter, priority, order)

      setTasks(response.data)
    }
  }

  const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    )
  }

  const removeTask = async (taskId: number) => {
    try {
      setLoading(true)
      await deleteTask(taskId, token)

      const updatedTasks = await getTasksByProject(
        Number(projectId),
        token,
        "all",
        "all",
        "asc"
      )
      setTasks(updatedTasks.data)
    } catch (e) {
      setError("Failed to delete task")
    } finally {
      setLoading(false)
    }
  }
  

  return { tasks, loading, error, addTask, updateTaskStatus, removeTask }
}

export default useTasks
