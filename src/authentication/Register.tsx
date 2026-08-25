import { UserPlus, Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import type { NewUser } from "../types/auth"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth"
import Spinner from "../components/loading/spinners/Spinner"
import ErrorCard from "../components/cards/ErrorCard"
function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")

  const navigate = useNavigate()

  const { loading, registerUser, error } = useAuth()

  const handleCreateAccount = async (e: React.SubmitEvent) => {
    e.preventDefault()
    const newUser: NewUser = {
      name: name,
      password: password,
      username: username
    }

    const response = await registerUser(newUser)
    if (response)
      navigate("/recovery", {
        state: { recoveryKey: response.recoveryKey }
      })
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
            Create your account
          </h1>

          <p className="mt-2 font-body text-sm text-primary-font/60">
            Start organizing your projects and tasks.
          </p>
        </div>

        {/* Form */}
        <form
          className="flex flex-col gap-5 mt-10"
          onSubmit={(e) => handleCreateAccount(e)}
        >
          {/* name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="font-body text-sm font-medium text-primary-font"
            >
              Name
            </label>

            <input
              required
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter your username"
              className="w-full rounded-2xl border border-primary/15 bg-white py-3.5 px-4 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="font-body text-sm font-medium text-primary-font"
            >
              Username
            </label>

            <input
              required
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
            <label
              htmlFor="password"
              className="font-body text-sm font-medium text-primary-font"
            >
              Password
            </label>

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

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirm-password"
              className="font-body text-sm font-medium text-primary-font"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                required
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                minLength={6}
                placeholder="Enter your password again"
                className="w-full rounded-2xl border border-primary/15 bg-white py-3.5 px-4 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
              />

              <button
                onClick={() => setShowConfirmPassword((c) => !c)}
                className="absolute right-4  top-1/2 cursor-pointer"
                type="button"
              >
                {showConfirmPassword ? (
                  <Eye className="h-5 w-5 -translate-y-1/2 text-primary-font/40" />
                ) : (
                  <EyeClosed className="h-5 w-5 -translate-y-1/2 text-primary-font/40" />
                )}
              </button>
            </div>
          </div>

          {/* Create Account */}
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
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
