import SecondaryButton from "./SecondaryButton"
import { ArrowDownUp } from "lucide-react"


type SortByDateButtonProps = {
  onToggle: () => void
}


function SortByDateButton({ onToggle }: SortByDateButtonProps) {
  return (
    <SecondaryButton
      Icon={ArrowDownUp}
      onClickFun={onToggle}
    >
      Sort by Date
    </SecondaryButton>
  )
}

export default SortByDateButton
