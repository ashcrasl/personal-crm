import { notFound } from "next/navigation"
import { ContactForm } from "@/components/contact-form"
import { getContact, updateContact } from "@/lib/actions/contacts"

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await getContact(id)

  if (!contact) notFound()

  const updateWithId = updateContact.bind(null, id)

  return (
    <div className="space-y-6">
      <ContactForm
        contact={contact}
        action={updateWithId}
        title="Edit Contact"
      />
    </div>
  )
}
