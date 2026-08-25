import { AlertCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

type ErrorCardProps = {
  message: string
  duration?: number
}

function ErrorCard({ message, duration = 3500 }: ErrorCardProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div
      className="
        flex w-[90vw] max-w-md
  items-center gap-4
  rounded-2xl
  border border-redT
  bg-redT
  px-4 py-2
  font-body text-white
  shadow-lg
  animate-fade-in
      "
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
        <AlertCircle className="h-6 w-6" />
      </div>

      <p className="flex-1 text-base font-medium">{message}</p>

      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="shrink-0 rounded-lg p-1 text-white/70 transition-colors duration-300 hover:bg-white/10 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  )
}

export default ErrorCard
