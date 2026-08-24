function ProjectsDetailsSkeleton() {
  return (
    <section className="flex animate-pulse flex-col gap-15">
      {/* Project Info */}
      <div className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          {/* Project name + status */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-56 rounded-lg bg-primary/10" />
            <div className="h-8 w-24 rounded-full bg-primary/10" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="h-4 w-full rounded bg-primary/10" />
            <div className="h-4 w-5/6 rounded bg-primary/10" />
            <div className="h-4 w-2/3 rounded bg-primary/10" />
          </div>

          {/* Due date */}
          <div className="h-5 w-40 rounded bg-primary/10" />

          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 rounded bg-primary/10" />
              <div className="h-4 w-10 rounded bg-primary/10" />
            </div>

            <div className="h-3 w-full rounded-full bg-primary/10" />
          </div>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            <div className="h-8 w-20 rounded-full bg-primary/10" />
            <div className="h-8 w-24 rounded-full bg-primary/10" />
            <div className="h-8 w-16 rounded-full bg-primary/10" />
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Heading */}
          <div className="h-7 w-20 rounded-lg bg-primary/10" />

          {/* Add Task button */}
          <div className="h-11 w-32 rounded-2xl bg-primary/10" />
        </div>

        {/* Task cards */}
        <div className="flex flex-col items-center justify-center gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex w-full items-center gap-3"
            >
              {/* Task card */}
              <div className="flex min-h-24 flex-1 items-center gap-5 rounded-3xl border border-primary/10 bg-white px-5 py-4 shadow-sm">
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="h-5 w-1/3 rounded-lg bg-primary/10" />
                  <div className="h-3 w-1/4 rounded bg-primary/10" />
                </div>

                <div className="hidden h-8 w-20 rounded-full bg-primary/10 sm:block" />

                <div className="hidden h-8 w-20 rounded-full bg-primary/10 md:block" />

                <div className="hidden h-4 w-24 rounded bg-primary/10 lg:block" />
              </div>

              {/* Delete button */}
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Attachments */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Heading */}
          <div className="h-7 w-32 rounded-lg bg-primary/10" />

          {/* Add Attachment button */}
          <div className="h-11 w-40 rounded-2xl bg-primary/10" />
        </div>

        {/* Attachment cards */}
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              {/* Attachment card */}
              <div className="flex h-20 flex-1 items-center gap-4 rounded-3xl border border-primary/10 bg-white px-5 shadow-sm">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-primary/10" />

                <div className="flex flex-1 flex-col gap-2">
                  <div className="h-4 w-1/3 rounded bg-primary/10" />
                  <div className="h-3 w-1/5 rounded bg-primary/10" />
                </div>

                <div className="hidden h-9 w-20 rounded-xl bg-primary/10 sm:block" />
              </div>

              {/* Delete button */}
              <div className="h-12 w-12 shrink-0 rounded-2xl bg-primary/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Delete Project */}
      <div className="h-12 w-full rounded-[15px] bg-primary/10" />
    </section>
  )
}

export default ProjectsDetailsSkeleton
