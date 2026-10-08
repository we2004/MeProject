import { UserRound, MenuIcon, X } from "lucide-react"
import logo from "../assets/logo2.png"
import { useAuth } from "../context/useAuth"
import { Link } from "react-router-dom"

type HeaderProps = {
  onToggleSidebar: () => void
  showMenu: boolean
}
function Header({ onToggleSidebar, showMenu }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="border border-primary/15 px-4 py-3 shadow-sm backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex items-center justify-between gap-3 ">
        <div className="flex items-center gap-1 ">
          <img
            src={logo}
            className="flex h-12 w-12 items-center justify-center"
          />

          <div className="flex items-center justify-center ">
            <div className="hidden md:flex md:flex-col ">
              <span className="font-heading text-lg font-semibold tracking-tight text-primary-font ">
                MeProject
              </span>
              <span className="font-body text-sm text-primary-font/70">
                Management Suite
              </span>
            </div>

            <button
              className=" ml-2 cursor-pointer block md:hidden"
              onClick={onToggleSidebar}
            >
              {showMenu ? (
                <X className="text-primary-font" />
              ) : (
                <MenuIcon className="text-primary-font" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center self-end sm:self-auto">
          <Link
            to="/settings"
            className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-white/80 px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/60 "
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-font">
              <UserRound className="h-5 w-5" />
            </div>
            {user && (
              <div className="flex flex-col text-left">
                <p className="font-heading text-sm font-semibold text-primary-font">
                  {user.name}
                </p>
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
