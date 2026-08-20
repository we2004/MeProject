import { LockKeyhole, Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"


function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="flex min-h-screen items-center justify-center bg-lightBodyBackground px-4 py-8">
      <div className="w-full max-w-md rounded-3xl border border-primary/15 bg-white p-6 shadow-lg sm:p-8">
        {/* Header */}

        <h1 className="font-heading text-3xl font-bold text-primary-font mb-4">
          Change Password
        </h1>

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

          {/* Recovery Key */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="recovery-key"
              className="font-body text-sm font-medium text-primary-font"
            >
              Recovery Key
            </label>

            <input
              id="recovery-key"
              type="text"
              placeholder="Enter your recovery key"
              className="w-full rounded-2xl border border-primary/15 bg-white py-3.5 px-4 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-body text-sm font-medium text-primary-font"
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="password"
                type="password"
                minLength={6}
                placeholder="Enter your new password"
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

          {/* Change Password */}
          <Link to='/login' className="mt-3 flex w-full items-center gap-2 rounded-2xl border border-primary/15 bg-primary px-4 py-3 font-body text-white shadow-sm transition-all text-center duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-secondary">
            <LockKeyhole className="h-5 w-5 mr-2" />
            Change Password
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ForgotPassword
