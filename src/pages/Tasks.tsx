import { CirclePlus, Flag, SlidersHorizontal } from "lucide-react"
import PrimaryButton from "../components/buttons/PrimaryButton"
import TaskCard from "../components/cards/TaskCard"
import { useSearchParams } from "react-router-dom"
import { type TaskStatusFilter, type TaskPriorityFilter } from "../types/tasks"
import { getTaskFilter, getTaskPriority } from "../utils/tasks"
import { type MenuType, type SortOrder } from "../types/common"
import { useEffect, useState } from "react"
import SortByDateButton from "../components/buttons/SortByDateButton"
import DropdownButton from "../components/buttons/DropdownButton"
import AddTaskModal from "../components/modals/AddTaskModal"
import { useAuth } from "../context/useAuth"
import useTasks from "../hooks/useTasks"
import useProjects from "../hooks/useProjects"
import TasksSkeleton from "../components/loading/skeletons/TasksSkeleton"
import ErrorCard from "../components/cards/ErrorCard"
import PlaceHolderCard from "../components/cards/PlaceHolderCard"

function Tasks() {
  const { token } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const projectId = searchParams.get("projectId")
  const order: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc"
  const filter: TaskStatusFilter = getTaskFilter(searchParams.get("filter"))
  const priority: TaskPriorityFilter = getTaskPriority(
    searchParams.get("priority")
  )
  const page = Number(searchParams.get("page")) || 1

  const {
    tasks,
    tasksLoading,
    udpateTaskLoading,
    addTask,
    updateTask,
    error: tasksError,
    pagination
  } = useTasks(token, filter, priority, order, Number(projectId), page)
  const {
    projects,
    projectsLoading,
    error: projectsError
  } = useProjects(token, "all", "asc")

  const [openMenu, setOpenMenu] = useState<MenuType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filters: TaskStatusFilter[] = ["all", "open", "completed", "overdue"]
  const priorities: TaskPriorityFilter[] = ["all", "high", "medium", "low"]
  const nextOrder = order === "asc" ? "desc" : "asc"

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      const timer = setTimeout(() => {
        setIsModalOpen(true)
        setSearchParams(
          (current) => {
            const params = new URLSearchParams(current)
            params.delete("create")
            return params
          },
          { replace: true }
        )
      }, 230)
      return () => clearTimeout(timer)
    }
  }, [searchParams, setSearchParams])

  const handleFilterSelect = (newFilter: TaskStatusFilter) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)

      params.set("filter", newFilter)
      params.set("page", "1")

      return params
    })
  }

  const handlePrioritySelect = (newPriority: TaskPriorityFilter) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)

      params.set("priority", newPriority)
      params.set("page", "1")

      return params
    })
  }

  const handleToggleOrder = () => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)

      params.set("order", nextOrder)
      params.set("page", "1")

      return params
    })
  }

  if (tasksLoading || projectsLoading) return <TasksSkeleton />

  return (
    <section className="animate-fade-in flex flex-col gap-8">
      <div className="fixed right-6 top-25 z-9999 flex flex-col gap-3">
        {tasksError && <ErrorCard message={tasksError} />}
        {projectsError && <ErrorCard message={projectsError} />}
      </div>
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={addTask}
          projects={projects!}
          udpateTaskLoading={udpateTaskLoading}
        />
      )}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between items-center justify-center">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary-font text-center md:text-start">
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

      {tasks.length === 0 ? (
        <PlaceHolderCard message="No Tasks" />
      ) : (
        <>
          <div className="flex flex-col gap-4 ">
            {tasks?.map((task) => (
              <TaskCard
                key={task.id}
                {...task}
                projectName={
                  projects?.find((project) => project.id == task.projectId)
                    ?.name
                }
                onUpdate={(field, data) => updateTask(task.id, field, data)}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-5 font-heading text-primary-font ">
              <button
                disabled={pagination.currentPage === 1}
                onClick={() =>
                  setSearchParams((current) => {
                    const params = new URLSearchParams(current)
                    params.set("page", String(pagination.currentPage - 1))
                    return params
                  })
                }
                className="hover:text-primary cursor-pointer transition-all duration-300"
              >
                Previous
              </button>

              <span>
                {pagination.currentPage} of {pagination.totalPages}
              </span>

              <button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() =>
                  setSearchParams((current) => {
                    const params = new URLSearchParams(current)
                    params.set("page", String(pagination.currentPage + 1))
                    return params
                  })
                }
                className="hover:text-primary cursor-pointer transition-all duration-300"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default Tasks
