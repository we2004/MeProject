import { Routes, Route } from "react-router-dom"
import Projects from "./pages/Projects"
import Home from "./pages/Home"
import Tasks from "./pages/Tasks"
import ProjectsDetails from "./pages/ProjectDetails"
import TaskDetails from "./pages/TaskDetails"
import Settings from "./pages/Settings"
import AppLayout from "./layouts/AppLayout"
import AuthLayout from "./layouts/AuthLayout"
import Welcome from "./authentication/Welcome"
import Register from "./authentication/Register"
import Login from "./authentication/Login"
import ForgotPassword from "./authentication/ForgotPassword"
import Recovery from "./authentication/Recovery"

function App() {


  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route
          index
          element={<Welcome />}
        />

        <Route
          path="register"
          element={<Register />}
        />

        <Route
          path="login"
          element={<Login />}
        />
      </Route>

      <Route
        path="forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="recovery"
        element={<Recovery />}
      />

      <Route element={<AppLayout />}>
        <Route
          path="home"
          element={<Home />}
        />
        <Route
          path="projects"
          element={<Projects />}
        />
        <Route
          path="tasks"
          element={<Tasks />}
        />

        <Route
          path="projectDetails/:projectId"
          element={<ProjectsDetails />}
        />

        <Route
          path="taskDetails/:taskId"
          element={<TaskDetails />}
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
