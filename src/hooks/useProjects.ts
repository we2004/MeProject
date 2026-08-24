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
  const [projectsLoading, setprojectsLoading] = useState(false)
  const [addProjectLoading, setAddProjectLoading] = useState(false)
  const [error, setError] = useState("")

  //GET
  useEffect(() => {
    const handleFetchProjects = async () => {
      try {
        setprojectsLoading(true)
        const projectsData = await getProjects(token, filter, order)
        setProjects(projectsData)
      } catch (e) {
        setError("Failed to fetch projects")
        console.log(e)
      } finally {
        setprojectsLoading(false)
      }
    }

    handleFetchProjects()
  }, [token, filter, order])

  const addProject = async (newProject: Project, files: File[]) => {
    try {
      setAddProjectLoading(true)
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
      console.log(e)
    } finally {
      setAddProjectLoading(false)
    }
  }

  return { projects, projectsLoading, addProjectLoading, error, addProject }
}

export default useProjects
