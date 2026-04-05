import { cookies } from "next/headers"
import { nanoid } from "nanoid"
import { eq, lt } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { sessions } from "@/lib/db/schema"

const SESSION_COOKIE = "session_id"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export async function createSession(): Promise<string> {
  const db = getDb()
  const id = nanoid(32)
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)

  await db.insert(sessions).values({ id, expiresAt })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return id
}

export async function validateSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionId) return false

  const db = getDb()
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId))

  if (!session || session.expiresAt < new Date()) {
    if (session) {
      await db.delete(sessions).where(eq(sessions.id, sessionId))
    }
    return false
  }

  return true
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value

  if (sessionId) {
    const db = getDb()
    await db.delete(sessions).where(eq(sessions.id, sessionId))
  }

  cookieStore.delete(SESSION_COOKIE)
}

export async function cleanExpiredSessions(): Promise<void> {
  const db = getDb()
  await db.delete(sessions).where(lt(sessions.expiresAt, new Date()))
}
