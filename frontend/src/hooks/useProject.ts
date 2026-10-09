import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { ProjectApiResponse } from "../types/projects"
import {
  getProjectById,
  updateProjectData,
  deleteProject
} from "../api/projects"
import type { EditInfoFields } from "../types/common"

function useProject(token: string, projectId?: number) {
  const queryClient = useQueryClient()
  const [updateProjectLoading, setUpdateProjectLoading] = useState(false)
  const [deleteProjectLoading, setDeleteProjectLoading] = useState(false)
  const [mutationError, setMutationError] = useState("")

  const projectQuery = useQuery<ProjectApiResponse>({
    queryKey: ["project", token, projectId],
    queryFn: () => getProjectById(projectId!, token),
    enabled: Boolean(token && projectId),
    initialData: () =>
      projectId
        ? queryClient
            .getQueriesData<ProjectApiResponse[]>({
              queryKey: ["projects", token]
            })
            .flatMap(([, projects]) => projects ?? [])
            .find((project) => project.id === projectId)
        : undefined,
    initialDataUpdatedAt: 0
  })

  const updateProject = async (
    field: EditInfoFields,
    data: string | boolean | string[]
  ) => {
    if (!projectId) return false
    try {
      setMutationError("")
      setUpdateProjectLoading(true)
      await updateProjectData(projectId, field, data, token)

      queryClient.setQueryData<ProjectApiResponse>(
        ["project", token, projectId],
        (currentProject) =>
          currentProject ? { ...currentProject, [field]: data } : currentProject
      )
      queryClient.setQueriesData<ProjectApiResponse[]>(
        { queryKey: ["projects", token] },
        (projects) =>
          projects?.map((project) =>
            project.id === projectId ? { ...project, [field]: data } : project
          )
      )
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["project", token, projectId] }),
        queryClient.invalidateQueries({ queryKey: ["projects", token] })
      ])

      return true
    } catch (e) {
      setMutationError("Failed to update project")
      console.log(e)
      return false
    } finally {
      setUpdateProjectLoading(false)
    }
  }

  const deleteCurrentProject = async () => {
    if (!projectId) return
    try {
      setMutationError("")
      setDeleteProjectLoading(true)
      await deleteProject(projectId, token)

      queryClient.removeQueries({ queryKey: ["attachments", token, projectId] })
      queryClient.removeQueries({
        queryKey: ["attachmentFile", token, projectId]
      })
      queryClient.removeQueries({ queryKey: ["project", token, projectId] })
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["projects", token] }),
        queryClient.invalidateQueries({ queryKey: ["tasks", token] })
      ])
      return true
    } catch (e) {
      setMutationError("Failed to delete project")
      console.log(e)
      return false
    } finally {
      setDeleteProjectLoading(false)
    }
  }

  return {
    project: projectQuery.data,
    projectLoading: projectQuery.isLoading,
    updateProjectLoading,
    deleteProjectLoading,
    error: projectQuery.isError
      ? "Failed to fetch project"
      : mutationError,
    updateProject,
    deleteCurrentProject
  }
}

export default useProject
