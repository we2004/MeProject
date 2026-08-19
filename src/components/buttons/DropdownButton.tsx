import type { LucideIcon } from "lucide-react"
import SecondaryButton from "./SecondaryButton"
import { type MenuType } from "../../types/common"

type DropdownButton<T extends string> = {
  menuType: MenuType
  Icon: LucideIcon
  setOpenMenu: React.Dispatch<React.SetStateAction<MenuType | null>>
  showMenu: MenuType | null
  options: T[] 
  selectedOption: T 
  onSelect:  (newFilter: T) => void
  children: React.ReactNode
}

function DropdownButton<T extends string>({
  menuType,
  Icon,
  setOpenMenu,
  showMenu,
  options,
  selectedOption,
  onSelect,
  children
}: DropdownButton<T>) {

  const toggleMenu = () => {
    setOpenMenu(c => c === menuType? null : menuType)
  }
  
  return (
    <div className="relative">
      <SecondaryButton
        Icon={Icon}
        onClickFun={toggleMenu}
      >
        {children}
      </SecondaryButton>

      <div
        className={` ${
          showMenu === menuType
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } absolute top-full left-0 z-20 mt-2 w-52 rounded-2xl border border-primary/15 bg-white p-2 shadow-lg transition-opacity duration-200`}
      >
        {options.map((option) => (
          <button
            key={option}
            onClick={()=>{
              onSelect(option)
              setOpenMenu(null)
            }}
            className={`block w-full rounded-xl px-4 py-3 mt-2 text-left font-body transition-colors duration-300 hover:bg-primary/50 hover:text-white capitalize ${option === selectedOption ? "bg-primary text-white" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DropdownButton
