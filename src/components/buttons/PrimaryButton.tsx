import { type LucideIcon } from "lucide-react"

type PrimaryButtonProps = {
  Icon?: LucideIcon
  onClickFun?: () => void
  children: React.ReactNode
  disabled?: boolean
}
function PrimaryButton({
  Icon,
  onClickFun,
  children,
  disabled
}: PrimaryButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClickFun}
      className="flex w-fit items-center gap-2 rounded-2xl border border-primary/15 bg-primary px-4 py-3 font-body text-white shadow-sm transition-all text-center duration-300 hover:-translate-y-0.5 hover:shadow-md hover:bg-secondary "
    >
      {Icon ? <Icon className="h-5 w-5" /> : ""}
      {children}
    </button>
  )
}

export default PrimaryButton
