import { CirclePlus, Flag, SlidersHorizontal } from "lucide-react"
import PrimaryButton from "../components/buttons/PrimaryButton"
import TaskCard from "../components/cards/TaskCard"
import { useSearchParams } from "react-router-dom"
import {
  type TaskStatusFilter,
  type TaskPriorityFilter,
  type Task,
  type CreateTask
} from "../types/tasks"
import { getTaskFilter } from "../utils/tasks"
import { type MenuType, type SortOrder } from "../types/common"
import { useState, useEffect } from "react"
import SortByDateButton from "../components/buttons/SortByDateButton"
import DropdownButton from "../components/buttons/DropdownButton"
import AddTaskModal from "../components/modals/AddTaskModal"
import { createTask, getTasks, getTasksByProject } from "../api/tasks"
import { type ProjectApiResponse } from "../types/projects"
import { getProjects } from "../api/projects"
import { createNote } from "../api/notes"
import { useAuth } from "../context/useAuth"
function Tasks() {
  const {token} = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const [openMenu, setOpenMenu] = useState<MenuType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[] | null>(null)
  const [projects, setProjects] = useState<ProjectApiResponse[] | null>(null)

  const order: SortOrder = searchParams.get("order") === "desc" ? "desc" : "asc"
  const filter: TaskStatusFilter = getTaskFilter(searchParams.get("filter"))
  const priority: TaskPriorityFilter =
    (searchParams.get("priority") as TaskPriorityFilter) ?? "all"
  const projectId = searchParams.get("projectId") ?? undefined

  const filters: TaskStatusFilter[] = ["all", "open", "completed", "overdue"]
  const priorities: TaskPriorityFilter[] = ["all", "high", "medium", "low"]
  const nextOrder = order === "asc" ? "desc" : "asc"

  useEffect(() => {
    const start = async () => {
      if (projectId) {
        const response = await getTasksByProject(
          Number(projectId),
          token,
          filter,
          priority,
          order
        )
        setTasks(response.data)
      } else {
        const response = await getTasks(token, filter, priority, order)
        setTasks(response.data)
      }
    }
    start()
  }, [token, filter, priority, order, projectId])

  useEffect(() => {
    const start = async () => {
      const projectsData = await getProjects(token, "all", "asc")
      setProjects(projectsData)
    }

    start()
  }, [token])

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

  const handleAddTask = async (newTask: CreateTask, notes: string[]) => {
    const response = await createTask(token, newTask)
    for (const content of notes) {
      await createNote(token, { content: content, taskId: response.id })
    }

    if (projectId) {
      const response = await getTasksByProject(
        Number(projectId),
        token,
        filter,
        priority,
        order
      )

      setTasks(response.data)
    } else {
      const response = await getTasks(token, filter, priority, order)

      setTasks(response.data)
    }
  }

  return (
    <section className="flex flex-col gap-8">
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddTask}
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
            token={token}
          />
        ))}
      </div>
    </section>
  )
}

export default Tasks
