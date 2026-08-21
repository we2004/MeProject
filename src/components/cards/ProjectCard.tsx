import { Clock3 } from "lucide-react"
import { type ProjectCardProps } from "../../types/projects"
import { Link } from "react-router-dom"
import dayjs from "dayjs"
import { calculateProgress } from "../../utils/projects"
import StatusBadge from "../badges/StatusBadge"
import { useEffect, useState } from "react"
import type { TaskApiResponse } from "../../types/tasks"
import { getTasksByProject } from "../../api/tasks"
import { useAuth } from "../../context/useAuth"
function ProjectCard({
  id,
  name,
  description,
  dueDate,
  showDaysLeft = true,
  derivedStatus
}: ProjectCardProps) {
  const {token} = useAuth()
  const [tasks, setTasks] = useState<TaskApiResponse | null>(null)
  useEffect(() => {
    const start = async () => {
      const projectTasks = await getTasksByProject(id, token, 'all', 'all', 'asc')
      setTasks(projectTasks)
    }

    start()
  }, [id, token])

  const daysLeft = dayjs(dueDate).diff(dayjs(), "day")
  const progress = calculateProgress( id, tasks?.data)

  return (
    <Link
      className="group flex flex-col rounded-3xl border border-primary/15 bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg "
      to={`/projectDetails/${id}`}
    >
      <h2 className="font-heading text-xl font-semibold text-primary-font">
        {name}
      </h2>

      <p className="mt-1 line-clamp-2 font-body text-sm leading-5 text-primary-font/70">
        {description}
      </p>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-body text-sm text-primary-font/70">
            Progress
          </span>

          <span className="font-body text-sm font-medium text-primary-font">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-primary/10">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-warp items-center justify-between border-t border-primary/10 pt-4">
        {showDaysLeft && (
          <div className="flex items-center gap-2 text-primary-font/70">
            <Clock3 className="h-4 w-4" />
            <span className="font-body text-sm">
              {daysLeft > 0 ? daysLeft : 0} days left
            </span>
          </div>
        )}

        <StatusBadge status={derivedStatus} />
      </div>
    </Link>
  )
}

export default ProjectCard
