import { format } from "date-fns"
import { Phone, Mail, Users, Coffee, Link2, MoreHorizontal, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { deleteInteraction } from "@/lib/actions/interactions"
import type { Interaction } from "@/lib/actions/interactions"

const TYPE_ICONS: Record<string, React.ElementType> = {
  call: Phone,
  email: Mail,
  meeting: Users,
  coffee: Coffee,
  linkedin: Link2,
  other: MoreHorizontal,
}

const TYPE_COLORS: Record<string, string> = {
  call: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  email: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  meeting: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  coffee: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  linkedin: "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  other: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export function InteractionTimeline({
  interactions,
  contactId,
}: {
  interactions: Interaction[]
  contactId: string
}) {
  if (interactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No interactions yet. Add one to start tracking.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {interactions.map((interaction) => {
        const Icon = TYPE_ICONS[interaction.type] || MoreHorizontal
        const colorClass = TYPE_COLORS[interaction.type] || TYPE_COLORS.other
        const deleteWithIds = deleteInteraction.bind(null, interaction.id, contactId)

        return (
          <div
            key={interaction.id}
            className="flex items-start gap-3 rounded-lg border p-3"
          >
            <div className={`rounded-md p-2 ${colorClass}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {interaction.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(interaction.date), "MMM d, yyyy")}
                </span>
              </div>
              {interaction.notes && (
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {interaction.notes}
                </p>
              )}
            </div>
            <form action={deleteWithIds}>
              <Button variant="ghost" size="icon-xs" className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </Button>
            </form>
          </div>
        )
      })}
    </div>
  )
}
