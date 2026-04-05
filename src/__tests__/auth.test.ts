import { describe, it, expect } from "vitest"
import bcrypt from "bcryptjs"

describe("Authentication", () => {
  const correctPassword = "mySecurePassword123"
  const hash = bcrypt.hashSync(correctPassword, 10)

  it("Given the correct password, When comparing with bcrypt, Then it returns true", async () => {
    const result = await bcrypt.compare(correctPassword, hash)
    expect(result).toBe(true)
  })

  it("Given an incorrect password, When comparing with bcrypt, Then it returns false", async () => {
    const result = await bcrypt.compare("wrongPassword", hash)
    expect(result).toBe(false)
  })

  it("Given an empty password, When comparing with bcrypt, Then it returns false", async () => {
    const result = await bcrypt.compare("", hash)
    expect(result).toBe(false)
  })

  it("Given a password, When hashing it, Then the hash is not the same as the password", () => {
    const newHash = bcrypt.hashSync("testPassword", 10)
    expect(newHash).not.toBe("testPassword")
    expect(newHash.length).toBeGreaterThan(50)
  })
})
