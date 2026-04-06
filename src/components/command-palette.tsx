"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, User, Cake, Home, Users } from "lucide-react"
import { getContacts } from "@/lib/actions/contacts"
import type { Contact } from "@/lib/actions/contacts"

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const search = useCallback(
    (value: string) => {
      setQuery(value)
      if (value.length < 1) {
        setContacts([])
        return
      }
      startTransition(async () => {
        const results = await getContacts(value)
        setContacts(results)
      })
    },
    []
  )

  function navigate(path: string) {
    setOpen(false)
    setQuery("")
    setContacts([])
    router.push(path)
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search"
      overlayClassName="fixed inset-0 bg-black/50 z-50"
      contentClassName="fixed left-1/2 top-1/4 z-50 w-full max-w-lg -translate-x-1/2 rounded-xl border bg-background shadow-2xl"
    >
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
        <Command.Input
          value={query}
          onValueChange={search}
          placeholder="Search contacts or navigate..."
          className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-xs text-muted-foreground sm:inline">
          ESC
        </kbd>
      </div>
      <Command.List className="max-h-80 overflow-y-auto p-2">
        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
          {isPending ? "Searching..." : "No results found."}
        </Command.Empty>

        {/* Quick nav — always visible */}
        <Command.Group heading="Navigation" className="pb-2 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
          <Command.Item
            onSelect={() => navigate("/")}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
          >
            <Home className="h-4 w-4" /> Dashboard
          </Command.Item>
          <Command.Item
            onSelect={() => navigate("/contacts")}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
          >
            <Users className="h-4 w-4" /> All Contacts
          </Command.Item>
          <Command.Item
            onSelect={() => navigate("/birthdays")}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
          >
            <Cake className="h-4 w-4" /> Birthdays
          </Command.Item>
          <Command.Item
            onSelect={() => navigate("/contacts/new")}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
          >
            <User className="h-4 w-4" /> Add Contact
          </Command.Item>
        </Command.Group>

        {/* Search results */}
        {contacts.length > 0 && (
          <Command.Group heading="Contacts" className="text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5">
            {contacts.map((c) => (
              <Command.Item
                key={c.id}
                value={`${c.name} ${c.company ?? ""}`}
                onSelect={() => navigate(`/contacts/${c.id}`)}
                className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm aria-selected:bg-accent"
              >
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{c.name}</span>
                {c.company && (
                  <span className="text-muted-foreground">— {c.company}</span>
                )}
              </Command.Item>
            ))}
          </Command.Group>
        )}
      </Command.List>
    </Command.Dialog>
  )
}
