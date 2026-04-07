import { describe, it, expect } from "vitest"
import { daysUntilBirthday } from "@/lib/utils/dates"

/** Create a local-timezone date */
function localDate(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d)
}

type UpcomingContact = { name: string; daysUntil: number }

/** Replicates the email formatting logic from the cron route */
function formatReminderLine(c: UpcomingContact): string {
  if (c.daysUntil === 0) return `${c.name} — TODAY!`
  if (c.daysUntil === 1) return `${c.name} — Tomorrow`
  return `${c.name} — in ${c.daysUntil} days`
}

function shouldSendReminder(upcoming: UpcomingContact[]): boolean {
  return upcoming.length > 0
}

describe("Birthday Reminders", () => {
  describe("Reminder Selection (7-day window)", () => {
    it("Given a birthday in 3 days, When checking 7-day window, Then it is included", () => {
      const today = localDate(2026, 4, 6)
      const days = daysUntilBirthday("1990-04-09", today)
      expect(days).toBeLessThanOrEqual(7)
    })

    it("Given a birthday in 10 days, When checking 7-day window, Then it is excluded", () => {
      const today = localDate(2026, 4, 6)
      const days = daysUntilBirthday("1990-04-16", today)
      expect(days).toBeGreaterThan(7)
    })

    it("Given no upcoming birthdays, When checking, Then no reminder is sent", () => {
      expect(shouldSendReminder([])).toBe(false)
    })

    it("Given 2 upcoming birthdays, When checking, Then a reminder is sent", () => {
      const upcoming = [
        { name: "Alice", daysUntil: 2 },
        { name: "Bob", daysUntil: 5 },
      ]
      expect(shouldSendReminder(upcoming)).toBe(true)
    })
  })

  describe("Reminder Formatting", () => {
    it("Given a birthday today, When formatting, Then it says TODAY!", () => {
      expect(formatReminderLine({ name: "Alice", daysUntil: 0 })).toBe(
        "Alice — TODAY!"
      )
    })

    it("Given a birthday tomorrow, When formatting, Then it says Tomorrow", () => {
      expect(formatReminderLine({ name: "Bob", daysUntil: 1 })).toBe(
        "Bob — Tomorrow"
      )
    })

    it("Given a birthday in 5 days, When formatting, Then it says in 5 days", () => {
      expect(formatReminderLine({ name: "Charlie", daysUntil: 5 })).toBe(
        "Charlie — in 5 days"
      )
    })
  })
})
