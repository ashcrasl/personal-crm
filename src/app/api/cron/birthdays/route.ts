import { NextResponse } from "next/server"
import { Resend } from "resend"
import { getUpcomingBirthdays } from "@/lib/actions/dashboard"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const recipientEmail = process.env.REMINDER_EMAIL
  if (!recipientEmail) {
    return NextResponse.json({ error: "No REMINDER_EMAIL configured" }, { status: 500 })
  }

  // Get birthdays in the next 7 days
  const upcoming = await getUpcomingBirthdays(7)

  if (upcoming.length === 0) {
    return NextResponse.json({ message: "No upcoming birthdays", sent: false })
  }

  const lines = upcoming.map((c) => {
    if (c.daysUntil === 0) return `🎂 ${c.name} — TODAY!`
    if (c.daysUntil === 1) return `🎂 ${c.name} — Tomorrow`
    return `🎂 ${c.name} — in ${c.daysUntil} days`
  })

  const { error } = await resend.emails.send({
    from: process.env.REMINDER_FROM_EMAIL ?? "CRM <onboarding@resend.dev>",
    to: recipientEmail,
    subject: `🎂 ${upcoming.length} upcoming birthday${upcoming.length > 1 ? "s" : ""} this week`,
    text: `Upcoming birthdays:\n\n${lines.join("\n")}\n\nView all: ${process.env.NEXT_PUBLIC_APP_URL ?? "https://personal-crm-iota-nine.vercel.app"}/birthdays`,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: `Sent reminder for ${upcoming.length} birthday(s)`,
    sent: true,
  })
}
