import axios from "axios"
import type { ProjectApiResponse, Project, ProjectStatusFilter } from "../types/projects"
import type { SortOrder } from "../types/common"
const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getProjects(
  token: string,
  filter: ProjectStatusFilter,
  order: SortOrder
) {
  const response = await axios.get(
    `${BASE_URL}/projects?filter=${filter}&sortOrder=${order}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function getProjectById(projectId: number, token: string) {
  const response = await axios.get<ProjectApiResponse>(
    `${BASE_URL}/projects/${projectId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function createProject(token: string, newProject: Project) {
  const response = await axios.post(`${BASE_URL}/projects`, newProject, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export async function updateProjectData(
  id: number,
  field: string,
  data: unknown,
  token: string
) {
  const response = await axios.put(
    `${BASE_URL}/projects/${id}`,
    {
      [field]: data
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export async function deleteProject(id:number,token:string) {
  const response = await axios.delete(`${BASE_URL}/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data
}
