import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTemplates, createTemplate, deleteTemplate } from "@/services/templateService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/layout/PageHeader";
import { Trash2, FileText } from "lucide-react";

export const Route = createFileRoute("/_app/templates")({
  head: () => ({ meta: [{ title: "Templates — MailTrack" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");

  const fetchTemplates = () => {
    getTemplates().then((res) => setTemplates(res.data)).catch(() => {});
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !content) return toast.error("All fields are required");
    try {
      await createTemplate({ name, subject, content });
      toast.success("Template added");
      setName("");
      setSubject("");
      setContent("");
      fetchTemplates();
    } catch (err) {
      toast.error("Failed to add template");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTemplate(id);
      toast.success("Template deleted");
      fetchTemplates();
    } catch (err) {
      toast.error("Failed to delete template");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Templates" description="Create and manage reusable email templates." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 shadow-card h-fit lg:col-span-1">
          <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5" /> New Template
          </h3>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label>Template Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Welcome Email" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Subject Line</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} required placeholder="Welcome to our platform!" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label>Email Content</Label>
              <Textarea value={content} onChange={(e) => setContent(e.target.value)} required placeholder="Hello [Name], ..." className="rounded-xl min-h-[150px]" />
            </div>
            <Button type="submit" className="w-full btn-primary-gradient">Save Template</Button>
          </form>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {templates.map((tpl) => (
            <Card key={tpl._id} className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-start justify-between shadow-sm gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground text-lg">{tpl.name}</p>
                <p className="text-sm font-medium text-muted-foreground mb-2">Subject: {tpl.subject}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-md">{tpl.content}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(tpl._id)} className="text-red-500 hover:bg-red-50 hover:text-red-600 self-end sm:self-start">
                <Trash2 className="h-4 w-4" />
              </Button>
            </Card>
          ))}
          {templates.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No templates found. Create one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
