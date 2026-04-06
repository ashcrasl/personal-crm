import { differenceInCalendarDays, startOfDay } from "date-fns"

/** Parse a date string like "1985-04-05" as a local date (not UTC) */
function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function daysUntilBirthday(
  birthdayStr: string,
  today: Date = new Date()
): number {
  const bday = parseLocalDate(birthdayStr)
  const todayStart = startOfDay(today)
  const thisYear = todayStart.getFullYear()

  let nextBirthday = new Date(thisYear, bday.getMonth(), bday.getDate())

  if (nextBirthday < todayStart) {
    nextBirthday = new Date(thisYear + 1, bday.getMonth(), bday.getDate())
  }

  return differenceInCalendarDays(nextBirthday, todayStart)
}

export function daysSinceLastTalked(
  lastTalkedStr: string | null,
  today: Date = new Date()
): number | null {
  if (!lastTalkedStr) return null
  return differenceInCalendarDays(startOfDay(today), parseLocalDate(lastTalkedStr))
}
