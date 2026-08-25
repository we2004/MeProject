import { useState, useEffect } from "react"
import type { ProjectApiResponse } from "../types/projects"
import {
  getProjectById,
  updateProjectData,
  deleteProject
} from "../api/projects"
import type { EditInfoFields } from "../types/common"
function useProject(token: string, projectId?: number) {
  const [project, setProject] = useState<ProjectApiResponse | undefined>(
    undefined
  )
  const [projectLoading, setProjectLoading] = useState(false)
  const [updateProjectLoading, setUpdateProjectLoading] = useState(false)
  const [deleteProjectLoading, setDeleteProjectLoading] = useState(false)
  const [error, setError] = useState("")

  //GET project
  useEffect(() => {
    if (!projectId) return

    const handleFetchProject = async () => {
      try {
        setError("")
        setProjectLoading(true)

        const projectData = await getProjectById(projectId, token)

        setProject(projectData)
      } catch (e) {
        setError("Failed to fetch project")
        console.log(e)
      } finally {
        setProjectLoading(false)
      }
    }

    handleFetchProject()
  }, [token, projectId])

  const updateProject = async (
    field: EditInfoFields,
    data: string | boolean | string[]
  ) => {
    if (!projectId) return false
    try {
      setError("")
      setUpdateProjectLoading(true)
      await updateProjectData(projectId, field, data, token)

      setProject((currentProject) => {
        if (!currentProject) return currentProject

        return {
          ...currentProject,
          [field]: data
        }
      })

      return true
    } catch (e) {
      setError("Failed to update project")
      console.log(e)
      return false
    } finally {
      setUpdateProjectLoading(false)
      
    }
  }

  const deleteCurrentProject = async () => {
    if (!projectId) return
    try {
      setError("")
      setDeleteProjectLoading(true)
      await deleteProject(projectId, token)
      return true
    } catch (e) {
      setError("Failed to delete project")
      console.log(e)
      return false
    } finally {
      setDeleteProjectLoading(false)
    }
  }

  return {
    project,
    projectLoading,
    updateProjectLoading,
    deleteProjectLoading,
    error,
    updateProject,
    deleteCurrentProject
  }
}

export default useProject
