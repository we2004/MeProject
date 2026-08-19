import { type TaskPriority } from "../../types/tasks"
import { Flag } from "lucide-react"


type PriorityBadgeProps = {
  priority: TaskPriority
}
function PriorityBadge({ priority }: PriorityBadgeProps) {
  let priorityStyles = ""

  switch (priority) {
    case "high":
      priorityStyles = "bg-redT/25"
      break
    case "medium":
      priorityStyles = "bg-orangeT/25"
      break
    case "low":
      priorityStyles = "bg-secondary/15"
      break
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full ${priorityStyles} px-4 py-2 font-body text-sm font-medium text-primary-font`}
    >
      <Flag className="h-4 w-4" />
      {priority}
    </div>
  )
}

export default PriorityBadge
