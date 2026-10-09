import { useEffect, useRef, useState } from "react"
import { Download, File, FileText, Image, RotateCw, Trash2 } from "lucide-react"
import { type AttachmentCardProps } from "../../types/attachments"
import Spinner from "../loading/spinners/Spinner"

function AttachmentCard({
  id,
  name,
  type,
  file,
  deleting,
  onDownload,
  onView,
  onDelete,
  onRequest,
  onCancel
}: AttachmentCardProps) {
  const tileRef = useRef<HTMLDivElement>(null)
  const [imageFailed, setImageFailed] = useState(false)

  const isImage = type === "png" || type === "jpg" || type === "jpeg" || type === "svg"
  const isText = type === "md" || type === "txt"
  const status = file?.status

  // Previews load when the tile is near the viewport, and are dropped if still queued once it leaves
  useEffect(() => {
    const tile = tileRef.current
    if (!tile || !(isImage || isText) || status === "ready" || status === "error") return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onRequest(id, type)
        else onCancel(id)
      },
      { rootMargin: "200px" }
    )

    observer.observe(tile)

    return () => observer.disconnect()
  }, [id, type, isImage, isText, status, onRequest, onCancel])

  const fileLook = (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {isImage ? (
          <Image className="h-7 w-7" />
        ) : isText || type === "pdf" ? (
          <FileText className="h-7 w-7" />
        ) : (
          <File className="h-7 w-7" />
        )}
      </div>

      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-body text-xs font-medium uppercase text-primary">
        {type}
      </span>
    </div>
  )

  const hasPreview = isImage || isText
  const isLoading = hasPreview && (!file || status === "loading")
  const hasFailed = hasPreview && status === "error"

  return (
    <div
      ref={tileRef}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-white shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-md"
    >
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-primary/5">
        {isLoading ? (
          <div className="h-full w-full animate-pulse bg-primary/10" />
        ) : hasFailed ? (
          <div className="flex flex-col items-center gap-2 px-3 pb-10 text-center">
            <File className="h-7 w-7 text-primary/60" />
            <span className="font-body text-xs text-primary-font/60">
              Couldn't load preview
            </span>
          </div>
        ) : isImage && file?.url && !imageFailed ? (
          <img
            src={file.url}
            alt={`Preview of ${name}`}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : isText && file?.text?.trim() ? (
          <p className="line-clamp-6 h-full w-full overflow-hidden whitespace-pre-wrap break-words p-4 text-start font-body text-xs leading-5 text-primary-font/70">
            {file.text.slice(0, 200)}
          </p>
        ) : (
          fileLook
        )}

        <button
          type="button"
          onClick={() => onView(id)}
          aria-label={`View ${name}`}
          className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
        />

        {hasFailed && (
          <button
            type="button"
            onClick={() => onRequest(id, type)}
            aria-label={`Retry loading preview of ${name}`}
            className="absolute inset-x-0 bottom-3 mx-auto flex w-fit items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 font-body text-xs text-primary-font shadow-sm transition-all duration-300 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Retry
          </button>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 p-3">
        <span
          title={name}
          className="min-w-0 truncate font-body text-primary-font md:text-base text-sm"
        >
          {name}
        </span>

        <button
          type="button"
          onClick={() => onDownload(id, name)}
          aria-label={`Download ${name}`}
          className="shrink-0 rounded-xl p-2 text-primary-font/70 transition-all duration-300 hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onDelete(id)}
        disabled={deleting}
        aria-label={`Delete ${name}`}
        className="absolute end-2 top-2 flex h-9 w-9 items-center justify-center rounded-xl border border-primary/15 bg-white/90 text-primary-font shadow-sm transition-all duration-300 hover:bg-redT hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {deleting ? (
          <Spinner
            size="sm"
            color="dark"
          />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>
    </div>
  )
}

export default AttachmentCard
