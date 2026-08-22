import { Search, UserRound } from "lucide-react"
import logo from "../assets/logo2.png"
import { useAuth } from "../context/useAuth"
import { getUser } from "../api/auth"
import { useState, useEffect } from "react"
import { type User } from "../types/auth"
import { Link } from "react-router-dom"

function Header() {
  const { token } = useAuth()
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined)

  useEffect(() => {
    const start = async () => {
      const user = await getUser(token)

      setCurrentUser(user)
    }

    start()
  })

  if (!currentUser) return <p>no user found</p>


  return (
    <header className="border border-primary/15 px-4 py-3 shadow-sm backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex items-center gap-3 ">
        <div className="flex items-center gap-1 ">
          <img
            src={logo}
            className="flex h-12 w-12 items-center justify-center"
          />

          <div className="hidden sm:flex sm:flex-col ">
            <span className="font-heading text-lg font-semibold tracking-tight text-primary-font ">
              MeProject
            </span>
            <span className="font-body text-sm text-primary-font/70">
              Management Suite
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <label className="group flex items-center gap-3 rounded-2xl border border-primary/15 bg-white/80 px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md">
            <Search className="h-4 w-4 text-primary-font/60 transition-colors duration-300 group-hover:text-primary" />
            <input
              type="text"
              placeholder="Search projects"
              className="w-full border-none bg-transparent font-body text-sm text-primary-font outline-none placeholder:text-primary-font/50"
            />
          </label>
        </div>

        <div className="flex items-center self-end sm:self-auto">
          <Link to='/settings' className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-white/80 px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/60 ">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-font">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="hidden md:flex md:flex-col md:text-left">
              <p className="font-heading text-sm font-semibold text-primary-font">
               {currentUser.isDemo? "Guest" : currentUser.name}
              </p>
            
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
