import {
  Camera,
  ChevronDown,
  LockKeyhole,
  Mail,
  Moon,
  Pencil,
  Sun,
  Trash2,
  UserRound
} from "lucide-react"
import SecondaryButton from "../components/buttons/SecondaryButton"

function Settings() {
  return (
    <section className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary-font">
          Settings
        </h1>

        <p className="mt-2 font-body text-primary-font/70">
          Manage your account and application preferences.
        </p>
      </div>

      {/* Account */}
      <div className="rounded-3xl border border-primary/15 bg-white shadow-sm">
        <div className="border-b border-primary/10 px-6 py-5">
          <h2 className="font-heading text-xl font-semibold text-primary-font">
            Account
          </h2>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* Profile */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserRound className="h-7 w-7" />
                </div>

                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-primary text-white shadow-sm transition-all duration-300 hover:scale-105">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Email */}
              <div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />

                  <p className="font-body text-sm text-primary-font/60">
                    Email
                  </p>
                </div>

                <p className="mt-1 font-body font-medium text-primary-font">
                  alicia@example.com
                </p>
              </div>
            </div>

            <SecondaryButton Icon={Pencil}>Edit Profile</SecondaryButton>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="rounded-3xl border border-primary/15 bg-white shadow-sm">
        <div className="border-b border-primary/10 px-6 py-5">
          <h2 className="font-heading text-xl font-semibold text-primary-font">
            Security
          </h2>
        </div>

        <div className="flex items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" />
            </div>

            <div>
              <p className="font-body font-medium text-primary-font">
                Password
              </p>

              <p className="mt-1 font-body text-sm text-primary-font/60">
                Keep your account secure with a strong password.
              </p>
            </div>
          </div>

          <SecondaryButton Icon={LockKeyhole}>Change Password</SecondaryButton>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-3xl border border-primary/15 bg-white shadow-sm">
        <div className="border-b border-primary/10 px-6 py-5">
          <h2 className="font-heading text-xl font-semibold text-primary-font">
            Appearance
          </h2>
        </div>

        <div className="flex items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sun className="h-5 w-5" />
            </div>

            <div>
              <p className="font-body font-medium text-primary-font">Theme</p>

              <p className="mt-1 font-body text-sm text-primary-font/60">
                Choose how ProjectFlow looks.
              </p>
            </div>
          </div>

          <button className="flex min-w-28 shrink-0 items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-sm font-medium text-primary-font shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-md">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              Light
            </div>

            <ChevronDown className="h-4 w-4 text-primary-font/50" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl border border-red-900/15 bg-white shadow-sm">
        <div className="border-b border-red-900/10 px-6 py-5">
          <h2 className="font-heading text-xl font-semibold text-red-900">
            Danger Zone
          </h2>
        </div>

        <div className="flex items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-900/10 text-red-900">
              <Trash2 className="h-5 w-5" />
            </div>

            <div>
              <p className="font-body font-medium text-primary-font">
                Delete Account
              </p>

              <p className="mt-1 font-body text-sm text-primary-font/60">
                Permanently delete your account and all associated data.
              </p>
            </div>
          </div>

          <button className="flex shrink-0 items-center gap-2 rounded-2xl border border-red-900/20 bg-white px-5 py-3 font-body text-sm font-medium text-red-900 transition-all duration-300 hover:bg-red-900 hover:text-white hover:shadow-md">
            <Trash2 className="h-4 w-4" />
            Delete Account
          </button>
        </div>
      </div>
    </section>
  )
}

export default Settings
