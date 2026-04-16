import { pgTable, text, date, timestamp, primaryKey } from "drizzle-orm/pg-core"

export const contacts = pgTable("contacts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  role: text("role"),
  email: text("email"),
  phone: text("phone"),
  linkedinUrl: text("linkedin_url"),
  photoUrl: text("photo_url"),
  spouseName: text("spouse_name"),
  howWeMet: text("how_we_met"),
  introducedBy: text("introduced_by"),
  birthday: date("birthday"),
  personalNotes: text("personal_notes"),
  lastTalked: date("last_talked"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const interactions = pgTable("interactions", {
  id: text("id").primaryKey(),
  contactId: text("contact_id")
    .references(() => contacts.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  type: text("type").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const tags = pgTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  color: text("color").notNull().default("#6b7280"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const contactTags = pgTable(
  "contact_tags",
  {
    contactId: text("contact_id")
      .references(() => contacts.id, { onDelete: "cascade" })
      .notNull(),
    tagId: text("tag_id")
      .references(() => tags.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.contactId, t.tagId] })]
)

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})
