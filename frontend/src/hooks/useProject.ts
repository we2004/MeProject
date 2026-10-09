import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { ProjectApiResponse } from "../types/projects"
import {
  getProjectById,
  updateProjectData,
  deleteProject
} from "../api/projects"
import type { EditInfoFields } from "../types/common"

function isProjectResponse(value: unknown): value is ProjectApiResponse {
  if (!value || typeof value !== "object") return false
  const project = value as Record<string, unknown>
  return (
    typeof project.id === "number" &&
    typeof project.name === "string" &&
    typeof project.description === "string" &&
    typeof project.dueDate === "string" &&
    typeof project.cancelled === "boolean" &&
    Array.isArray(project.techStack) &&
    (project.derivedStatus === "cancelled" ||
      project.derivedStatus === "overdue" ||
      project.derivedStatus === "active" ||
      project.derivedStatus === "completed")
  )
}

function updateCachedProjectStatus(
  current: unknown,
  projectId: number,
  cancelled: boolean
): unknown {
  const update = (project: ProjectApiResponse) =>
    project.id === projectId
      ? {
          ...project,
          cancelled,
          derivedStatus: cancelled ? "cancelled" : "active"
        }
      : project

  if (isProjectResponse(current)) return update(current)
  if (Array.isArray(current) && current.every(isProjectResponse)) {
    return current.map(update)
  }
  return current
}

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
    let projectSnapshots: [readonly unknown[], unknown][] | undefined
    let projectSnapshot: ProjectApiResponse | undefined

    try {
      setMutationError("")
      setUpdateProjectLoading(true)

      if (field === "cancelled" && typeof data === "boolean") {
        await Promise.all([
          queryClient.cancelQueries({ queryKey: ["projects", token] }),
          queryClient.cancelQueries({
            queryKey: ["project", token, projectId]
          })
        ])
        projectSnapshots = queryClient.getQueriesData<unknown>({
          queryKey: ["projects", token]
        })
        projectSnapshot = queryClient.getQueryData<ProjectApiResponse>([
          "project",
          token,
          projectId
        ])

        queryClient.setQueryData<unknown>(
          ["project", token, projectId],
          (current: unknown) =>
            updateCachedProjectStatus(current, projectId, data)
        )
        queryClient.setQueriesData<unknown>(
          { queryKey: ["projects", token] },
          (current: unknown) =>
            updateCachedProjectStatus(current, projectId, data)
        )
      }

      await updateProjectData(projectId, field, data, token)

      if (field === "cancelled" && typeof data === "boolean") {
        void queryClient.invalidateQueries({
          queryKey: ["project", token, projectId]
        })
        void queryClient.invalidateQueries({
          queryKey: ["projects", token]
        })
      } else {
        queryClient.setQueryData<ProjectApiResponse>(
          ["project", token, projectId],
          (currentProject) =>
            currentProject
              ? { ...currentProject, [field]: data }
              : currentProject
        )
        queryClient.setQueriesData<ProjectApiResponse[]>(
          { queryKey: ["projects", token] },
          (projects) =>
            projects?.map((project) =>
              project.id === projectId
                ? { ...project, [field]: data }
                : project
            )
        )
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: ["project", token, projectId]
          }),
          queryClient.invalidateQueries({ queryKey: ["projects", token] })
        ])
      }

      return true
    } catch (e) {
      if (field === "cancelled" && projectSnapshots) {
        for (const [queryKey, previousData] of projectSnapshots) {
          if (previousData !== undefined) {
            queryClient.setQueryData(queryKey, previousData)
          }
        }
        if (projectSnapshot !== undefined) {
          queryClient.setQueryData(
            ["project", token, projectId],
            projectSnapshot
          )
        }
        void queryClient.invalidateQueries({
          queryKey: ["project", token, projectId]
        })
        void queryClient.invalidateQueries({ queryKey: ["projects", token] })
      }
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
