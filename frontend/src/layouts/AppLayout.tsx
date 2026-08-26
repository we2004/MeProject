import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import ScrollToTop from "../components/ScrollToTop"
import { useState } from "react"

function AppLayout() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  const handleToggleSidebar = () => {
    setIsSideBarOpen((c) => !c)
  }

  const handleCloseSidebar = () => {
    setIsSideBarOpen(false)
  }
  return (
    <>
      <ScrollToTop />
      <Header
        onToggleSidebar={handleToggleSidebar}
        showMenu={isSideBarOpen}
      />
      <Sidebar
        isSideBarOpen={isSideBarOpen}
        close={handleCloseSidebar}
      />
      <div className=" ml-0 md:ml-24 transition-all duration-300 md:py-10 md:px-10 py-10 px-6">
        <Outlet />
      </div>

    </>
  )
}

export default AppLayout
