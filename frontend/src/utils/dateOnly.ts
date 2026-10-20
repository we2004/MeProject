import dayjs from "dayjs"

export function isDateAfter(date: string, boundary: string): boolean {
  return Boolean(date && boundary && date > boundary)
}

export function formatDateOnly(date: string): string {
  return dayjs(date).format("MMMM D, YYYY")
}