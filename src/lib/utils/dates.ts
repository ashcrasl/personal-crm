import { differenceInDays, setYear, getYear, addYears } from "date-fns"

export function daysUntilBirthday(
  birthdayStr: string,
  today: Date = new Date()
): number {
  const birthday = new Date(birthdayStr)
  let nextBirthday = setYear(birthday, getYear(today))

  // If birthday already passed this year, use next year
  if (nextBirthday < today) {
    nextBirthday = addYears(nextBirthday, 1)
  }

  return differenceInDays(nextBirthday, today)
}

export function daysSinceLastTalked(
  lastTalkedStr: string | null,
  today: Date = new Date()
): number | null {
  if (!lastTalkedStr) return null
  return differenceInDays(today, new Date(lastTalkedStr))
}
