function ProjectsSkeleton() {
  return (
    <section className="flex animate-pulse flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Page title */}
        <div className="mx-auto h-9 w-40 rounded-lg bg-primary/10 sm:mx-0" />

        {/* Create Project button */}
        <div className="h-11 w-36 rounded-2xl bg-primary/10" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
        {/* Filter Status */}
        <div className="h-11 w-32 rounded-2xl bg-primary/10" />

        {/* Sort */}
        <div className="h-11 w-36 rounded-2xl bg-primary/10" />
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-5">
              {/* Project name */}
              <div className="h-6 w-3/4 rounded-lg bg-primary/10" />

              {/* Status */}
              <div className="h-8 w-24 rounded-full bg-primary/10" />

              {/* Description */}
              <div className="flex flex-col gap-2">
                <div className="h-3 w-full rounded bg-primary/10" />
                <div className="h-3 w-5/6 rounded bg-primary/10" />
                <div className="h-3 w-2/3 rounded bg-primary/10" />
              </div>

              {/* Progress */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-16 rounded bg-primary/10" />
                  <div className="h-3 w-10 rounded bg-primary/10" />
                </div>

                <div className="h-3 w-full rounded-full bg-primary/10" />
              </div>

              {/* Due date */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 rounded bg-primary/10" />
                <div className="h-4 w-20 rounded bg-primary/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProjectsSkeleton
