import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Play,
  CircleX,
  ChevronDown
} from "lucide-react"
import { useState } from "react"
import type { TaskStatus } from "../../types/tasks"
import type { ProjectStatus } from "../../types/projects"
import type { EditInfoFields } from "../../types/common"
type StatusBadgeProps = {
  status: TaskStatus | ProjectStatus
  interactive?: boolean
  onStatusChange?: (
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus | ProjectStatus
  ) => Promise<boolean>
}

function StatusBadge({
  status,
  interactive = false,
  onStatusChange
}: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)

  const statusStyle = {
    active: "bg-blueT/25",
    open: "bg-blueT/25",
    completed: "bg-greenT/25",
    overdue: "bg-redT/45",
    cancelled: "bg-secondary/15"
  }

  const nextStatus =
    status === "active"
      ? "cancelled"
      : status === "cancelled"
        ? "active"
        : status === "completed"
          ? "open"
          : "completed"

  const isCancelled = nextStatus === 'cancelled'
  

  const handleBadgeClick = () => {
    if (interactive) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={!interactive}
        onClick={handleBadgeClick}
        className={`${statusStyle[status]} flex items-center gap-2 rounded-full md:px-4 md:py-2 px-3 py-1 font-body text-sm font-medium capitalize text-primary-font transition-all duration-200 ${
          interactive ? "cursor-pointer hover:opacity-80" : "cursor-default"
        }`}
      >
        {status === "completed" && <CheckCircle2 className="h-4 w-4" />}

        {status === "open" && <Clock3 className="h-4 w-4" />}

        {status === "overdue" && <AlertTriangle className="h-4 w-4" />}

        {status === "active" && <Play className="h-4 w-4" />}

        {status === "cancelled" && <CircleX className="h-4 w-4" />}

        {status}

        {interactive && (
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {interactive && isOpen && (
        <div className="absolute left-0 top-full z-20 mt-2 w-36 rounded-2xl border border-primary/15 bg-white p-2 shadow-lg">
          <button
            type="button"
            onClick={async () => {
              if (nextStatus === "cancelled" || nextStatus === 'active') {
                const success = await onStatusChange?.("cancelled", isCancelled)
                if (success) setIsOpen(false)
              } else {
                const success = await onStatusChange?.("status", nextStatus)
                if (success) setIsOpen(false)
              }
            }}
            className="w-full rounded-xl px-3 py-2 text-left font-body text-sm capitalize text-primary-font transition-colors duration-200 hover:bg-primary hover:text-white"
          >
            {nextStatus}
          </button>
        </div>
      )}
    </div>
  )
}

export default StatusBadge
