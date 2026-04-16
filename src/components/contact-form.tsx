"use client"

import { useRef, useState } from "react"
import { Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Contact } from "@/lib/actions/contacts"

interface ContactFormProps {
  contact?: Contact
  action: (formData: FormData) => Promise<void>
  title: string
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ContactForm({ contact, action, title }: ContactFormProps) {
  const [preview, setPreview] = useState<string | null>(contact?.photoUrl ?? null)
  const [removePhoto, setRemovePhoto] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setPreview(URL.createObjectURL(file))
      setRemovePhoto(false)
    }
  }

  function handleRemovePhoto() {
    setPreview(null)
    setRemovePhoto(true)
    if (fileRef.current) fileRef.current.value = ""
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="removePhoto" value={removePhoto ? "true" : "false"} />

          {/* Photo upload */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={preview ?? undefined} />
                <AvatarFallback className="text-lg">
                  {contact?.name ? getInitials(contact.name) : <Camera className="h-6 w-6" />}
                </AvatarFallback>
              </Avatar>
              {preview && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="photo" className="text-sm font-medium">Photo</Label>
              <Input
                ref={fileRef}
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="max-w-64"
              />
              <p className="text-xs text-muted-foreground">JPG, PNG, or WebP. Max 4MB.</p>
            </div>
          </div>

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
            <div className="space-y-2">
              <Label htmlFor="spouseName">Spouse Name</Label>
              <Input
                id="spouseName"
                name="spouseName"
                defaultValue={contact?.spouseName ?? ""}
                placeholder="Partner or spouse name"
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
