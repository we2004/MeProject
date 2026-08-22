import { useState, useEffect } from "react"
import {
  type TaskApiResponse,
  type TaskStatus,
  type CreateTask
} from "../types/tasks"
import { getTasksByProject, createTask, deleteTask } from "../api/tasks"
import { createNote } from "../api/notes"

function useProjectTasks(token: string, projectId: number) {
  const [projectTasks, setProjectTasks] = useState<TaskApiResponse | undefined>(
    undefined
  )

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const handleFetchProjectTasks = async () => {
      try {
        setLoading(true)
        const tasksData = await getTasksByProject(
          projectId,
          token,
          "all",
          "all",
          "asc"
        )
        setProjectTasks(tasksData)
      } catch (e) {
        setError("Failed to fetch tasks")
      } finally {
        setLoading(false)
      }
    }

    handleFetchProjectTasks()
  }, [token, projectId])

  const updateTaskStatus = (taskId: number, newStatus: TaskStatus) => {
    setProjectTasks((current) => {
      if (!current) return current

      return {
        ...current,
        data: current.data.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      }
    })
  }

  const addTask = async (newTask: CreateTask, notes: string[]) => {
    try {
      setLoading(true)
      const response = await createTask(token, newTask)
      for (const content of notes) {
        await createNote(token, { content: content, taskId: response.id })
      }
      const updatedTasks = await getTasksByProject(
        projectId,
        token,
        "all",
        "all",
        "asc"
      )
      setProjectTasks(updatedTasks)
    } catch (e) {
      setError("Failed to add task")
    } finally {
      setLoading(false)
    }
  }

  const removeTask = async (taskId: number) => {
    try {
      setLoading(true)
      await deleteTask(Number(taskId), token)

      const updatedTasks = await getTasksByProject(
        Number(projectId),
        token,
        "all",
        "all",
        "asc"
      )
      setProjectTasks(updatedTasks)
    } catch (e) {
      setError("Failed to delete task")
    } finally {
      setLoading(false)
    }
  }

  return { projectTasks, loading, error, updateTaskStatus, addTask, removeTask }
}

export default useProjectTasks
