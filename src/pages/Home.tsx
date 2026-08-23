import { ArrowRight } from "lucide-react"

import TaskCard from "../components/cards/TaskCard"
import OverviewCard from "../components/cards/OverviewCard"
import ProjectCard from "../components/cards/ProjectCard"
import { Link } from "react-router-dom"
import { calculateProgress, getOngoingProjects } from "../utils/projects"
import {
  getOngoingTasks,
  getOverdueTasks,
  getCompletedTasks,
  getOpenTasks
} from "../utils/tasks"
import { useAuth } from "../context/useAuth"
import useProjects from "../hooks/useProjects"
import useTasks from "../hooks/useTasks"
function Home() {
  const { token } = useAuth()
  const { projects } = useProjects(token, "all", "asc")
  const { tasks, updateTask } = useTasks(token, "all", "all", "asc")

  const ongoingProjects = getOngoingProjects(projects, tasks).slice(0, 4)
  const ongoingTasks = getOngoingTasks(tasks).slice(0, 3)

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
              progress={calculateProgress(project.id, tasks)}
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
              onUpdate={(field, data) => updateTask(task.id, field, data)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Home
