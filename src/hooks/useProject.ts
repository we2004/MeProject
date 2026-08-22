import { useState, useEffect } from "react"
import type { ProjectApiResponse, ProjectFields } from "../types/projects"
import {
  getProjectById,
  updateProjectData,
  deleteProject
} from "../api/projects"

function useProject(token: string, projectId: number) {
  const [project, setProject] = useState<ProjectApiResponse | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  //GET project
  useEffect(() => {
    const handleFetchProject = async () => {
      try {
        setLoading(true)

        const projectData = await getProjectById(projectId, token)

        setProject(projectData)
      } catch (e) {
        setError("Failed to fetch project")
      } finally {
        setLoading(false)
      }
    }

    handleFetchProject()
  }, [token, projectId])

  const updateProject = async (
    field: ProjectFields,
    data: string | boolean | string[]
  ) => {
    try {
      setLoading(true)
      await updateProjectData(projectId, field, data, token)

      setProject((currentProject) => {
        if (!currentProject) return currentProject

        return {
          ...currentProject,
          [field]: data
        }
      })
    } catch (e) {
      setError("Failed to update project")
    } finally {
      setLoading(false)
    }
  }

  const deleteCurrentProject = async () => {
    try {
      setLoading(true)
      await deleteProject(projectId, token)
    } catch (e) {
      setError("Failed to delete project")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { project, loading, error, updateProject, deleteCurrentProject }
}

export default useProject
