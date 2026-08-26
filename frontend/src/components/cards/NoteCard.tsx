import type { NoteCardProps } from "../../types/notes"
import dayjs from "dayjs"

function NoteCard({ content, createdAt }: NoteCardProps) {
  return (
    <div className="flex justify-between rounded-2xl border border-primary/15 bg-white p-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md md:p-5">
      <p className="mr-4 font-body leading-7 text-primary-font/70 md:mr-0">
        {content}
      </p>

      <div className="flex items-center justify-center gap-2 text-sm text-primary-font/70 md:text-base">
        {/* Mobile */}
        <span className="md:hidden">{dayjs(createdAt).format("MMM D")}</span>

        {/* Desktop */}
        <span className="hidden md:block">
          {dayjs(createdAt).format("MMM D • h:mm A")}
        </span>
      </div>
    </div>
  )
}

export default NoteCard
