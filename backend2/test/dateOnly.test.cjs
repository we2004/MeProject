const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const {
  getLocalDateOnly,
  isDateOnly,
  isDateOnOrBefore,
  shouldValidateTaskProjectDeadline
} = require("../src/utils/dateOnly")

test("accepts valid date-only values and rejects missing or invalid dates", () => {
  assert.equal(isDateOnly("2024-02-29"), true)
  assert.equal(isDateOnly("2023-02-29"), false)
  assert.equal(isDateOnly("2026-10-24T00:00:00.000Z"), false)
  assert.equal(isDateOnly(""), false)
  assert.equal(isDateOnly(undefined), false)
  assert.equal(isDateOnly(null), false)
})

test("allows dates before or equal to the project deadline and rejects later dates", () => {
  assert.equal(isDateOnOrBefore("2026-10-23", "2026-10-24"), true)
  assert.equal(isDateOnOrBefore("2026-10-24", "2026-10-24"), true)
  assert.equal(isDateOnOrBefore("2026-10-25", "2026-10-24"), false)
  assert.equal(isDateOnOrBefore("", "2026-10-24"), false)
  assert.equal(isDateOnOrBefore("2026-10-24", undefined), false)
})

test("task creation, due-date edits, and project reassignment share the deadline rule", () => {
  const deadline = "2026-10-24"
  const requests = [
    { operation: "create", dueDate: "2026-10-23", allowed: true },
    { operation: "create", dueDate: "2026-10-24", allowed: true },
    { operation: "edit", dueDate: "2026-10-25", allowed: false },
    { operation: "reassign", dueDate: "2026-10-25", allowed: false }
  ]

  for (const request of requests) {
    assert.equal(
      isDateOnOrBefore(request.dueDate, deadline),
      request.allowed,
      request.operation
    )
  }
})

test("a shortened project deadline conflicts with any later task date", () => {
  assert.equal(isDateOnOrBefore("2026-10-24", "2026-10-25"), true)
  assert.equal(isDateOnOrBefore("2026-10-26", "2026-10-25"), false)
})

test("date-only comparisons do not depend on the process timezone", () => {
  const originalTimezone = process.env.TZ
  try {
    for (const timezone of [
      "UTC",
      "Pacific/Kiritimati",
      "America/Los_Angeles",
      "Asia/Kathmandu"
    ]) {
      process.env.TZ = timezone
      assert.equal(isDateOnOrBefore("2026-10-24", "2026-10-24"), true)
      assert.equal(isDateOnOrBefore("2026-10-25", "2026-10-24"), false)
      assert.equal(getLocalDateOnly(new Date(2026, 9, 24)), "2026-10-24")
    }
  } finally {
    if (originalTimezone === undefined) {
      delete process.env.TZ
    } else {
      process.env.TZ = originalTimezone
    }
  }
})

test("deadline checks are skipped for unrelated updates but required for date or project changes", () => {
  assert.equal(shouldValidateTaskProjectDeadline(undefined, undefined), false)
  assert.equal(shouldValidateTaskProjectDeadline("2026-10-24", undefined), true)
  assert.equal(shouldValidateTaskProjectDeadline(undefined, 2), true)
  assert.equal(shouldValidateTaskProjectDeadline(null, null), false)
})

test("mutation routes keep server-side reads, date conflicts, and row locks", () => {
  const taskRoutes = readFileSync(
    path.join(__dirname, "../src/routes/tasks.ts"),
    "utf8"
  )
  const projectRoutes = readFileSync(
    path.join(__dirname, "../src/routes/projects.ts"),
    "utf8"
  )

  assert.match(
    taskRoutes,
    /FROM projects WHERE id = \$1 AND userId = \$2 FOR UPDATE/
  )
  assert.match(taskRoutes, /ORDER BY id FOR UPDATE/)
  assert.match(projectRoutes, /FROM projects WHERE id = \$1 AND userId = \$2 FOR UPDATE/)
  assert.match(projectRoutes, /dueDate > \$3::date/)
  assert.equal((taskRoutes.match(/TO_CHAR\(dueDate, 'YYYY-MM-DD'\)/g) || []).length >= 4, true)
  assert.equal((projectRoutes.match(/TO_CHAR\(p\.dueDate, 'YYYY-MM-DD'\)/g) || []).length, 2)
})
