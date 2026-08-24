import EditableField from "../components/fields/EditableField"
import type { EditInfoFields } from "../types/common"
import type { Task, TaskStatus } from "../types/tasks"
import dayjs from "dayjs"
import StatusBadge from "../components/badges/StatusBadge"
import PriorityBadge from "../components/badges/PriorityBadge"
import { FolderKanban } from "lucide-react"
type TaskInfoSectionProps = {
  task: Task
  onUpdate: (
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus
  ) => Promise<boolean>
  projectName: string
}

function TaskInfoSection({
  task,
  onUpdate,
  projectName
}: TaskInfoSectionProps) {
  const displayStatus =
    task.status === "open" && dayjs(task.dueDate).isBefore(dayjs(), "day")
      ? "overdue"
      : task.status
  return (
    <div className="rounded-3xl border border-primary/15 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        {/* Task Name */}
        <div className="flex flex-wrap items-center gap-2">
          <EditableField
            data={task.name}
            field="name"
            onUpdate={onUpdate}
          />

          <StatusBadge
            status={displayStatus}
            interactive
            onStatusChange={onUpdate}
          />
          <PriorityBadge priority={task.priority} />
        </div>

        {/* Description */}
        <div className="flex items-center gap-2">
          <EditableField
            data={task.description}
            field="description"
            onUpdate={onUpdate}
          />
        </div>

        {/* Due Date */}
        <div className="flex items-center gap-2 mt-3">
          <EditableField
            data={task.dueDate}
            field="dueDate"
            onUpdate={onUpdate}
          />
        </div>

        {/* Project */}
        <div className="flex items-center gap-2">
          <FolderKanban className="h-5 w-5 text-primary" />

          <span className="font-body text-primary-font">{projectName}</span>
        </div>
      </div>
    </div>
  )
}

export default TaskInfoSection
