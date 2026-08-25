import axios from "axios"
import type {
  CreateTask,
  TaskApiResponse,
  TaskPriorityFilter,
  TaskStatusFilter,
  Task
} from "../types/tasks"
import type { SortOrder } from "../types/common"

const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getTasksByProject(
  projectId: number,
  token: string | undefined,
  status: TaskStatusFilter,
  priority: TaskPriorityFilter,
  sortOrder: SortOrder,
  page = 1
) {
  const response = await axios.get<TaskApiResponse>(
    `${BASE_URL}/tasks?projectId=${projectId}&status=${status}&priority=${priority}&sortOrder=${sortOrder}&page=${page}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function getTasks(
  token: string,
  status: TaskStatusFilter,
  priority: TaskPriorityFilter,
  sortOrder: SortOrder,
  page = 1
) {
  const response = await axios.get<TaskApiResponse>(
    `${BASE_URL}/tasks?status=${status}&priority=${priority}&sortOrder=${sortOrder}&page=${page}&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function updateTaskData(
  id: number,
  field: string,
  value: unknown,
  token: string | undefined
) {
  const response = await axios.put<TaskApiResponse>(
    `${BASE_URL}/tasks/${id}`,
    {
      [field]: value
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function createTask(token: string, newTask: CreateTask) {
  const response = await axios.post(`${BASE_URL}/tasks`, newTask, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export async function getTaskById(taskId: number, token: string) {
  const response = await axios.get<Task>(`${BASE_URL}/tasks/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export async function deleteTask(id: number, token: string) {
  const response = await axios.delete(`${BASE_URL}/tasks/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
