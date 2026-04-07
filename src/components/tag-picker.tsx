"use client"

import { useState, useTransition } from "react"
import { Check, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { setContactTags, createTag } from "@/lib/actions/tags"
import type { Tag } from "@/lib/actions/tags"

interface TagPickerProps {
  contactId: string
  allTags: Tag[]
  activeTags: Tag[]
}

export function TagPicker({ contactId, allTags, activeTags }: TagPickerProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(activeTags.map((t) => t.id))
  )
  const [newTagName, setNewTagName] = useState("")
  const [isPending, startTransition] = useTransition()

  function toggle(tagId: string) {
    const next = new Set(selected)
    if (next.has(tagId)) {
      next.delete(tagId)
    } else {
      next.add(tagId)
    }
    setSelected(next)
    startTransition(async () => {
      await setContactTags(contactId, Array.from(next))
    })
  }

  function handleCreateTag() {
    if (!newTagName.trim()) return
    const formData = new FormData()
    formData.set("name", newTagName.trim())
    formData.set("color", COLORS[Math.floor(Math.random() * COLORS.length)])
    startTransition(async () => {
      await createTag(formData)
      setNewTagName("")
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {activeTags.map((tag) => (
        <Badge
          key={tag.id}
          style={{ backgroundColor: tag.color, color: "#fff" }}
          className="text-xs"
        >
          {tag.name}
          <button
            onClick={() => toggle(tag.id)}
            className="ml-1 hover:opacity-70"
            disabled={isPending}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
      <Popover>
        <PopoverTrigger render={
          <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
            <Plus className="mr-1 h-3 w-3" /> Tag
          </Button>
        } />
        <PopoverContent className="w-56 p-2" align="start">
          <div className="space-y-2">
            {allTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => toggle(tag.id)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent"
                disabled={isPending}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="flex-1 text-left">{tag.name}</span>
                {selected.has(tag.id) && <Check className="h-3 w-3" />}
              </button>
            ))}
            <div className="flex gap-1 border-t pt-2">
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="New tag..."
                className="h-7 text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleCreateTag()}
              />
              <Button
                size="sm"
                className="h-7 px-2"
                onClick={handleCreateTag}
                disabled={isPending || !newTagName.trim()}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

const COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#6b7280",
]
