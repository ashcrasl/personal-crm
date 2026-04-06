import { describe, it, expect } from "vitest"

type BirthdayContact = { id: string; name: string; day: number }
type BirthdayByMonth = { month: number; contacts: BirthdayContact[] }

/** Replicates the grouping logic from getBirthdaysByMonth */
function groupByMonth(
  entries: { id: string; name: string; birthday: string }[]
): BirthdayByMonth[] {
  const months: BirthdayByMonth[] = Array.from({ length: 12 }, (_, i) => ({
    month: i,
    contacts: [],
  }))

  for (const c of entries) {
    const [, m, d] = c.birthday.split("-").map(Number)
    months[m - 1].contacts.push({ id: c.id, name: c.name, day: d })
  }

  for (const m of months) {
    m.contacts.sort((a, b) => a.day - b.day)
  }

  return months
}

describe("Birthday Calendar Grouping", () => {
  it("Given contacts with birthdays in January and March, When grouping, Then they appear in the correct months", () => {
    const entries = [
      { id: "1", name: "Alice", birthday: "1990-01-15" },
      { id: "2", name: "Bob", birthday: "1985-03-22" },
    ]
    const months = groupByMonth(entries)

    expect(months[0].contacts).toHaveLength(1)
    expect(months[0].contacts[0].name).toBe("Alice")
    expect(months[2].contacts).toHaveLength(1)
    expect(months[2].contacts[0].name).toBe("Bob")
  })

  it("Given two contacts in the same month, When grouping, Then they are sorted by day", () => {
    const entries = [
      { id: "1", name: "Charlie", birthday: "1992-06-25" },
      { id: "2", name: "Dana", birthday: "1988-06-10" },
    ]
    const months = groupByMonth(entries)

    expect(months[5].contacts).toHaveLength(2)
    expect(months[5].contacts[0].name).toBe("Dana") // 10th
    expect(months[5].contacts[1].name).toBe("Charlie") // 25th
  })

  it("Given no contacts with birthdays, When grouping, Then all months are empty", () => {
    const months = groupByMonth([])
    for (const m of months) {
      expect(m.contacts).toHaveLength(0)
    }
  })

  it("Given a contact born on December 31, When grouping, Then they appear in December (month index 11)", () => {
    const entries = [{ id: "1", name: "Eve", birthday: "1995-12-31" }]
    const months = groupByMonth(entries)

    expect(months[11].contacts).toHaveLength(1)
    expect(months[11].contacts[0].day).toBe(31)
  })

  it("Given the current month is April, When reordering months, Then April comes first", () => {
    const months = groupByMonth([])
    const currentMonth = 3 // April (0-indexed)
    const ordered = [...months.slice(currentMonth), ...months.slice(0, currentMonth)]

    expect(ordered[0].month).toBe(3) // April
    expect(ordered[11].month).toBe(2) // March (last)
  })
})
