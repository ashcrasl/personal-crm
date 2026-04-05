"use server"

import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { createSession, destroySession } from "@/lib/auth/session"

export async function login(
  _prevState: { error: string } | null,
  formData: FormData
): Promise<{ error: string }> {
  const password = formData.get("password") as string

  if (!password) {
    return { error: "Password is required" }
  }

  const hash = process.env.ADMIN_PASSWORD_HASH
  if (!hash) {
    return { error: "Server configuration error" }
  }

  const valid = await bcrypt.compare(password, hash)
  if (!valid) {
    return { error: "Invalid password" }
  }

  await createSession()
  redirect("/")
}

export async function logout(): Promise<void> {
  await destroySession()
  redirect("/login")
}
