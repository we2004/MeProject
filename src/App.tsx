import { Routes, Route } from "react-router-dom"
import Projects from "./pages/Projects"
import Home from "./pages/Home"
import AppLayout from "./layouts/AppLayout"
import Tasks from "./pages/Tasks"
import ProjectsDetails from "./pages/ProjectDetails"
import TaskDetails from "./pages/TaskDetails"
import Settings from "./pages/Settings"
import { useState, useEffect } from "react"
import axios from "axios"
const BASE_URL = import.meta.env.VITE_BASE_URL

function App() {


  const [token, setToken] = useState<string>('')
  useEffect(() => {
    const startExplore = async () => {
      const response = await axios.post(`${BASE_URL}/auth/explore`)

      setToken(response.data.token)
    }

    startExplore()
  }, [])
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route
          index
          element={<Home token={token}/>}
        />
        <Route
          path="projects"
          element={<Projects token={token}/>}
        />
        <Route
          path="tasks"
          element={<Tasks token={token}/>}
        />

        <Route
          path="projectDetails/:projectId"
          element={<ProjectsDetails token={token}/>}
        />

        <Route
          path="taskDetails/:taskId"
          element={<TaskDetails token={token}/>}
        />

        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>
    </Routes>
  )
}
export default App
