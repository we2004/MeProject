import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

function AppLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <div className="ml-24 transition-all duration-300 p-10">
        <Outlet />
      </div>
    </>
  )
}

export default AppLayout
