import { describe, it, expect } from "vitest"

/** Test spouse name field extraction from form data */
describe("Spouse Name Field", () => {
  function extractSpouseName(formData: Map<string, string>): string | null {
    return (formData.get("spouseName") as string) || null
  }

  it("Given form data with a spouse name, When extracting, Then the name is returned", () => {
    const form = new Map([["spouseName", "Sarah"]])
    expect(extractSpouseName(form)).toBe("Sarah")
  })

  it("Given form data with an empty spouse name, When extracting, Then null is returned", () => {
    const form = new Map([["spouseName", ""]])
    expect(extractSpouseName(form)).toBeNull()
  })

  it("Given form data without a spouse name field, When extracting, Then null is returned", () => {
    const form = new Map<string, string>()
    expect(extractSpouseName(form)).toBeNull()
  })
})
