export function isDateOnly(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12) return false;

  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ][month - 1];

  return day >= 1 && day <= daysInMonth;
}

export function isDateOnOrBefore(date: unknown, boundary: unknown): boolean {
  return isDateOnly(date) && isDateOnly(boundary) && date <= boundary;
}

export function shouldValidateTaskProjectDeadline(
  dueDate: unknown,
  projectId: unknown
): boolean {
  return (
    (dueDate !== undefined && dueDate !== null) ||
    (projectId !== undefined && projectId !== null)
  );
}

export function getLocalDateOnly(date = new Date()): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
