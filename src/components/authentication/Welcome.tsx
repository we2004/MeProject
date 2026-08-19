import { Compass, LogIn, UserPlus } from "lucide-react"
import { Link } from "react-router-dom"
import logo from "../../assets/logo.svg"
function Welcome() {
  return (
    <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
      <div className="flex  items-center w-full max-w-md flex-col">
        {/* Heading */}

        <img src={logo} className="w-40 mb-4" />
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-font sm:text-4xl">
            Welcome to MeProject
          </h1>

          <p className="mt-4 font-body text-md text-primary-font/65">
            For Effectivity, Productivity and All the Other -ivities!!
          </p>
        </div>

        {/* Main Actions */}
        <div className="mt-10 flex flex-col gap-4 w-80">
          <button className="group flex w-full items-center justify-between rounded-2xl bg-primary px-5 py-4 font-body font-medium text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <span className="flex items-center gap-3">
              <UserPlus className="h-5 w-5" />
              Create Account
            </span>

          </button>

          <Link to={'/home'} className="group flex w-full items-center justify-between rounded-2xl border border-primary/15 bg-white px-5 py-4 font-body font-medium text-primary-font shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
            <span className="flex items-center gap-3">
              <Compass className="h-5 w-5 text-primary" />
              Explore App
            </span>

          </Link>
        </div>

        {/* Login */}
        <div className="mt-10 flex items-center justify-center gap-1.5 font-body text-sm text-primary-font/60">
          <span>Already have an account?</span>

          <button className="flex items-center gap-1 font-medium text-primary transition-colors duration-300 hover:text-primary-font">
            Log In
            <LogIn className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome
