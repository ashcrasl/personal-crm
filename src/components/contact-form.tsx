"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Contact } from "@/lib/actions/contacts"

interface ContactFormProps {
  contact?: Contact
  action: (formData: FormData) => Promise<void>
  title: string
}

export function ContactForm({ contact, action, title }: ContactFormProps) {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                required
                defaultValue={contact?.name}
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                defaultValue={contact?.company ?? ""}
                placeholder="Acme Corp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                name="role"
                defaultValue={contact?.role ?? ""}
                placeholder="VP of Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={contact?.email ?? ""}
                placeholder="jane@acme.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={contact?.phone ?? ""}
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Birthday</Label>
              <Input
                id="birthday"
                name="birthday"
                type="date"
                defaultValue={contact?.birthday ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
            <Input
              id="linkedinUrl"
              name="linkedinUrl"
              defaultValue={contact?.linkedinUrl ?? ""}
              placeholder="https://linkedin.com/in/janesmith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="howWeMet">How We Met</Label>
            <Input
              id="howWeMet"
              name="howWeMet"
              defaultValue={contact?.howWeMet ?? ""}
              placeholder="Met at the AWS re:Invent conference"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalNotes">Personal Notes</Label>
            <Textarea
              id="personalNotes"
              name="personalNotes"
              defaultValue={contact?.personalNotes ?? ""}
              placeholder="Kids: two daughters (Emma, Lily). Loves hiking and craft beer. Dog named Max."
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit">
              {contact ? "Save Changes" : "Add Contact"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
