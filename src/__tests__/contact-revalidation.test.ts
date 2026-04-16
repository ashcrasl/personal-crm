import { describe, it, expect, vi, beforeEach } from "vitest"

const revalidatePath = vi.fn()
const redirect = vi.fn((path: string) => {
  throw new Error(`REDIRECT:${path}`)
})

vi.mock("next/cache", () => ({ revalidatePath }))
vi.mock("next/navigation", () => ({ redirect }))
vi.mock("@vercel/blob", () => ({ put: vi.fn(), del: vi.fn() }))

const insertValues = vi.fn().mockResolvedValue(undefined)
const updateSet = vi
  .fn()
  .mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) })
const deleteWhere = vi.fn().mockResolvedValue(undefined)

vi.mock("@/lib/db", () => ({
  getDb: () => ({
    insert: () => ({ values: insertValues }),
    update: () => ({ set: updateSet }),
    delete: () => ({ where: () => deleteWhere() }),
    select: () => ({ from: () => ({ where: () => [] }) }),
  }),
}))

import {
  createContact,
  updateContact,
  deleteContact,
} from "@/lib/actions/contacts"

function buildForm(fields: Record<string, string> = {}): FormData {
  const fd = new FormData()
  fd.set("name", fields.name ?? "Test Person")
  for (const [k, v] of Object.entries(fields)) fd.set(k, v)
  return fd
}

describe("Dashboard revalidation on contact mutations", () => {
  beforeEach(() => {
    revalidatePath.mockClear()
    redirect.mockClear()
  })

  it("Given a new contact is created, When createContact runs, Then the dashboard is revalidated", async () => {
    await createContact(buildForm()).catch(() => {})
    expect(revalidatePath).toHaveBeenCalledWith("/")
    expect(revalidatePath).toHaveBeenCalledWith("/contacts")
    expect(revalidatePath).toHaveBeenCalledWith("/birthdays")
  })

  it("Given a contact is updated, When updateContact runs, Then the dashboard is revalidated", async () => {
    await updateContact("abc123", buildForm()).catch(() => {})
    expect(revalidatePath).toHaveBeenCalledWith("/")
    expect(revalidatePath).toHaveBeenCalledWith("/contacts/abc123")
    expect(revalidatePath).toHaveBeenCalledWith("/birthdays")
  })

  it("Given a contact is deleted, When deleteContact runs, Then the dashboard is revalidated", async () => {
    await deleteContact("abc123").catch(() => {})
    expect(revalidatePath).toHaveBeenCalledWith("/")
    expect(revalidatePath).toHaveBeenCalledWith("/contacts")
    expect(revalidatePath).toHaveBeenCalledWith("/birthdays")
  })
})
