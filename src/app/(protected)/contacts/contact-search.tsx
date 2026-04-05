"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useRef } from "react"

export function ContactSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      const value = e.target.value
      if (value) {
        router.push(`/contacts?q=${encodeURIComponent(value)}`)
      } else {
        router.push("/contacts")
      }
    }, 300)
  }

  return (
    <div className="relative max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search contacts..."
        defaultValue={defaultValue}
        onChange={handleChange}
        className="pl-9"
      />
    </div>
  )
}
