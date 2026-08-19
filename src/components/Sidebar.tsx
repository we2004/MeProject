import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Settings,
} from "lucide-react"
import SidebarButton from "./buttons/SidebarButton"


function Sidebar() {
  const links = [
    {
      Icon: LayoutDashboard,
      text: "Home",
      path: "/"
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
      className="flex h-screen flex-col items-center border-r border-primary/15 bg-primary/20 p-4 shadow-md backdrop-blur-sm transition-all duration-300 fixed
        w-24
      "
    >
      

      <nav className="flex flex-1 flex-col gap-7">
        {links.map((link) => (
          <SidebarButton
            {...link}
            key={link.text}
          />
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
