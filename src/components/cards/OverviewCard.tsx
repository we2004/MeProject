import { Link } from "react-router-dom"

type OverviewCardProps = {
  num: number
  title: string
  filter: string
}

function OverviewCard({ num, title, filter }: OverviewCardProps) {
  return (
    <Link className=" flex flex-col items-center text-center rounded-3xl border border-primary/15 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg" to={`/tasks?filter=${filter}`}>
        <span className="font-heading text-5xl font-bold text-primary-font">
          {num}
        </span>

        <span className="mt-3 font-body text-primary-font/70">{title}</span>
    </Link>
  )
}

export default OverviewCard
