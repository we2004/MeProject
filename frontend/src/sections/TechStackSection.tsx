import { useState } from "react"
import { Plus } from "lucide-react"
import TechBadge from "../components/badges/TechBadge"
type TechStackSectionProps = {
  techStack?: string[]
  onAddTech: (tech: string) => void
  onDeleteTech: (tech: string) => void
}

function TechStackSection({
  techStack,
  onAddTech,
  onDeleteTech
}: TechStackSectionProps) {
  const [tech, setTech] = useState("")

  return (
    <>
      <div className="flex gap-2">
        <input
          id="tech-stack"
          type="text"
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          placeholder="e.g. React, TypeScript, Tailwind CSS"
          className="flex-1 rounded-2xl border border-primary/15 bg-white md:px-4 px-1 py-3 font-body text-sm text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />

        <button
          className="flex items-center justify-center rounded-2xl border border-primary/15 bg-white w-9 h-9 text-primary-font shadow-sm transition-all duration-300 hover:border-primary/60 hover:bg-primary hover:text-white hover:shadow-md"
          onClick={() => {
            onAddTech(tech)
            setTech("")
          }}
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Mock Tech Stack */}
      <div className="mt-2 flex flex-wrap gap-2">
        {techStack &&
          techStack.map((tech, idx) => (
            <TechBadge
              key={`${tech} - ${idx}`}
              tech={tech}
              onDelete={() => onDeleteTech(tech)}
            />
          ))}

          
      </div>
    </>
  )
}

export default TechStackSection
