import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getContacts } from "@/lib/actions/contacts"
import { ContactSearch } from "./contact-search"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function daysSince(dateStr: string | null): string | null {
  if (!dateStr) return null
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  )
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const allContacts = await getContacts(q)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <Button render={<Link href="/contacts/new" />}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <ContactSearch defaultValue={q} />

      {allContacts.length === 0 ? (
        <p className="text-muted-foreground">
          {q ? "No contacts match your search." : "No contacts yet. Add your first one!"}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {allContacts.map((contact) => (
            <Link key={contact.id} href={`/contacts/${contact.id}`}>
              <Card className="transition-colors hover:bg-accent/50">
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.photoUrl ?? undefined} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{contact.name}</p>
                    {contact.company && (
                      <p className="truncate text-sm text-muted-foreground">
                        {contact.role ? `${contact.role} at ` : ""}
                        {contact.company}
                      </p>
                    )}
                    {contact.lastTalked && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {daysSince(contact.lastTalked)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
