import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getContacts, createContact, deleteContact } from "@/services/contactService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/PageHeader";
import { Trash2, Users } from "lucide-react";

export const Route = createFileRoute("/_app/contacts")({
  head: () => ({ meta: [{ title: "Contacts — MailTrack" }] }),
  component: ContactsPage,
});

function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");

  const fetchContacts = () => {
    getContacts().then((res) => setContacts(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return toast.error("Name and Email are required");
    try {
      await createContact({ name, email, company });
      toast.success("Contact added");
      setName("");
      setEmail("");
      setCompany("");
      fetchContacts();
    } catch (err) {
      toast.error("Failed to add contact");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id);
      toast.success("Contact deleted");
      fetchContacts();
    } catch (err) {
      toast.error("Failed to delete contact");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Contacts" description="Manage your recipients for easy access." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 shadow-card h-fit">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" /> Add New Contact
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Doe" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jane@example.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className="rounded-xl" />
            </div>
            <Button type="submit" className="w-full btn-primary-gradient">Add Contact</Button>
          </form>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {contacts.map((contact) => (
            <Card key={contact._id} className="rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="font-semibold text-foreground">{contact.name}</p>
                <p className="text-sm text-muted-foreground">{contact.email} {contact.company && `• ${contact.company}`}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(contact._id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No contacts found. Add some!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
