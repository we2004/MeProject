import { Search, UserRound } from "lucide-react"

function Header() {
  return (
    <header className="border border-primary/15 px-4 py-3 shadow-sm backdrop-blur-sm sticky top-0 z-40">
      <div className="mx-auto flex items-center gap-3 ">
        <div className="flex items-center gap-3 ">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-white shadow-sm">
            MP
          </div>
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
          <button className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-white/80 px-3 py-2 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/60 ">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary-font">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="hidden md:flex md:flex-col md:text-left">
              <p className="font-heading text-sm font-semibold text-primary-font">
                Wesal
              </p>
              <p className="font-body text-xs text-primary-font/60">
                Frontend Developer
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
