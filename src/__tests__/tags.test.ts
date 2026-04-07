import { describe, it, expect } from "vitest"

type Tag = { id: string; name: string; color: string }

/** Replicates filtering contacts by tag membership */
function filterContactsByTag(
  contacts: { id: string; name: string }[],
  taggedContactIds: Set<string>
): { id: string; name: string }[] {
  return contacts.filter((c) => taggedContactIds.has(c.id))
}

/** Replicates grouping tags by contact */
function groupTagsByContact(
  rows: { contactId: string; tag: Tag }[]
): Map<string, Tag[]> {
  const map = new Map<string, Tag[]>()
  for (const row of rows) {
    const list = map.get(row.contactId) ?? []
    list.push(row.tag)
    map.set(row.contactId, list)
  }
  return map
}

describe("Tags System", () => {
  describe("Filter Contacts by Tag", () => {
    it("Given 3 contacts and a tag on 2 of them, When filtering by that tag, Then only tagged contacts return", () => {
      const contacts = [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
      ]
      const taggedIds = new Set(["1", "3"])
      const result = filterContactsByTag(contacts, taggedIds)

      expect(result).toHaveLength(2)
      expect(result.map((c) => c.name)).toEqual(["Alice", "Charlie"])
    })

    it("Given contacts and an empty tag set, When filtering, Then no contacts return", () => {
      const contacts = [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
      ]
      const result = filterContactsByTag(contacts, new Set())
      expect(result).toHaveLength(0)
    })

    it("Given no contacts, When filtering by any tag, Then empty array returns", () => {
      const result = filterContactsByTag([], new Set(["1"]))
      expect(result).toHaveLength(0)
    })
  })

  describe("Group Tags by Contact", () => {
    it("Given rows with 2 contacts having tags, When grouping, Then each contact has their tags", () => {
      const tag1: Tag = { id: "t1", name: "Friend", color: "#ef4444" }
      const tag2: Tag = { id: "t2", name: "Work", color: "#3b82f6" }
      const tag3: Tag = { id: "t3", name: "VIP", color: "#eab308" }

      const rows = [
        { contactId: "c1", tag: tag1 },
        { contactId: "c1", tag: tag2 },
        { contactId: "c2", tag: tag3 },
      ]

      const map = groupTagsByContact(rows)

      expect(map.get("c1")).toHaveLength(2)
      expect(map.get("c1")!.map((t) => t.name)).toEqual(["Friend", "Work"])
      expect(map.get("c2")).toHaveLength(1)
      expect(map.get("c2")![0].name).toBe("VIP")
    })

    it("Given no rows, When grouping, Then map is empty", () => {
      const map = groupTagsByContact([])
      expect(map.size).toBe(0)
    })

    it("Given a contact with one tag, When checking the map, Then it has exactly one entry", () => {
      const tag: Tag = { id: "t1", name: "Family", color: "#22c55e" }
      const rows = [{ contactId: "c1", tag }]
      const map = groupTagsByContact(rows)

      expect(map.get("c1")).toHaveLength(1)
      expect(map.get("c1")![0].name).toBe("Family")
    })
  })
})
