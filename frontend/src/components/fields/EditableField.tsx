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
  ) => Promise<boolean | undefined>
  loading?: boolean
  maxDate?: string
  dateError?: string
}

function EditableField({
  data,
  field,
  onUpdate,
  loading,
  maxDate,
  dateError
}: EditableFieldProps) {
  const [isEditField, setIsEditField] = useState(false)
  const [value, setValue] = useState("")
  const [validationError, setValidationError] = useState("")

  let inputField: React.JSX.Element
  let dataDisplay: React.JSX.Element

  if (field === "name") {
    inputField = (
      <input
        type="text"
        className="rounded-2xl border border-primary/45 bg-white px-2 py-3 font-heading md:text-2xl font-bold text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )

    dataDisplay = (
      <h1
        className={`font-heading md:text-3xl text-xl font-bold text-primary-font ${isEditField ? "hidden" : ""}`}
      >
        {data}
      </h1>
    )
  } else if (field === "description") {
    inputField = (
      <textarea
        rows={5}
        className=" h-30 flex-1 rounded-2xl border border-primary/45 bg-white px-2 py-3 font-body text-primary-font/70 outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    )

    dataDisplay = (
      <p
        className={`flex-1  leading-7 md:text-base text-sm text-primary-font/70 ${isEditField ? "hidden" : ""}`}
      >
        {data}
      </p>
    )
  } else {
    inputField = (
      <input
        type="date"
        max={field === "dueDate" ? maxDate : undefined}
        className="rounded-2xl border border-primary/45 bg-white px-2 py-2 font-body text-primary-font outline-none transition-all duration-300 placeholder:text-primary-font/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setValidationError("")
        }}
      />
    )

    dataDisplay = (
      <>
        <Clock className="h-5 w-5 text-primary" />

        <span
          className={`font-body text-primary-font  md:text-base text-sm ${isEditField ? "hidden" : ""}`}
        >
          {dayjs(data).format("MMMM D, YYYY")}
        </span>
      </>
    )
  }

  return (
    <div className={field === "description" || field === "dueDate" ? "w-full" : "w-fit"}>
      <div className="flex items-center gap-2">
        {dataDisplay}

        {isEditField && inputField}

        {isEditField ? (
          <button
            disabled={loading}
            onClick={async () => {
              if (
                field === "dueDate" &&
                maxDate &&
                value > maxDate
              ) {
                setValidationError(
                  `Task due date must be on or before the project due date (${dayjs(maxDate).format("MMMM D, YYYY")}).`
                )
                return
              }
              const success = await onUpdate(field, value)
              if (success) setIsEditField(false)
            }}
          >
            {loading ? (
              <Spinner size="sm" />
            ) : (
              <Check className="me-5 ms-1 h-5 w-5 cursor-pointer text-primary transition-all duration-300 hover:text-primary/40" />
            )}
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={() => {
              setValue(data)
              setValidationError("")
              setIsEditField(true)
            }}
          >
            <Edit3 className="me-5 ms-1 h-4 w-4 cursor-pointer text-primary transition-all duration-300 hover:text-primary/40" />
          </button>
        )}
      </div>
      {(validationError || dateError) && field === "dueDate" && (
        <p className="mt-2 font-body text-sm text-redT" role="alert">
          {validationError || dateError}
        </p>
      )}
    </div>
  )
}

export default EditableField
