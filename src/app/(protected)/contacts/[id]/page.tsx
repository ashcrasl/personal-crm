import { notFound } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2, ExternalLink, Mail, Phone, Cake, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { getContact, deleteContact } from "@/lib/actions/contacts"
import { format } from "date-fns"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await getContact(id)

  if (!contact) notFound()

  const deleteWithId = deleteContact.bind(null, id)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={contact.photoUrl ?? undefined} />
            <AvatarFallback className="text-lg">
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{contact.name}</h1>
            {contact.company && (
              <p className="text-muted-foreground">
                {contact.role ? `${contact.role} at ` : ""}
                {contact.company}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" render={<Link href={`/contacts/${id}/edit`} />}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <form action={deleteWithId}>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contact Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {contact.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${contact.email}`} className="hover:underline">
                  {contact.email}
                </a>
              </div>
            )}
            {contact.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${contact.phone}`} className="hover:underline">
                  {contact.phone}
                </a>
              </div>
            )}
            {contact.linkedinUrl && (
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {contact.birthday && (
              <div className="flex items-center gap-2 text-sm">
                <Cake className="h-4 w-4 text-muted-foreground" />
                {format(new Date(contact.birthday), "MMMM d, yyyy")}
              </div>
            )}
            {contact.lastTalked && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Last talked: {format(new Date(contact.lastTalked), "MMMM d, yyyy")}
              </div>
            )}
            {!contact.email &&
              !contact.phone &&
              !contact.linkedinUrl &&
              !contact.birthday && (
                <p className="text-sm text-muted-foreground">
                  No contact info yet.
                </p>
              )}
          </CardContent>
        </Card>

        {/* How We Met */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              How We Met
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {contact.howWeMet || "Not recorded yet."}
            </p>
          </CardContent>
        </Card>

        {/* Personal Notes */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personal Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">
              {contact.personalNotes || "No personal notes yet."}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Interaction timeline placeholder — Phase 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Interactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Interaction timeline coming in Phase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
