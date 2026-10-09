import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getTasks, getTasksByProject } from "../api/tasks"
import type {
  Task,
  TaskApiResponse,
  TaskPriorityFilter,
  TaskStatusFilter
} from "../types/tasks"
import type { SortOrder } from "../types/common"

const ALL_TASKS_PAGE = "all"
const PAGE_BATCH_SIZE = 5

function useAllTasks(token: string, projectId?: number) {
  const queryClient = useQueryClient()
  const status: TaskStatusFilter = "all"
  const priority: TaskPriorityFilter = "all"
  const order: SortOrder = "asc"

  const tasksQuery = useQuery<Task[]>({
    queryKey: [
      "tasks",
      token,
      status,
      priority,
      order,
      projectId,
      ALL_TASKS_PAGE
    ],
    queryFn: async () => {
      const firstPageKey = [
        "tasks",
        token,
        status,
        priority,
        order,
        projectId,
        1
      ]
      const fetchPage = (page: number) =>
        projectId
          ? getTasksByProject(projectId, token, status, priority, order, page)
          : getTasks(token, status, priority, order, page)

      const firstPage = await queryClient.fetchQuery<TaskApiResponse>({
        queryKey: firstPageKey,
        queryFn: () => fetchPage(1)
      })
      const allTasks = [...firstPage.data]

      for (
        let firstPageNumber = 2;
        firstPageNumber <= firstPage.pagination.totalPages;
        firstPageNumber += PAGE_BATCH_SIZE
      ) {
        const pageNumbers = Array.from(
          {
            length: Math.min(
              PAGE_BATCH_SIZE,
              firstPage.pagination.totalPages - firstPageNumber + 1
            )
          },
          (_, index) => firstPageNumber + index
        )
        const pages = await Promise.all(
          pageNumbers.map((page) => fetchPage(page))
        )
        allTasks.push(...pages.flatMap((page) => page.data))
      }

      return allTasks
    },
    enabled: Boolean(token)
  })

  return {
    tasks: tasksQuery.data ?? [],
    tasksLoading: tasksQuery.isLoading,
    tasksHasData: tasksQuery.data !== undefined,
    error: tasksQuery.isError ? "Failed to fetch tasks" : ""
  }
}

export default useAllTasks
