import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings
} from "lucide-react"
import SidebarButton from "./buttons/SidebarButton"

type SidebarProps = {
  isSideBarOpen: boolean
  close: () => void
}

function Sidebar({ isSideBarOpen, close }: SidebarProps) {
  const links = [
    {
      Icon: LayoutDashboard,
      text: "Home",
      path: "home"
    },
    {
      Icon: FolderKanban,
      text: "Projects",
      path: "projects"
    },
    {
      Icon: CheckSquare,
      text: "Tasks",
      path: "tasks"
    },
    {
      Icon: Settings,
      text: "Settings",
      path: "settings"
    }
  ]

  return (
    <aside
      className={` ${isSideBarOpen ? "opacity-100" : "opacity-0"} md:opacity-100 h-screen flex-col items-center border-r border-primary/15 bg-primary/20 p-4 shadow-md backdrop-blur-sm transition-all duration-300  fixed
        w-24
        z-80
      
      `}
    >
      <nav className="flex flex-1 flex-col gap-7">
        {links.map((link) => (
          <SidebarButton
            {...link}
            key={link.text}
            close={close}
          />
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
