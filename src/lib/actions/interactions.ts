"use server"

import { nanoid } from "nanoid"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db"
import { interactions, contacts } from "@/lib/db/schema"

export type Interaction = typeof interactions.$inferSelect

export async function getInteractions(contactId: string): Promise<Interaction[]> {
  const db = getDb()
  return db
    .select()
    .from(interactions)
    .where(eq(interactions.contactId, contactId))
    .orderBy(desc(interactions.date))
}

export async function getRecentInteractions(limit = 10): Promise<
  (Interaction & { contactName: string })[]
> {
  const db = getDb()
  const rows = await db
    .select({
      id: interactions.id,
      contactId: interactions.contactId,
      date: interactions.date,
      type: interactions.type,
      notes: interactions.notes,
      createdAt: interactions.createdAt,
      contactName: contacts.name,
    })
    .from(interactions)
    .innerJoin(contacts, eq(interactions.contactId, contacts.id))
    .orderBy(desc(interactions.date))
    .limit(limit)
  return rows
}

export async function addInteraction(formData: FormData): Promise<void> {
  const db = getDb()
  const contactId = formData.get("contactId") as string
  const date = formData.get("date") as string
  const type = formData.get("type") as string
  const notes = (formData.get("notes") as string) || null

  await db.insert(interactions).values({
    id: nanoid(),
    contactId,
    date,
    type,
    notes,
  })

  // Auto-update lastTalked on the contact
  const [contact] = await db
    .select({ lastTalked: contacts.lastTalked })
    .from(contacts)
    .where(eq(contacts.id, contactId))

  if (!contact?.lastTalked || date > contact.lastTalked) {
    await db
      .update(contacts)
      .set({ lastTalked: date, updatedAt: new Date() })
      .where(eq(contacts.id, contactId))
  }

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath("/")
}

export async function deleteInteraction(
  id: string,
  contactId: string
): Promise<void> {
  const db = getDb()
  await db.delete(interactions).where(eq(interactions.id, id))
  revalidatePath(`/contacts/${contactId}`)
  revalidatePath("/")
}
