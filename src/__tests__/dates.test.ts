import { describe, it, expect } from "vitest"
import { daysUntilBirthday, daysSinceLastTalked } from "@/lib/utils/dates"

/** Create a local-timezone date (not UTC) for consistent test results */
function localDate(y: number, m: number, d: number): Date {
  return new Date(y, m - 1, d)
}

describe("Birthday Calculations", () => {
  it("Given a contact born April 10, When today is April 5, Then daysUntilBirthday returns 5", () => {
    const today = localDate(2026, 4, 5)
    const result = daysUntilBirthday("1985-04-10", today)
    expect(result).toBe(5)
  })

  it("Given a contact born January 1, When today is December 30, Then daysUntilBirthday returns 2", () => {
    const today = localDate(2026, 12, 30)
    const result = daysUntilBirthday("1990-01-01", today)
    expect(result).toBe(2)
  })

  it("Given a contact born today, When checking, Then daysUntilBirthday returns 0", () => {
    const today = localDate(2026, 6, 15)
    const result = daysUntilBirthday("1988-06-15", today)
    expect(result).toBe(0)
  })

  it("Given a contact born yesterday, When checking, Then daysUntilBirthday returns 364 or 365", () => {
    const today = localDate(2026, 6, 16)
    const result = daysUntilBirthday("1988-06-15", today)
    expect(result).toBeGreaterThanOrEqual(364)
    expect(result).toBeLessThanOrEqual(365)
  })
})

describe("Last Talked Calculations", () => {
  it("Given a contact last talked to on April 1, When today is April 5, Then daysSinceLastTalked returns 4", () => {
    const today = localDate(2026, 4, 5)
    const result = daysSinceLastTalked("2026-04-01", today)
    expect(result).toBe(4)
  })

  it("Given no last talked date, When checking, Then daysSinceLastTalked returns null", () => {
    const result = daysSinceLastTalked(null)
    expect(result).toBeNull()
  })

  it("Given a contact talked to today, When checking, Then daysSinceLastTalked returns 0", () => {
    const today = localDate(2026, 4, 5)
    const result = daysSinceLastTalked("2026-04-05", today)
    expect(result).toBe(0)
  })
})
