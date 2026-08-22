import { useState, useEffect } from "react"
import type { ProjectApiResponse } from "../types/projects"
import { getProjectById } from "../api/projects"

function useProject(token: string, projectId: number) {
  const [project, setProject] = useState<ProjectApiResponse | undefined>(
    undefined
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  return { project, loading, error }
}

export default useProject