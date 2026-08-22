import {
  ChevronDown,
  LockKeyhole,
  Moon,
  Pencil,
  Sun,
  Trash2,
  UserRound,
  LogOut,
  Check,
  Edit3
} from "lucide-react"
import SecondaryButton from "../components/buttons/SecondaryButton"
import { useAuth } from "../context/useAuth"
import { deleteAccount, getUser, logout, updateName } from "../api/auth"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import type { User } from "../types/auth"
import DeleteAccountModal from "../components/modals/DeleteAccountModal"

function Settings() {
  const { token, setToken } = useAuth()
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditName, setIsEditName] = useState(false)
  const [name, setName] = useState("")

  const handleLogout = async () => {
    await logout(token)
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  const handleDeleteAccount = async () => {
    if (currentUser?.isDemo) {
      alert("Can't Delete a Demo User")
      return
    }

    await deleteAccount(token)
    localStorage.removeItem("token")
    setToken("")
    navigate("/")
  }

  const handleUpdateName = async (newName: string) => {
    if (!currentUser) return

    if (currentUser?.isDemo) {
      alert("Can't Edit a Demo User")
      setIsEditName(false)
      setName(currentUser.name)
      return
    }

    const response = await updateName(token, newName)
    setName(response.name)
    setCurrentUser({
      ...currentUser,
      name: response.name
    })
    setIsEditName(false)
  }

  const handleChangePassword = async () => {
    if (currentUser?.isDemo) {
      alert("Can't Edit a Demo User")
      return
    }

    navigate("/forgot-password")
  }

  useEffect(() => {
    const start = async () => {
      const user = await getUser(token)
      setName(user.name)

      setCurrentUser(user)
    }

    start()
  }, [token])

  if (!currentUser) return <p>user not found</p>
  return (
    <section className="flex flex-col gap-8">
      {isDeleteModalOpen && (
        <DeleteAccountModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteAccount}
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

                <p
                  className={`mt-1 font-body text-sm text-primary-font/60 ${isEditName && "hidden"}`}
                >
                  {currentUser.name}
                </p>

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

            {!isEditName && (
              <SecondaryButton
                Icon={Pencil}
                onClickFun={() => setIsEditName(true)}
              >
                Edit Profile
              </SecondaryButton>
            )}
            {isEditName && (
              <button onClick={async () => await handleUpdateName(name)}>
                <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
              </button>
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
            Icon={LogOut}
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
            Icon={Trash2}
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
