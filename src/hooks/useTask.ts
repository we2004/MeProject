import { type Task, type TaskStatus } from "../types/tasks"
import { useState, useEffect } from "react"
import { deleteTask, getTaskById, updateTaskData } from "../api/tasks"
import type { EditInfoFields } from "../types/common"
function useTask(token: string, taskId: number) {
  const [task, setTask] = useState<Task | null>(null)
  const [taskLoading, setTaskLoading] = useState(false)
  const [updateTaskLoading, setUpdateTaskLoading] = useState(false)
  const [removeTaskLoading, setRemoveTaskLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const handleFetchTask = async () => {
      try {
        setTaskLoading(true)
        const taskData = await getTaskById(taskId, token)
        setTask(taskData)
      } catch (e) {
        setError("Failed to fetch task")
        console.log(e)
      } finally {
        setTaskLoading(false)
      }
    }

    handleFetchTask()
  }, [token, taskId])

  const updateTask = async (
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus
  ) => {
    try {
      setUpdateTaskLoading(true)
      await updateTaskData(Number(taskId), field, data, token)

      setTask((currentTask) => {
        if (!currentTask) return currentTask

        return {
          ...currentTask,
          [field]: data
        }
      })
      return true
    } catch (e) {
      setError("Failed to update task")
      console.log(e)
      return false
    } finally {
      setUpdateTaskLoading(false)
    }
  }

  const removeTask = async () => {
    try {
      setRemoveTaskLoading(true)

      await deleteTask(taskId, token)

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
    task,
    taskLoading,
    updateTaskLoading,
    removeTaskLoading,
    error,
    updateTask,
    removeTask
  }
}

export default useTask
