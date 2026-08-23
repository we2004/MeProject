import type { SortOrder } from "../types/common"
import {
  type ProjectApiResponse,
  type ProjectStatusFilter,
  type Project
} from "../types/projects"
import { useState, useEffect } from "react"
import { getProjects, createProject } from "../api/projects"
import { createAttachment } from "../api/attachments"
function useProjects(
  token: string,
  filter: ProjectStatusFilter,
  order: SortOrder
) {
  const [projects, setProjects] = useState<ProjectApiResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const handleFetchProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await getProjects(token, filter, order)
        setProjects(projectsData)
      } catch (e) {
        setError("Failed to fetch projects")
      } finally {
        setLoading(false)
      }
    }

    handleFetchProjects()
  }, [token, filter, order])

  const addProject = async (newProject: Project, files: File[]) => {
    try {
      setLoading(true)
      const response = await createProject(token, newProject)

      for (const file of files) {
        await createAttachment(token, {
          file: file,
          projectId: Number(response.id)
        })
      }
      const projectsData = await getProjects(token, filter, order)
      setProjects(projectsData)
    } catch (e) {
      setError("Faild to add project")
    } finally {
      setLoading(false)
    }
  }

  return { projects, loading, error, addProject }
}

export default useProjects
