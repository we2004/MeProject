function HomeSkeleton() {
  return (
    <section className="flex flex-col gap-10 animate-pulse">
      {/* Overview */}
      <div className="grid gap-5 md:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4">
              {/* Number */}
              <div className="h-10 w-20 rounded-xl bg-primary/10" />

              {/* Title */}
              <div className="h-4 w-28 rounded-lg bg-primary/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Projects */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          {/* Section title */}
          <div className="h-7 w-48 rounded-lg bg-primary/10" />

          {/* See All Projects */}
          <div className="h-5 w-32 rounded-lg bg-primary/10" />
        </div>

        {/* Project cards */}
        <div className="grid gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="rounded-3xl border border-primary/10 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5">
                {/* Project name */}
                <div className="h-6 w-3/4 rounded-lg bg-primary/10" />

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-full rounded bg-primary/10" />
                  <div className="h-3 w-5/6 rounded bg-primary/10" />
                </div>

                {/* Progress */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 rounded bg-primary/10" />
                    <div className="h-3 w-10 rounded bg-primary/10" />
                  </div>

                  <div className="h-2 w-full rounded-full bg-primary/10" />
                </div>

                {/* Bottom metadata */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 rounded bg-primary/10" />
                  <div className="h-4 w-16 rounded bg-primary/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Tasks */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          {/* Section title */}
          <div className="h-7 w-40 rounded-lg bg-primary/10" />

          {/* See All Tasks */}
          <div className="h-5 w-28 rounded-lg bg-primary/10" />
        </div>

        {/* Task cards */}
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="flex min-h-24 items-center gap-5 rounded-3xl border border-primary/10 bg-white px-5 py-4 shadow-sm"
            >
              {/* Task name */}
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="h-5 w-1/3 rounded-lg bg-primary/10" />
                <div className="h-3 w-1/4 rounded bg-primary/10" />
              </div>

              {/* Project */}
              <div className="hidden h-4 w-28 rounded bg-primary/10 md:block" />

              {/* Status */}
              <div className="h-8 w-20 rounded-full bg-primary/10" />

              {/* Priority */}
              <div className="h-8 w-20 rounded-full bg-primary/10" />

              {/* Due date */}
              <div className="hidden h-4 w-24 rounded bg-primary/10 sm:block" />
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default HomeSkeleton
