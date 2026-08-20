import { LogIn, Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  return (
    <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
      <div className="w-full max-w-md">
        {/* Logo */}

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-primary-font sm:text-4xl">
            Welcome back
          </h1>

          <p className="mt-2 font-body text-sm text-primary-font/60">
            Log in to continue managing your projects.
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
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

              <Link to="/forgot-password" className="font-body text-xs font-medium text-primary transition-colors duration-300 hover:text-primary-font">
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                minLength={6}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-primary/15 bg-white py-3.5 px-4 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <button
                className="absolute right-4  top-1/2 cursor-pointer"
                onClick={() => setShowPassword((c) => !c)}
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
          <Link
            to="/home"
            className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-primary/15 bg-primary px-4 py-3 font-body text-white shadow-sm transition-all text-center duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-secondary"
          >
            <LogIn className="h-5 w-5 mr-2" />
            Log In
          </Link>
        </div>

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
