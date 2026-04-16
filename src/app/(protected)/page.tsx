import Link from "next/link"
import { format } from "date-fns"
import { Cake, Clock, UserX, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  getTotalContacts,
  getUpcomingBirthdays,
  getStaleContacts,
  getRecentInteractions,
} from "@/lib/actions/dashboard"

export const dynamic = "force-dynamic"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function DashboardPage() {
  const [totalContacts, birthdays, staleContacts, recentInteractions] =
    await Promise.all([
      getTotalContacts(),
      getUpcomingBirthdays(30),
      getStaleContacts(30, 5),
      getRecentInteractions(5),
    ])

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-semibold anim-entry">Dashboard</h1>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="relative anim-entry anim-delay-1">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="editorial-label">
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-semibold">{totalContacts}</p>
          </CardContent>
          <span className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-terracotta" />
        </Card>
        <Card className="relative anim-entry anim-delay-2">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <Cake className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="editorial-label">
              Upcoming Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-semibold">{birthdays.length}</p>
          </CardContent>
          <span className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-sage" />
        </Card>
        <Card className="relative anim-entry anim-delay-3">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <UserX className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="editorial-label">
              Need to Reach Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading text-4xl font-semibold">{staleContacts.length}</p>
          </CardContent>
          <span className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-brown" />
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Birthdays */}
        <Card className="anim-entry anim-delay-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cake className="h-4 w-4 text-terracotta" />
              Upcoming Birthdays
            </CardTitle>
          </CardHeader>
          <CardContent>
            {birthdays.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No birthdays in the next 30 days.
              </p>
            ) : (
              <div className="space-y-3">
                {birthdays.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contacts/${c.id}`}
                    className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.photoUrl ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(c.birthday), "MMMM d")}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {c.daysUntil === 0
                        ? "Today!"
                        : c.daysUntil === 1
                          ? "Tomorrow"
                          : `${c.daysUntil}d`}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stale Contacts */}
        <Card className="anim-entry anim-delay-5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserX className="h-4 w-4 text-sage" />
              Need to Reach Out
            </CardTitle>
          </CardHeader>
          <CardContent>
            {staleContacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You&apos;re all caught up!
              </p>
            ) : (
              <div className="space-y-3">
                {staleContacts.map((c) => (
                  <Link
                    key={c.id}
                    href={`/contacts/${c.id}`}
                    className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent/50"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={c.photoUrl ?? undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(c.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.name}</p>
                      {c.company && (
                        <p className="text-xs text-muted-foreground">
                          {c.company}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {c.daysSince === null ? "Never" : `${c.daysSince}d ago`}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Interactions */}
        <Card className="md:col-span-2 anim-entry anim-delay-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-brown" />
              Recent Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentInteractions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No interactions yet. Start logging conversations!
              </p>
            ) : (
              <div className="space-y-3">
                {recentInteractions.map((i) => (
                  <Link
                    key={i.id}
                    href={`/contacts/${i.contactId}`}
                    className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">{i.contactName}</p>
                      {i.notes && (
                        <p className="truncate text-xs text-muted-foreground">
                          {i.notes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs capitalize">
                        {i.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(i.date), "MMM d")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
