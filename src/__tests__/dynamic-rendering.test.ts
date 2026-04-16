import { describe, it, expect, vi } from "vitest"

vi.mock("@/lib/actions/dashboard", () => ({
  getTotalContacts: vi.fn(),
  getUpcomingBirthdays: vi.fn(),
  getStaleContacts: vi.fn(),
  getRecentInteractions: vi.fn(),
  getBirthdaysByMonth: vi.fn(),
}))
vi.mock("@/lib/actions/contacts", () => ({ getContacts: vi.fn() }))
vi.mock("@/lib/actions/tags", () => ({
  getTags: vi.fn(),
  getTagsForContacts: vi.fn(),
  getContactsByTag: vi.fn(),
}))
vi.mock("@/lib/db", () => ({ getDb: vi.fn() }))

describe("Data pages force dynamic rendering", () => {
  it("Given the dashboard page, When inspecting its route config, Then dynamic is force-dynamic", async () => {
    const mod = await import("@/app/(protected)/page")
    expect(mod.dynamic).toBe("force-dynamic")
  })

  it("Given the birthdays page, When inspecting its route config, Then dynamic is force-dynamic", async () => {
    const mod = await import("@/app/(protected)/birthdays/page")
    expect(mod.dynamic).toBe("force-dynamic")
  })

  it("Given the contacts list page, When inspecting its route config, Then dynamic is force-dynamic", async () => {
    const mod = await import("@/app/(protected)/contacts/page")
    expect(mod.dynamic).toBe("force-dynamic")
  })
})
