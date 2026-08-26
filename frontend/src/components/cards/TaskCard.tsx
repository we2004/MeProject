import { Briefcase, ClipboardList } from "lucide-react"

import { type TaskCardProps } from "../../types/tasks"
import StatusBadge from "../badges/StatusBadge"
import PriorityBadge from "../badges/PriorityBadge"
import { Link } from "react-router-dom"
import dayjs from "dayjs"
function TaskCard({
  id,
  name,
  projectName,
  status,
  dueDate,
  priority,
  onUpdate
}: TaskCardProps) {
  const displayStatus =
    status === "open" && dayjs(dueDate).isBefore(dayjs(), "day")
      ? "overdue"
      : status

  return (
    <div className="group flex w-full flex-col gap-6 rounded-3xl border border-primary/15 bg-white px-5 py-3 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg md:flex-row md:items-center md:justify-between">
      <Link
        to={`/taskDetails/${id}`}
        className="flex-1 flex items-center gap-4"
      >
        <div className="flex md:h-14 md:w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <ClipboardList className="h-7 w-7" />
        </div>

        <div>
          <h2 className="font-heading md:text-lg font-semibold text-primary-font">
            {name}
          </h2>

          <div className="mt-2 flex items-center gap-2 font-body text-sm text-primary-font/65">
            <Briefcase className="h-4 w-4" />
            {projectName}
          </div>
        </div>
      </Link>

      {/* Right */}
      <div className="flex flex-row self-end items-center gap-3">
        <StatusBadge
          status={displayStatus}
          interactive
          onStatusChange={onUpdate}
        />

        <PriorityBadge priority={priority} />
      </div>
    </div>
  )
}

export default TaskCard
