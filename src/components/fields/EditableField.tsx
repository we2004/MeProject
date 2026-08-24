import { useState } from "react"
import { Check, Edit3, Clock } from "lucide-react"
import dayjs from "dayjs"
import type { EditInfoFields } from "../../types/common"
import type { TaskStatus } from "../../types/tasks"
import Spinner from "../loading/spinners/Spinner"
type EditableFieldProps = {
  data: string
  field: EditInfoFields
  onUpdate: (
    field: EditInfoFields,
    data: string | boolean | string[] | TaskStatus
  ) => Promise<void>
  loading?: boolean
}

function EditableField({ data, field, onUpdate, loading }: EditableFieldProps) {
  const [isEditField, setIsEditField] = useState(false)
  const [value, setValue] = useState("")

  let inputField: React.JSX.Element
  let dataDisplay: React.JSX.Element
  
  if (field === "name") {
    inputField = (
      <input
        type="text"
        className="rounded-2xl border border-primary/45 bg-white px-2 py-3 font-heading text-2xl font-bold text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )

    dataDisplay = (
      <h1
        className={`font-heading text-3xl font-bold text-primary-font ${isEditField ? "hidden" : ""}`}
      >
        {data}
      </h1>
    )
  } else if (field === "description") {
    inputField = (
      <textarea
        rows={5}
        className="flex-1 max-w-260 rounded-2xl border border-primary/45 bg-white px-2 py-3 font-body text-primary-font/70 outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )

    dataDisplay = (
      <p
        className={`flex-1  leading-7 text-primary-font/70 ${isEditField ? "hidden" : ""}`}
      >
        {data}
      </p>
    )
  } else {
    inputField = (
      <input
        type="date"
        className="rounded-2xl border border-primary/45 bg-white px-2 py-2 font-body text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )

    dataDisplay = (
      <>
        <Clock className="h-5 w-5 text-primary" />

        <span
          className={`font-body text-primary-font ${isEditField ? "hidden" : ""}`}
        >
          {dayjs(data).format("MMMM D, YYYY")}
        </span>
      </>
    )
  }

  return (
    <>
      {dataDisplay}

      {isEditField && inputField}

      {isEditField ? (
        <button
          onClick={async () => {
            await onUpdate(field, value)
            setIsEditField(false)
          }}
        >
          <Check className="h-5 w-5 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
        </button>
      ) : (
        <button
          onClick={() => {
            setValue(data)
            setIsEditField(true)
          }}
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <Edit3 className="h-4 w-4 mr-5 ml-1 text-primary cursor-pointer hover:text-primary/40 transition-all duration-300" />
          )}
        </button>
      )}
    </>
  )
}

export default EditableField
