import { LogIn, Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import type { LogUser } from "../types/auth"
import Spinner from "../components/loading/spinners/Spinner"
import ErrorCard from "../components/cards/ErrorCard"

function Login() {
  const { loginApp, loading, error } = useAuth()
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const user: LogUser = {
      password: password,
      username: username
    }
    const success = await loginApp(user)
    if (success) navigate("/home")
  }

  return (
    <div className="animate-fade-in flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="fixed right-6 top-6 z-9999 flex flex-col gap-3">
          {error && <ErrorCard message={error} />}
        </div>
        <div className="mb-8 relative">
          <h1 className="font-heading text-3xl font-bold text-primary-font sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-2 font-body text-sm text-primary-font/60">
            Log in to continue managing your projects.
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-5 mt-10"
          onSubmit={handleLogin}
        >
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="font-body text-sm font-medium text-primary-font"
            >
              Username
            </label>

            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              placeholder="Enter your username"
              className="w-full rounded-2xl border border-primary/15 bg-white py-3.5 px-4 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="font-body text-sm font-medium text-primary-font"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="font-body text-xs font-medium text-primary transition-colors duration-300 hover:text-primary-font"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                required
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                minLength={6}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-primary/15 bg-white py-3.5 px-4 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <button
                className="absolute right-4  top-1/2 cursor-pointer"
                onClick={() => setShowPassword((c) => !c)}
                type="button"
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 -translate-y-1/2 text-primary-font/40" />
                ) : (
                  <EyeClosed className="h-5 w-5 -translate-y-1/2 text-primary-font/40" />
                )}
              </button>
            </div>

            <p className="font-body text-xs text-primary-font/50">
              Password must be at least 6 characters.
            </p>
          </div>

          {/* Login */}
          <button
            type="submit"
            className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-primary/15 bg-primary px-4 py-3 font-body text-white shadow-sm transition-all text-center duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-secondary"
          >
            {loading ? (
              <Spinner
                size="sm"
                color="light"
              />
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Log In
              </>
            )}
          </button>
        </form>

        {/* Register */}
        <div className="mt-8 flex items-center justify-center gap-1.5 font-body text-sm text-primary-font/60">
          <span>Don't have an account?</span>

          <Link
            to="/register"
            className="font-medium text-primary transition-colors duration-300 hover:text-primary-font"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
