import { ArrowRight } from "lucide-react"

import TaskCard from "../components/cards/TaskCard"
import OverviewCard from "../components/cards/OverviewCard"
import ProjectCard from "../components/cards/ProjectCard"
import { Link } from "react-router-dom"
import { getOngoingProjects } from "../utils/projects"
import {
  getOngoingTasks,
  getOverdueTasks,
  getCompletedTasks,
  getOpenTasks
} from "../utils/tasks"
import { useEffect, useState } from "react"
import { type ProjectApiResponse } from "../types/projects"
import { type Task, type TaskStatus } from "../types/tasks"
import { getProjects } from "../api/projects"
import { getTasks } from "../api/tasks"
import { useAuth } from "../context/useAuth"

function Home() {
  const {token} = useAuth()
  const [projects, setProjects] = useState<ProjectApiResponse[] | null>(null)
  const [tasks, setTasks] = useState<Task[] | null>(null)

  useEffect(() => {
    const start = async () => {
      const projectsData = await getProjects(token, "all", "asc")
      const tasksData = await getTasks(token, "all", "all", "asc")
      setProjects(projectsData)
      setTasks(tasksData.data)
    }

    start()
  }, [token])

  if (!tasks || !projects) return <p> no tasks or projects available</p>

  const ongoingProjects = getOngoingProjects(projects, tasks).slice(0, 4)
  const ongoingTasks = getOngoingTasks(tasks).slice(0, 3)

  const handleTaskStatusChange = (taskId: number, newStatus: TaskStatus) => {
    setTasks((current) => {
      if (!current) return current

      return current.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    })
  }

  return (
    <section className="flex flex-col gap-10">
      {/* Overview */}
      <div className="grid gap-5 md:grid-cols-3">
        <OverviewCard
          num={getOpenTasks(tasks).length}
          title="Open Tasks"
          filter="open"
        />
        <OverviewCard
          num={getOverdueTasks(tasks).length}
          title="Overdue Tasks"
          filter="overdue"
        />
        <OverviewCard
          num={getCompletedTasks(tasks).length}
          title="Completed Tasks"
          filter="completed"
        />
      </div>

      {/* Recent Projects */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-primary-font">
            Upcoming Projects
          </h2>

          <Link
            className="flex items-center gap-2 font-body font-medium text-primary transition-colors duration-300 hover:text-primary-font"
            to="/projects"
          >
            See All Projects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6  md:grid-cols-4">
          {ongoingProjects.map((project) => (
            <ProjectCard
              key={project.id}
              {...project}
              showDaysLeft={false}
            />
          ))}
        </div>
      </section>

      {/* Upcoming Tasks */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-2xl font-bold text-primary-font">
            Upcoming Tasks
          </h2>

          <Link
            className="flex items-center gap-2 font-body font-medium text-primary transition-colors duration-300 hover:text-primary-font"
            to="/tasks"
          >
            See All Tasks
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-col gap-4">
          {ongoingTasks.map((task) => (
            <TaskCard
              key={task.id}
              {...task}
              projectName={
                projects.find((project) => project.id == task.projectId)?.name
              }
              onStatusChange={handleTaskStatusChange}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home
