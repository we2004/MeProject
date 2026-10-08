import { Outlet, Navigate } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import ScrollToTop from "../components/ScrollToTop"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../context/AuthContext"

// This only avoids pointless requests; the backend remains responsible for security.
function hasUsableExpiry(token: string) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3 || !/^[A-Za-z0-9_-]+$/.test(parts[1])) return false

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const payload = JSON.parse(atob(paddedBase64)) as { exp?: unknown }
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return false
    }

    if (payload.exp === undefined) return true
    return typeof payload.exp === "number" && payload.exp > Date.now() / 1000
  } catch {
    return false
  }
}

function AppLayout() {
  const auth = useContext(AuthContext)
  const [isSideBarOpen, setIsSideBarOpen] = useState(false)

  if (!auth) {
    throw new Error("AppLayout must be used inside AuthContextProvider")
  }

  const { token, setToken } = auth
  const tokenIsUsable = Boolean(token) && hasUsableExpiry(token)

  useEffect(() => {
    if (token && !tokenIsUsable) setToken("")
  }, [token, tokenIsUsable, setToken])

  const handleToggleSidebar = () => {
    setIsSideBarOpen((c) => !c)
  }

  const handleCloseSidebar = () => {
    setIsSideBarOpen(false)
  }

  if (!tokenIsUsable) return <Navigate to="/" replace />

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
