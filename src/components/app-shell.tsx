"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Users, Home, Cake, LogOut, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { logout } from "@/lib/actions/auth"
import { cn } from "@/lib/utils"
import { CommandPalette } from "@/components/command-palette"

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/contacts", label: "Contacts", icon: Users },
  { href: "/birthdays", label: "Birthdays", icon: Cake },
]

function SearchTrigger() {
  return (
    <button
      onClick={() => {
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true })
        )
      }}
      className="flex w-full items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
    >
      <Search className="h-3.5 w-3.5" />
      <span className="flex-1 text-left">Search...</span>
      <kbd className="rounded border bg-background px-1 py-0.5 text-[10px]">⌘K</kbd>
    </button>
  )
}

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent",
            pathname === item.href
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-3 py-4">
        <h1 className="text-lg font-semibold">Personal CRM</h1>
      </div>
      <Separator />
      <div className="px-2 pt-4 pb-2">
        <SearchTrigger />
      </div>
      <div className="flex-1 px-2">
        <NavLinks onClick={onNavigate} />
      </div>
      <Separator />
      <div className="p-2">
        <form action={logout}>
          <Button type="submit" variant="ghost" className="w-full justify-start gap-3" size="sm">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 border-r bg-background md:block">
        <SidebarContent />
      </aside>

      {/* Mobile header + sheet */}
      <CommandPalette />

      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center border-b px-4 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0">
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
          <span className="ml-3 text-lg font-semibold">Personal CRM</span>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
