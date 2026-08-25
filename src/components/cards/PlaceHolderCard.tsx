import PrimaryButton from "../buttons/PrimaryButton"
import { useNavigate } from "react-router-dom"

type PlaceHolderCardProps = {
  message: string
  navigateTo?: string
  btnTitle?: string
}

function PlaceHolderCard({
  message,
  navigateTo,
  btnTitle
}: PlaceHolderCardProps) {
  const navigate = useNavigate()
  const handleCreate = () => {
    navigate(navigateTo || "")
  }
  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 bg-white/50 md:py-15 py-8 rounded-3xl">
      <p className="md:text-2xl md:px-0 px-2 font-heading text-primary-font/80 text-center font-semibold">
        {message}
      </p>

      {btnTitle && (
        <PrimaryButton onClickFun={handleCreate}>{btnTitle}</PrimaryButton>
      )}
    </div>
  )
}

export default PlaceHolderCard
