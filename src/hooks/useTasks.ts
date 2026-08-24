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
  projectId?: number
) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [addTaskLoading, setAddTaskLoading] = useState(false)
  const [udpateTaskLoading, setUpdateTaskLoading] = useState(false)
  const [removeTaskLoading, setRemoveTaskLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const handleFetchTasks = async () => {
      try {
        setTasksLoading(true)
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
        console.log(e)
      } finally {
        setTasksLoading(false)
      }
    }
    handleFetchTasks()
  }, [token, filter, priority, order, projectId])

  const addTask = async (newTask: CreateTask, notes: string[]) => {
    try {
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
          order
        )

        setTasks(response.data)
      } else {
        const response = await getTasks(token, filter, priority, order)

        setTasks(response.data)
      }
    } catch (e) {
      setError("Failed to add task")
      console.log(e)
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
      setUpdateTaskLoading(true)

      await updateTaskData(taskId, field, data, token)

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? { ...task, [field]: data } : task
        )
      )
    } catch (e) {
      setError("Failed to update task")
      console.log(e)
    } finally {
      setUpdateTaskLoading(false)
    }
  }

  const removeTask = async (taskId: number) => {
    try {
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
    } catch (e) {
      setError("Failed to delete task")
      console.log(e)
    } finally {
      setRemoveTaskLoading(false)
    }
  }

  return {
    tasks,
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
