import { type Task, type TaskStatus } from "../types/tasks"
import { useState, useEffect } from "react"
import { getTaskById, updateTaskData } from "../api/tasks"

function useTask(token: string, taskId: number) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const handleFetchTask = async () => {
      try {
        const taskData = await getTaskById(taskId, token)
        setTask(taskData)
        setLoading(true)
      } catch (e) {
        setError("Failed to fetch task")
      } finally {
        setLoading(false)
      }
    }

    handleFetchTask()
  }, [token, taskId])

  const updateTask = async (
    field: string,
    data: unknown,
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    try {
      setLoading(true)
      await updateTaskData(Number(taskId), field, data, token)

      setTask((currentTask) => {
        if (!currentTask) return currentTask

        return {
          ...currentTask,
          [field]: data
        }
      })

      setter(false)
    } catch (e) {
      setError("Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (newStatus: TaskStatus) => {
    try {
      setLoading(true)
      await updateTaskData(taskId, "status", newStatus, token)

      setTask((current) => {
        if (!current) return current
        return {
          ...current,
          status: newStatus
        }
      })
    } catch (e) {
      setError("Failed to update task")
    } finally {
      setLoading(false)
    }
  }

  return { task, loading, error, updateTask, updateTaskStatus }
}

export default useTask
