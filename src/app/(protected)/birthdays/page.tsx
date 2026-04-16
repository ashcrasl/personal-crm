import Link from "next/link"
import { Cake } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getBirthdaysByMonth, getUpcomingBirthdays } from "@/lib/actions/dashboard"

export const dynamic = "force-dynamic"

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function BirthdaysPage() {
  const [months, upcoming] = await Promise.all([
    getBirthdaysByMonth(),
    getUpcomingBirthdays(30),
  ])

  const currentMonth = new Date().getMonth()

  // Reorder months starting from current month
  const orderedMonths = [
    ...months.slice(currentMonth),
    ...months.slice(0, currentMonth),
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Cake className="h-6 w-6" />
        <h1 className="font-heading text-2xl font-semibold">Birthdays</h1>
      </div>

      {/* Upcoming (next 30 days) */}
      {upcoming.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading text-lg font-semibold">Coming Up</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((c) => (
              <Link key={c.id} href={`/contacts/${c.id}`}>
                <Card className="transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(92,74,58,0.08)]">
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={c.photoUrl ?? undefined} />
                      <AvatarFallback className="text-sm">{getInitials(c.name)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-sm">{c.name}</p>
                    </div>
                    <Badge
                      variant={c.daysUntil <= 7 ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {c.daysUntil === 0
                        ? "Today!"
                        : c.daysUntil === 1
                          ? "Tomorrow"
                          : `${c.daysUntil}d`}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Month-by-month calendar */}
      <div className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Full Year</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orderedMonths.map((m) => {
            const isCurrentMonth = m.month === currentMonth
            return (
              <Card
                key={m.month}
                className={isCurrentMonth ? "border border-terracotta" : ""}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-sm">
                    {MONTH_NAMES[m.month]}
                    {m.contacts.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {m.contacts.length}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {m.contacts.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No birthdays</p>
                  ) : (
                    <div className="space-y-2">
                      {m.contacts.map((c) => (
                        <Link
                          key={c.id}
                          href={`/contacts/${c.id}`}
                          className="flex items-center gap-2 rounded-md p-1 text-sm transition-colors hover:bg-accent/50"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={c.photoUrl ?? undefined} />
                            <AvatarFallback className="text-[10px]">
                              {getInitials(c.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{c.name}</span>
                          <span className="ml-auto text-xs text-muted-foreground">
                            {c.day}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
