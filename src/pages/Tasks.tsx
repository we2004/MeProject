import { CirclePlus, Flag, SlidersHorizontal } from "lucide-react"
import PrimaryButton from "../components/buttons/PrimaryButton"
import TaskCard from "../components/cards/TaskCard"
import { useSearchParams } from "react-router-dom"
import { type TaskStatusFilter, type TaskPriorityFilter } from "../types/tasks"
import { getTaskFilter, getTaskPriority } from "../utils/tasks"
import { type MenuType, type SortOrder } from "../types/common"
import { useState } from "react"
import SortByDateButton from "../components/buttons/SortByDateButton"
import DropdownButton from "../components/buttons/DropdownButton"
import AddTaskModal from "../components/modals/AddTaskModal"
import { useAuth } from "../context/useAuth"
import useTasks from "../hooks/useTasks"
import useProjects from "../hooks/useProjects"
import TasksSkeleton from "../components/loading/skeletons/TasksSkeleton"

function Tasks() {
  const { token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const projectId = searchParams.get("projectId")
  const order: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc"
  const filter: TaskStatusFilter = getTaskFilter(searchParams.get("filter"))
  const priority: TaskPriorityFilter = getTaskPriority(
    searchParams.get("priority")
  )
  const { tasks, tasksLoading, addTask, updateTask } = useTasks(
    token,
    filter,
    priority,
    order,
    Number(projectId)
  )
  const { projects, projectsLoading } = useProjects(token, "all", "asc")

  const [openMenu, setOpenMenu] = useState<MenuType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filters: TaskStatusFilter[] = ["all", "open", "completed", "overdue"]
  const priorities: TaskPriorityFilter[] = ["all", "high", "medium", "low"]
  const nextOrder = order === "asc" ? "desc" : "asc"

  const handleFilterSelect = (newFilter: TaskStatusFilter) => {
    if (projectId) {
      setSearchParams({
        filter: newFilter,
        order,
        priority,
        projectId
      })
    } else {
      setSearchParams({
        filter: newFilter,
        order,
        priority
      })
    }
  }

  const handlePrioritySelect = (newPriority: TaskPriorityFilter) => {
    if (projectId) {
      setSearchParams({
        filter,
        order,
        priority: newPriority,
        projectId
      })
    } else {
      setSearchParams({
        filter,
        order,
        priority: newPriority
      })
    }
  }

  const handleToggleOrder = () => {
    if (projectId) {
      setSearchParams({
        order: nextOrder,
        filter,
        priority,
        projectId
      })
    } else {
      setSearchParams({
        order: nextOrder,
        filter,
        priority
      })
    }
  }

  if (tasksLoading || projectsLoading) return <TasksSkeleton />

  return (
    <section className="animate-fade-in flex flex-col gap-8">
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={addTask}
          projects={projects!}
        />
      )}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary-font text-center sm:text-start">
            My Tasks
          </h1>

          {projectId && (
            <p className="mt-4 font-body text-primary-font">
              {
                projects?.find((project) => project.id === Number(projectId))
                  ?.name
              }{" "}
              Tasks
            </p>
          )}
        </div>

        <PrimaryButton
          Icon={CirclePlus}
          onClickFun={() => setIsModalOpen(true)}
        >
          Create Task
        </PrimaryButton>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
        <DropdownButton
          menuType="taskStatus"
          Icon={SlidersHorizontal}
          options={filters}
          selectedOption={filter}
          showMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onSelect={handleFilterSelect}
        >
          Filter Status{" "}
        </DropdownButton>

        <DropdownButton
          menuType="priority"
          Icon={Flag}
          options={priorities}
          selectedOption={priority}
          showMenu={openMenu}
          setOpenMenu={setOpenMenu}
          onSelect={handlePrioritySelect}
        >
          {" "}
          Filter Priority{" "}
        </DropdownButton>

        <SortByDateButton onToggle={handleToggleOrder} />
      </div>

      <div className="flex flex-col gap-4">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            projectName={
              projects?.find((project) => project.id == task.projectId)?.name
            }
            onUpdate={(field, data) => updateTask(task.id, field, data)}
          />
        ))}
      </div>
    </section>
  )
}

export default Tasks
