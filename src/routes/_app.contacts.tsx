import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
  importContactsCsv,
} from "@/services/contactService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/layout/PageHeader";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Users, Pencil, Upload } from "lucide-react";

export const Route = createFileRoute("/_app/contacts")({
  head: () => ({ meta: [{ title: "Contacts — MailTrack" }] }),
  component: ContactsPage,
});

function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", company: "" });
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchContacts = () => {
    getContacts()
      .then((res) => setContacts(res.data))
      .catch(() => {});
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
    } catch {
      toast.error("Failed to add contact");
    }
  };

  const openEdit = (contact: any) => {
    setEditId(contact._id);
    setEditForm({ name: contact.name, email: contact.email, company: contact.company || "" });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editId) return;
    try {
      await updateContact(editId, editForm);
      toast.success("Contact updated");
      setEditOpen(false);
      fetchContacts();
    } catch {
      toast.error("Failed to update contact");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id);
      toast.success("Contact deleted");
      fetchContacts();
    } catch {
      toast.error("Failed to delete contact");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await importContactsCsv(file);
      toast.success(res.data.msg || "Contacts imported");
      fetchContacts();
    } catch {
      toast.error("Failed to import CSV");
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Contacts"
        description="Manage your recipients for easy access."
        action={
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleImport}
            />
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 shadow-card h-fit">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Users className="h-5 w-5" /> Add New Contact
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Jane Doe"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="jane@example.com"
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="rounded-xl"
              />
            </div>
            <Button type="submit" className="w-full btn-primary-gradient">
              Add Contact
            </Button>
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            CSV format: name, email, company (with header row)
          </p>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {contacts.map((contact) => (
            <Card
              key={contact._id}
              className="rounded-xl p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-semibold text-foreground">{contact.name}</p>
                <p className="text-sm text-muted-foreground">
                  {contact.email} {contact.company && `• ${contact.company}`}
                </p>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => openEdit(contact)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(contact._id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No contacts found. Add some or import a CSV!
            </div>
          )}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input
                value={editForm.company}
                onChange={(e) => setEditForm((f) => ({ ...f, company: e.target.value }))}
                className="rounded-xl"
              />
            </div>
            <Button onClick={handleEdit} className="w-full btn-primary-gradient">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
