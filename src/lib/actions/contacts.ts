"use server"

import { nanoid } from "nanoid"
import { eq, ilike, or, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { put, del } from "@vercel/blob"
import { getDb } from "@/lib/db"
import { contacts } from "@/lib/db/schema"

export type Contact = typeof contacts.$inferSelect
export type ContactInsert = typeof contacts.$inferInsert

export async function getContacts(search?: string): Promise<Contact[]> {
  const db = getDb()

  if (search) {
    return db
      .select()
      .from(contacts)
      .where(
        or(
          ilike(contacts.name, `%${search}%`),
          ilike(contacts.company, `%${search}%`),
          ilike(contacts.role, `%${search}%`)
        )
      )
      .orderBy(desc(contacts.updatedAt))
  }

  return db.select().from(contacts).orderBy(desc(contacts.updatedAt))
}

export async function getContact(id: string): Promise<Contact | undefined> {
  const db = getDb()
  const [contact] = await db
    .select()
    .from(contacts)
    .where(eq(contacts.id, id))
  return contact
}

async function uploadPhoto(file: File): Promise<string> {
  const blob = await put(`contacts/${nanoid()}-${file.name}`, file, {
    access: "public",
    contentType: file.type,
  })
  return blob.url
}

async function deletePhoto(url: string): Promise<void> {
  try {
    await del(url)
  } catch {
    // Best-effort cleanup — don't block the operation
  }
}

export async function createContact(formData: FormData): Promise<void> {
  const db = getDb()
  const id = nanoid()

  let photoUrl: string | null = null
  const photoFile = formData.get("photo") as File | null
  if (photoFile && photoFile.size > 0) {
    photoUrl = await uploadPhoto(photoFile)
  }

  await db.insert(contacts).values({
    id,
    name: formData.get("name") as string,
    company: (formData.get("company") as string) || null,
    role: (formData.get("role") as string) || null,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    linkedinUrl: (formData.get("linkedinUrl") as string) || null,
    photoUrl,
    howWeMet: (formData.get("howWeMet") as string) || null,
    introducedBy: (formData.get("introducedBy") as string) || null,
    birthday: (formData.get("birthday") as string) || null,
    personalNotes: (formData.get("personalNotes") as string) || null,
  })

  revalidatePath("/contacts")
  redirect(`/contacts/${id}`)
}

export async function updateContact(
  id: string,
  formData: FormData
): Promise<void> {
  const db = getDb()

  let photoUrl: string | null | undefined = undefined
  const photoFile = formData.get("photo") as File | null
  const removePhoto = formData.get("removePhoto") === "true"

  if (removePhoto) {
    const existing = await getContact(id)
    if (existing?.photoUrl) await deletePhoto(existing.photoUrl)
    photoUrl = null
  } else if (photoFile && photoFile.size > 0) {
    const existing = await getContact(id)
    if (existing?.photoUrl) await deletePhoto(existing.photoUrl)
    photoUrl = await uploadPhoto(photoFile)
  }

  await db
    .update(contacts)
    .set({
      name: formData.get("name") as string,
      company: (formData.get("company") as string) || null,
      role: (formData.get("role") as string) || null,
      email: (formData.get("email") as string) || null,
      phone: (formData.get("phone") as string) || null,
      linkedinUrl: (formData.get("linkedinUrl") as string) || null,
      ...(photoUrl !== undefined ? { photoUrl } : {}),
      howWeMet: (formData.get("howWeMet") as string) || null,
      introducedBy: (formData.get("introducedBy") as string) || null,
      birthday: (formData.get("birthday") as string) || null,
      personalNotes: (formData.get("personalNotes") as string) || null,
      updatedAt: new Date(),
    })
    .where(eq(contacts.id, id))

  revalidatePath(`/contacts/${id}`)
  revalidatePath("/contacts")
  redirect(`/contacts/${id}`)
}

export async function deleteContact(id: string): Promise<void> {
  const db = getDb()
  await db.delete(contacts).where(eq(contacts.id, id))
  revalidatePath("/contacts")
  redirect("/contacts")
}
