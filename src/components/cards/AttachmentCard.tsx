import { Download, File, FileText, Image, Link } from "lucide-react"
import { type AttachmentCardProps } from "../../types/attachments"

function AttachmentCard({  type, name }: AttachmentCardProps) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl border border-primary/15 bg-white p-4 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {type === "link" ? (
            <Link className="h-5 w-5" />
          ) : type === "png" || type === "jpg" || type === "svg" ? (
            <Image className="h-5 w-5" />
          ) : type === "pdf" || type === "md" || type === "txt" ? (
            <FileText className="h-5 w-5" />
          ) : (
            <File className="h-5 w-5" />
          )}
        </div>

        <span className="font-body text-primary-font">{name}</span>
      </div>

      <div className="flex items-center gap-2">
        {type !== "link" && (
          <button className="rounded-xl p-2 text-primary-font/70 transition-all duration-300 hover:bg-primary/10 hover:text-primary">
            <Download className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  )
}

export default AttachmentCard
