import { type Task, type TaskStatus } from "../types/tasks"
import { useState, useEffect } from "react"
import { getTaskById, updateTaskData } from "../api/tasks"
import type { EditInfoFields } from "../types/common"
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
        console.log(e)
      } finally {
        setLoading(false)
      }
    }

    handleFetchTask()
  }, [token, taskId])

  const updateTask = async (
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus
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
    } catch (e) {
      setError("Failed to update task")
      console.log(e)
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
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return { task, loading, error, updateTask, updateTaskStatus }
}

export default useTask
