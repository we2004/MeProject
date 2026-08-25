import {
  ChevronDown,
  LockKeyhole,
  Pencil,
  Sun,
  Trash2,
  UserRound,
  LogOut,
  Check
} from "lucide-react"
import SecondaryButton from "../components/buttons/SecondaryButton"
import { useAuth } from "../context/useAuth"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import DeleteModal from "../components/modals/DeleteModal"
import ErrorCard from "../components/cards/ErrorCard"
import Spinner from "../components/loading/spinners/Spinner"

function Settings() {
  const { user, signout, removeAccount, changeName, loading, error } = useAuth()

  const navigate = useNavigate()
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditName, setIsEditName] = useState(false)
  const [name, setName] = useState("")
  const [actionError, setActionError] = useState<{
    id: number
    message: string
  } | null>(null)

  const handleLogout = async () => {
    const success = await signout()
    if (success) navigate("/")
  }

  const handleDeleteAccount = async () => {
    if (user?.isDemo) {
      setActionError({
        id: Date.now(),
        message: "Can't Delete a Demo User"
      })
      return
    }

    const success = await removeAccount()

    if (success) {
      navigate("/")
    }
  }

  const handleUpdateName = async (newName: string) => {
    if (user?.isDemo) {
      setActionError({
        id: Date.now(),
        message: "Can't Edit a Demo User"
      })
      setIsEditName(false)
      return
    }

    const success = await changeName(newName)

    if (success) {
      setIsEditName(false)
    }
  }

  const handleChangePassword = async () => {
    if (user?.isDemo) {
      setActionError({
        id: Date.now(),
        message: "Can't Edit a Demo User"
      })
      return
    }

    navigate("/forgot-password")
  }

  return (
    <section className="animate-fade-in flex flex-col gap-8">
      <div className="fixed right-6 top-25 z-9999 flex flex-col gap-3">
        {error && <ErrorCard message={error} />}
        {actionError && (
          <ErrorCard
            message={actionError.message}
            key={actionError.id}
          />
        )}
      </div>

      {isDeleteModalOpen && (
        <DeleteModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteAccount}
          btnText="Delete Account"
          message=" This action cannot be undone. Your account and all associated
          projects, tasks, notes, and attachments will be permanently deleted."
          title="Delete Account"
          loading={loading}
        />
      )}
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
        <div className="border-b border-primary/10 px-6 py-3">
          <h2 className="font-heading text-xl font-semibold text-primary-font">
            Account
          </h2>
        </div>

        <div className="flex flex-col gap-6 p-6">
          {/* Profile */}
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center gap-4 ">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="h-4 w-4" />
              </div>

              <div className=" min-w-40">
                <p className="font-body font-medium text-primary-font">Name</p>

                {user && (
                  <p
                    className={`mt-1 font-body text-sm text-primary-font/60 ${isEditName && "hidden"}`}
                  >
                    {user.name}
                  </p>
                )}

                {isEditName && (
                  <input
                    type="text"
                    className="rounded-2xl mt-1 border border-primary/45 bg-white p-2 font-body text-sm  text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}
              </div>
            </div>

            {user && (
              <>
                {!isEditName && (
                  <SecondaryButton
                    Icon={Pencil}
                    onClickFun={() => {
                      setName(user.name)
                      setIsEditName(true)
                    }}
                    disabled={loading}
                  >
                    Edit Profile
                  </SecondaryButton>
                )}
                {isEditName && (
                  <button
                    disabled={loading}
                    onClick={async () => await handleUpdateName(name)}
                  >
                    {loading ? (
                      <Spinner
                        size="sm"
                        color="dark"
                      />
                    ) : (
                      <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
                    )}
                  </button>
                )}
              </>
            )}
          </div>

          <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center justify-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <LockKeyhole className="h-4 w-4" />
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

            <SecondaryButton
              Icon={Pencil}
              onClickFun={handleChangePassword}
            >
              Change Password
            </SecondaryButton>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-3xl border border-primary/15 bg-white shadow-sm">
        <div className="border-b border-primary/10 px-6 py-3">
          <h2 className="font-heading text-xl font-semibold text-primary-font">
            Appearance
          </h2>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between p-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sun className="h-4 w-4" />
            </div>

            <p className="font-body font-medium text-primary-font">Theme</p>
          </div>

          <button className="flex min-w-28 shrink-0 items-center justify-between gap-3 rounded-2xl border border-primary/15 bg-white px-4 py-3 font-body text-sm font-medium text-primary-font shadow-sm transition-all duration-300 hover:border-primary/60 hover:shadow-md">
            Light
            <ChevronDown className="h-4 w-4 text-primary-font/50" />
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-3xl border border-red-900/15 bg-white shadow-sm">
        <div className="border-b border-red-900/10 px-6 py-3">
          <h2 className="font-heading text-xl font-semibold text-red-900">
            Danger Zone
          </h2>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between p-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <LogOut className="h-4 w-4" />
            </div>

            <div>
              <p className="font-body font-medium text-primary-font">Log out</p>

              <p className="mt-1 font-body text-sm text-primary-font/60">
                Sign out of your account. You can log in again anytime.
              </p>
            </div>
          </div>

          <SecondaryButton
            bgHoverColor="hover:bg-redT"
            onClickFun={handleLogout}
          >
            Log out
          </SecondaryButton>
        </div>

        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between p-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Trash2 className="h-4 w-4" />
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

          <SecondaryButton
            bgHoverColor="hover:bg-redT"
            onClickFun={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </SecondaryButton>
        </div>
      </div>
    </section>
  )
}

export default Settings
