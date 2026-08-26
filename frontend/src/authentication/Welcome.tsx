import { Compass, LogIn, UserPlus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import logo from "../assets/logo2.png"
import { useAuth } from "../context/useAuth"
import ErrorCard from "../components/cards/ErrorCard"
import Spinner from "../components/loading/spinners/Spinner"

function Welcome() {
  const navigate = useNavigate()
  const { exploreApp, error, loading } = useAuth()

  const handleExploreMode = async () => {
    const success = await exploreApp()

    if (success) {
      navigate("/home")
    }
  }

  return (
    <div className="animate-fade-in flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
      <div className="flex  items-center w-full max-w-md flex-col">
        {/* Heading */}
        <div className="fixed right-6 top-6 z-9999 flex flex-col gap-3">
          {error && <ErrorCard message={error} />}
        </div>

        <img
          src={logo}
          className="w-30 mb-4"
        />
        <div>
          <h1 className="font-heading text-4xl font-bold tracking-tight text-primary-font sm:text-4xl sm:text-left text-center">
            Welcome to MeProject
          </h1>

          <p className="mt-4 font-body text-md text-primary-font/65 sm:text-left text-center">
            For Effectivity, Productivity and All the Other -ivities!!
          </p>
        </div>

        {/* Main Actions */}
        <div className="mt-10 flex flex-col gap-4 w-80">
          <Link
            to={"/register"}
            className="flex w-full items-center gap-2 rounded-2xl border border-primary/15 bg-primary px-4 py-3 font-body text-white shadow-sm transition-all text-center duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-secondary "
          >
            <span className="flex items-center gap-3">
              <UserPlus className="h-5 w-5" />
              Create Account
            </span>
          </Link>

          <button
            onClick={handleExploreMode}
            className="group flex items-center gap-2 rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-primary-font shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md hover:bg-secondary hover:text-white"
          >
            <span className="flex items-center gap-3">
              {loading ? (
                <Spinner
                  size="sm"
                  color="dark"
                />
              ) : (
                <>
                  <Compass className="h-5 w-5 text-primary group-hover:text-white transition-all duration-300" />
                  Explore App
                </>
              )}
            </span>
          </button>
        </div>

        {/* Login */}
        <div className="mt-10 flex items-center justify-center gap-1.5 font-body text-sm text-primary-font/60">
          <span>Already have an account?</span>

          <Link
            to={"/login"}
            className="flex items-center gap-1 font-medium text-primary transition-colors duration-300 hover:text-primary-font"
          >
            Log In
            <LogIn className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Welcome
