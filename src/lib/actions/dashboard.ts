"use server"

import { sql, count, lte, isNotNull } from "drizzle-orm"
import { getDb } from "@/lib/db"
import { contacts } from "@/lib/db/schema"
import { getRecentInteractions } from "./interactions"
import { daysUntilBirthday } from "@/lib/utils/dates"

export type ContactWithBirthday = {
  id: string
  name: string
  photoUrl: string | null
  birthday: string
  daysUntil: number
}

export type StaleContact = {
  id: string
  name: string
  photoUrl: string | null
  company: string | null
  lastTalked: string | null
  daysSince: number | null
}

export async function getTotalContacts(): Promise<number> {
  const db = getDb()
  const [result] = await db.select({ value: count() }).from(contacts)
  return result.value
}

export async function getUpcomingBirthdays(
  withinDays = 30
): Promise<ContactWithBirthday[]> {
  const db = getDb()
  const allWithBirthdays = await db
    .select({
      id: contacts.id,
      name: contacts.name,
      photoUrl: contacts.photoUrl,
      birthday: contacts.birthday,
    })
    .from(contacts)
    .where(isNotNull(contacts.birthday))

  const today = new Date()
  return allWithBirthdays
    .map((c) => ({
      ...c,
      birthday: c.birthday!,
      daysUntil: daysUntilBirthday(c.birthday!, today),
    }))
    .filter((c) => c.daysUntil <= withinDays)
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

export async function getStaleContacts(
  staleDays = 30,
  limit = 10
): Promise<StaleContact[]> {
  const db = getDb()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - staleDays)
  const cutoffStr = cutoff.toISOString().split("T")[0]

  // Contacts with lastTalked older than cutoff, or no lastTalked at all
  const stale = await db
    .select({
      id: contacts.id,
      name: contacts.name,
      photoUrl: contacts.photoUrl,
      company: contacts.company,
      lastTalked: contacts.lastTalked,
    })
    .from(contacts)
    .where(
      sql`${contacts.lastTalked} IS NULL OR ${contacts.lastTalked} <= ${cutoffStr}`
    )
    .limit(limit)

  const today = new Date()
  return stale
    .map((c) => ({
      ...c,
      daysSince: c.lastTalked
        ? Math.floor(
            (today.getTime() - new Date(c.lastTalked).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        : null,
    }))
    .sort((a, b) => {
      if (a.daysSince === null) return -1
      if (b.daysSince === null) return 1
      return b.daysSince - a.daysSince
    })
}

export { getRecentInteractions }
