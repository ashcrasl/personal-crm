import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { contacts } from "@/lib/db/schema"
import { count } from "drizzle-orm"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const db = getDb()
    const [result] = await db.select({ value: count() }).from(contacts)
    const dbHost =
      process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1] ?? "unknown"
    return NextResponse.json({
      ok: true,
      contactCount: result.value,
      dbHost,
      now: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
