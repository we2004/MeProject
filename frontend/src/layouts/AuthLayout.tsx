import { Outlet } from "react-router-dom"
import hero from '../assets/hero.gif'
function AuthLayout() {
  return (
    <main className="flex min-h-screen bg-lightBodyBackground">
      {/* Left Side - Image */}
      <div className="hidden w-1/2 overflow-hidden lg:block">
        <img
          src={hero}
          alt="Project management workspace"
          className="h-166.25 w-280 object-cover"
        />
      </div>

      <Outlet/>
    </main>
  )
}

export default AuthLayout
