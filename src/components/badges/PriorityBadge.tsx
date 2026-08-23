import { type TaskPriority } from "../../types/tasks"
import { Flag } from "lucide-react"

type PriorityBadgeProps = {
  priority: TaskPriority
}
function PriorityBadge({ priority }: PriorityBadgeProps) {
  
  const priorityStyles = {
    high: "bg-redT/25",
    medium: "bg-orangeT/25",
    low: "bg-secondary/15"
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full ${priorityStyles[priority]} px-4 py-2 font-body text-sm font-medium text-primary-font`}
    >
      <Flag className="h-4 w-4" />
      {priority}
    </div>
  )
}

export default PriorityBadge
