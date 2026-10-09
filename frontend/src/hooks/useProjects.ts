import type { SortOrder } from "../types/common"
import {
  type ProjectApiResponse,
  type ProjectStatusFilter,
  type Project
} from "../types/projects"
import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getProjects, createProject } from "../api/projects"
import { createAttachment } from "../api/attachments"

function useProjects(
  token: string,
  filter: ProjectStatusFilter,
  order: SortOrder
) {
  const queryClient = useQueryClient()
  const [addProjectLoading, setAddProjectLoading] = useState(false)
  const [mutationError, setMutationError] = useState("")

  const projectsQuery = useQuery<ProjectApiResponse[]>({
    queryKey: ["projects", token, filter, order],
    queryFn: () => getProjects(token, filter, order),
    placeholderData: (previousData, previousQuery) =>
      previousQuery?.queryKey[1] === token ? previousData : undefined
  })

  const addProject = async (newProject: Project, files: File[]) => {
    try {
      setMutationError("")
      setAddProjectLoading(true)
      const response = await createProject(token, newProject)

      for (const file of files) {
        await createAttachment(token, {
          file: file,
          projectId: Number(response.id)
        })
      }

      await queryClient.invalidateQueries({ queryKey: ["projects", token] })
      return true
    } catch (e) {
      await queryClient.invalidateQueries({ queryKey: ["projects", token] })
      setMutationError("Failed to add project")
      console.log(e)
      return false
    } finally {
      setAddProjectLoading(false)
    }
  }

  return {
    projects: projectsQuery.data ?? [],
    projectsLoading: projectsQuery.isLoading,
    projectsFetching: projectsQuery.isFetching,
    projectsHasData: projectsQuery.data !== undefined,
    addProjectLoading,
    error: projectsQuery.isError ? "Failed to fetch projects" : mutationError,
    addProject
  }
}

export default useProjects
