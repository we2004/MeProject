import { type LucideIcon } from "lucide-react"
import { NavLink } from "react-router-dom"
type SidebarButtonProps = {
  Icon: LucideIcon
  text: string
  path: string
  close: () => void
}

function SidebarButton({ Icon, text, path, close }: SidebarButtonProps) {
  return (
    <NavLink
      to={path}
      onClick={close}
      className={({ isActive }) =>
        `group flex h-15 w-17 flex-col items-center justify-center rounded-2xl text-center transition-all duration-300 ${
          isActive
            ? "bg-primary text-white shadow-md"
            : "text-primary-font hover:-translate-y-0.5 hover:bg-primary/80 hover:text-white hover:shadow-md"
        }`
      }
    >
      <Icon className="h-6 w-6 shrink-0 transition-colors duration-300 group-hover:text-white" />

      <p className="text-sm mt-1 font-heading font-semibold">{text}</p>
    </NavLink>
  )
}

export default SidebarButton
