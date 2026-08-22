import { type LucideIcon } from "lucide-react"

type SecondaryButtonProps = {
  Icon?: LucideIcon
  onClickFun?: () => void
  children: React.ReactNode
  bgHoverColor?: string
  bgColor?: string
}

function SecondaryButton({
  Icon,
  onClickFun,
  children,
  bgHoverColor,
  bgColor
}: SecondaryButtonProps) {
  return (
    <button
      className={`flex items-center w-fit gap-2 rounded-2xl border border-primary/15 ${bgColor ? bgColor : " bg-white text-primary-font"} px-4 py-3 font-body shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md ${bgHoverColor ? bgHoverColor : "hover:bg-secondary"} hover:text-white`}
      onClick={onClickFun}
    >
      {Icon ? <Icon className="h-4 w-4" /> : ""}
      {children}
    </button>
  )
}

export default SecondaryButton
