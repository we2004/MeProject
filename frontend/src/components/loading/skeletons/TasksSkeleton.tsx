function TasksSkeleton() {
  return (
    <section className="flex animate-pulse flex-col gap-8">
      {/* Header */}
      <div className="flex gap-5 md:flex-row flex-col items-center justify-between">
        <div>
          {/* Page title */}
          <div className="mx-auto h-9 w-32 rounded-lg bg-primary/10 sm:mx-0" />

          {/* Project name */}
          <div className="mx-auto mt-4 h-4 w-28 rounded bg-primary/10 sm:mx-0" />
        </div>

        {/* Create Task */}
        <div className="h-11 w-32 rounded-2xl bg-primary/10" />
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        {/* Filter Status */}
        <div className="h-11 w-32 rounded-2xl bg-primary/10" />

        {/* Filter Priority */}
        <div className="h-11 w-36 rounded-2xl bg-primary/10" />

        {/* Sort */}
        <div className="h-11 w-36 rounded-2xl bg-primary/10" />
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((item) => (
          <div
            key={item}
            className="flex min-h-24 items-center gap-5 rounded-3xl border border-primary/10 bg-white px-5 py-4 shadow-sm"
          >
            {/* Task information */}
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              {/* Task name */}
              <div className="h-5 w-1/3 rounded-lg bg-primary/10" />

              {/* Project name */}
              <div className="h-3 w-1/4 rounded bg-primary/10" />
            </div>

            {/* Status */}
            <div className="hidden h-8 w-24 rounded-full bg-primary/10 sm:block" />

            {/* Priority */}
            <div className="hidden h-8 w-24 rounded-full bg-primary/10 md:block" />

            {/* Due date */}
            <div className="hidden h-4 w-24 rounded bg-primary/10 lg:block" />
          </div>
        ))}
      </div>
    </section>
  )
}

export default TasksSkeleton
