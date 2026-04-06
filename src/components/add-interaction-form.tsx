"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { addInteraction } from "@/lib/actions/interactions"

const INTERACTION_TYPES = [
  { value: "call", label: "Call" },
  { value: "email", label: "Email" },
  { value: "meeting", label: "Meeting" },
  { value: "coffee", label: "Coffee" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
]

export function AddInteractionForm({ contactId }: { contactId: string }) {
  const [open, setOpen] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  async function handleSubmit(formData: FormData) {
    await addInteraction(formData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <Plus className="mr-2 h-4 w-4" />
        Add Interaction
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Interaction</DialogTitle>
          <DialogDescription>
            Record a conversation or touchpoint.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <input type="hidden" name="contactId" value={contactId} />

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <div className="flex flex-wrap gap-2">
              {INTERACTION_TYPES.map((t) => (
                <label key={t.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={t.value}
                    defaultChecked={t.value === "call"}
                    className="peer sr-only"
                  />
                  <span className="inline-block rounded-md border px-3 py-1.5 text-sm peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary">
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={today}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="What did you talk about?"
              rows={3}
            />
          </div>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
