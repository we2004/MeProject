import type { NoteCardProps } from "../../types/notes"
import dayjs from "dayjs"
function NoteCard({ content, createdAt }: NoteCardProps) {
  return (
    <div className="flex justify-between rounded-2xl border border-primary/15 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md">
      <p className="font-body leading-7 text-primary-font/70">{content}</p>
      <div className="flex gap-2 items-center justify-center">
        <div className=" text-primary-font/70">{dayjs(createdAt).format("MMMM D, YYYY")}</div>
      </div>
    </div>
  )
}

export default NoteCard
