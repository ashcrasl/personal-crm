import { ContactForm } from "@/components/contact-form"
import { createContact } from "@/lib/actions/contacts"

export default function NewContactPage() {
  return (
    <div className="space-y-6">
      <ContactForm action={createContact} title="Add Contact" />
    </div>
  )
}
