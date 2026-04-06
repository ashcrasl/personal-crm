import { describe, it, expect } from "vitest"
import { daysUntilBirthday, daysSinceLastTalked } from "@/lib/utils/dates"

/** Create a local-timezone date (not UTC) for consistent test results */
function localDate(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d)
}

describe("Interaction Logic", () => {
  describe("Stale Contact Detection", () => {
    it("Given a contact last talked to 45 days ago, When checking staleness at 30 days, Then they are stale", () => {
      const today = localDate(2026, 4, 5)
      const lastTalked = "2026-02-19" // 45 days ago
      const days = daysSinceLastTalked(lastTalked, today)
      expect(days).toBe(45)
      expect(days! > 30).toBe(true)
    })

    it("Given a contact last talked to 10 days ago, When checking staleness at 30 days, Then they are not stale", () => {
      const today = localDate(2026, 4, 5)
      const lastTalked = "2026-03-26" // 10 days ago
      const days = daysSinceLastTalked(lastTalked, today)
      expect(days).toBe(10)
      expect(days! > 30).toBe(false)
    })

    it("Given a contact with no lastTalked, When checking staleness, Then they should be flagged", () => {
      const days = daysSinceLastTalked(null)
      expect(days).toBeNull()
    })
  })

  describe("Birthday Proximity for Dashboard", () => {
    it("Given a birthday in 5 days, When filtering for 30-day window, Then it is included", () => {
      const today = localDate(2026, 4, 5)
      const days = daysUntilBirthday("1990-04-10", today)
      expect(days).toBeLessThanOrEqual(30)
    })

    it("Given a birthday in 60 days, When filtering for 30-day window, Then it is excluded", () => {
      const today = localDate(2026, 4, 5)
      const days = daysUntilBirthday("1990-06-04", today)
      expect(days).toBeGreaterThan(30)
    })

    it("Given a birthday today, When checking, Then daysUntil is 0", () => {
      const today = localDate(2026, 4, 5)
      const days = daysUntilBirthday("1985-04-05", today)
      expect(days).toBe(0)
    })

    it("Given multiple birthdays, When sorting by daysUntil, Then closest birthday comes first", () => {
      const today = localDate(2026, 4, 5)
      const birthdayA = daysUntilBirthday("1990-04-10", today)
      const birthdayB = daysUntilBirthday("1990-04-20", today)
      const birthdayC = daysUntilBirthday("1990-04-07", today)
      const sorted = [birthdayA, birthdayB, birthdayC].sort((a, b) => a - b)
      expect(sorted[0]).toBe(birthdayC)
      expect(sorted[1]).toBe(birthdayA)
      expect(sorted[2]).toBe(birthdayB)
    })
  })
})
