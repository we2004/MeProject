function TaskDetailsSkeleton() {
  return (
    <section className="flex animate-pulse flex-col gap-8">
      {/* Task Information */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Task name + status */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-64 rounded-lg bg-primary/10" />
            <div className="h-8 w-24 rounded-full bg-primary/10" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-primary/10" />
            <div className="h-4 w-5/6 rounded bg-primary/10" />
            <div className="h-4 w-2/3 rounded bg-primary/10" />
          </div>

          {/* Project */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-primary/10" />
            <div className="h-4 w-40 rounded bg-primary/10" />
          </div>

          {/* Due date */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 rounded bg-primary/10" />
            <div className="h-4 w-36 rounded bg-primary/10" />
          </div>

          {/* Priority + Status */}
          <div className="flex flex-wrap gap-3">
            <div className="h-8 w-24 rounded-full bg-primary/10" />
            <div className="h-8 w-24 rounded-full bg-primary/10" />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Heading */}
          <div className="h-7 w-20 rounded-lg bg-primary/10" />

          {/* Add Note */}
          <div className="h-11 w-28 rounded-2xl bg-primary/10" />
        </div>

        {/* Note cards */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              {/* Note card */}
              <div className="min-h-24 flex-1 rounded-3xl border border-primary/10 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-full rounded bg-primary/10" />
                  <div className="h-4 w-5/6 rounded bg-primary/10" />
                  <div className="h-3 w-24 rounded bg-primary/10" />
                </div>
              </div>

              {/* Delete note */}
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Delete Task */}
      <div className="h-12 w-full rounded-[15px] bg-primary/10" />
    </section>
  )
}

export default TaskDetailsSkeleton
