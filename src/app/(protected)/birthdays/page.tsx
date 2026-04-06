import Link from "next/link"
import { format } from "date-fns"
import { Cake } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getUpcomingBirthdays } from "@/lib/actions/dashboard"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function BirthdaysPage() {
  const birthdays = await getUpcomingBirthdays(365)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Cake className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Birthdays</h1>
      </div>

      {birthdays.length === 0 ? (
        <p className="text-muted-foreground">
          No contacts with birthdays recorded. Add birthdays to your contacts to see them here.
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {birthdays.map((c) => (
            <Link key={c.id} href={`/contacts/${c.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={c.photoUrl ?? undefined} />
                    <AvatarFallback>{getInitials(c.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(c.birthday), "MMMM d")}
                    </p>
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
      )}
    </div>
  )
}
