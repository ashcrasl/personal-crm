"use server"

import { nanoid } from "nanoid"
import { eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getDb } from "@/lib/db"
import { tags, contactTags } from "@/lib/db/schema"

export type Tag = typeof tags.$inferSelect

export async function getTags(): Promise<Tag[]> {
  const db = getDb()
  return db.select().from(tags).orderBy(tags.name)
}

export async function createTag(formData: FormData): Promise<void> {
  const db = getDb()
  const name = (formData.get("name") as string).trim()
  const color = (formData.get("color") as string) || "#6b7280"

  if (!name) return

  await db.insert(tags).values({ id: nanoid(), name, color })
  revalidatePath("/contacts")
}

export async function deleteTag(id: string): Promise<void> {
  const db = getDb()
  await db.delete(tags).where(eq(tags.id, id))
  revalidatePath("/contacts")
}

export async function getContactTags(contactId: string): Promise<Tag[]> {
  const db = getDb()
  const rows = await db
    .select({ tag: tags })
    .from(contactTags)
    .innerJoin(tags, eq(contactTags.tagId, tags.id))
    .where(eq(contactTags.contactId, contactId))

  return rows.map((r) => r.tag)
}

export async function setContactTags(
  contactId: string,
  tagIds: string[]
): Promise<void> {
  const db = getDb()

  // Remove existing tags
  await db.delete(contactTags).where(eq(contactTags.contactId, contactId))

  // Add new ones
  if (tagIds.length > 0) {
    await db.insert(contactTags).values(
      tagIds.map((tagId) => ({ contactId, tagId }))
    )
  }

  revalidatePath(`/contacts/${contactId}`)
  revalidatePath("/contacts")
}

export async function getContactsByTag(
  tagId: string
): Promise<string[]> {
  const db = getDb()
  const rows = await db
    .select({ contactId: contactTags.contactId })
    .from(contactTags)
    .where(eq(contactTags.tagId, tagId))

  return rows.map((r) => r.contactId)
}

/** Bulk fetch: returns a map of contactId -> Tag[] */
export async function getTagsForContacts(
  contactIds: string[]
): Promise<Map<string, Tag[]>> {
  if (contactIds.length === 0) return new Map()

  const db = getDb()
  const rows = await db
    .select({ contactId: contactTags.contactId, tag: tags })
    .from(contactTags)
    .innerJoin(tags, eq(contactTags.tagId, tags.id))
    .where(inArray(contactTags.contactId, contactIds))

  const map = new Map<string, Tag[]>()
  for (const row of rows) {
    const list = map.get(row.contactId) ?? []
    list.push(row.tag)
    map.set(row.contactId, list)
  }
  return map
}
