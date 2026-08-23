import { X } from "lucide-react"

type TechBadgeProps = {
  tech: string
  onDelete : (tech:string) => Promise<void>
}

function TechBadge({ tech, onDelete }: TechBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-full bg-primary/20 px-3 py-1.5 font-body text-[12px] font-medium text-primary-font">
      {tech}
      <button onClick={async () => {onDelete(tech)}} className="rounded-full p-0.5 text-primary-font/50 transition-colors duration-200 hover:bg-primary/20 hover:text-primary" >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export default TechBadge
