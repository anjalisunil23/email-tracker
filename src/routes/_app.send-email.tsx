import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  Underline,
  List,
  Link2,
  Send,
  Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/PageHeader";
import { sendEmail } from "@/services/emailService";
import { getContacts } from "@/services/contactService";
import { getTemplates } from "@/services/templateService";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/send-email")({
  head: () => ({ meta: [{ title: "Send Email — MailTrack" }] }),
  component: SendEmailPage,
});

const toolbar = [Bold, Italic, Underline, List, Link2];

function SendEmailPage() {
  const [recipient, setRecipient] = useState("");
  const [cc, setCc] = useState("");
  const [scheduleAt, setScheduleAt] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getContacts().then((res) => setContacts(res.data)).catch(() => {});
    getTemplates().then((res) => setTemplates(res.data)).catch(() => {});
  }, []);

  const handleTemplateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const tpl = templates.find((t) => t._id === e.target.value);
    if (tpl) {
      setSubject(tpl.subject);
      setMessage(tpl.content);
    }
  };

  const handleContactSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const contact = contacts.find((c) => c._id === e.target.value);
    if (contact) {
      setRecipient(contact.email);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject) {
      toast.error("Recipient and subject are required.");
      return;
    }
    try {
      const res = await sendEmail({ recipient, cc, subject, content: message, scheduleAt: scheduleAt ? new Date(scheduleAt).toISOString() : undefined });
      toast.success(`Email sent to ${recipient} — tracking enabled.`, {
        description: res.data.previewUrl
          ? `Simulate open: ${res.data.previewUrl}`
          : undefined,
        duration: 8000,
      });
      setRecipient("");
      setSubject("");
      setMessage("");
      navigate({ to: "/email-history" });
    } catch (error) {
      toast.error("Failed to send email.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Send Email" description="Compose a tracked email with open and click analytics." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6 shadow-card">
          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="to">Recipient Email</Label>
              <div className="flex gap-2">
                <Input
                  id="to"
                  type="email"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="recipient@company.com"
                  className="h-11 rounded-xl flex-1"
                />
                <select 
                  onChange={handleContactSelect}
                  className="h-11 rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Contacts...</option>
                  {contacts.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cc">CC (comma-separated)</Label>
              <Input
                id="cc"
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="cc1@example.com, cc2@example.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule Send</Label>
              <Input
                id="schedule"
                type="datetime-local"
                value={scheduleAt}
                onChange={(e) => setScheduleAt(e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="subject">Subject</Label>
                <select 
                  onChange={handleTemplateSelect}
                  className="rounded-xl border border-input bg-transparent px-2 py-1 text-xs shadow-sm"
                  defaultValue=""
                >
                  <option value="" disabled>Load Template...</option>
                  {templates.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Your subject line"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <div className="rounded-xl border bg-background">
                <div className="flex items-center gap-1 border-b p-2">
                  {toolbar.map((Icon, i) => (
                    <Button key={i} type="button" variant="ghost" size="icon" className="h-8 w-8">
                      <Icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="min-h-[200px] resize-none border-0 focus-visible:ring-0"
                />
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Switch id="track" defaultChecked />
                <Label htmlFor="track" className="font-normal text-muted-foreground">
                  Track opens & clicks
                </Label>
              </div>
              <Button type="submit" className="btn-primary-gradient">
                <Send className="h-4 w-4" /> Send Email
              </Button>
            </div>
          </form>
        </Card>

        <Card className="rounded-2xl p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Email Preview</span>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <div className="border-b pb-3">
              <p className="text-xs text-muted-foreground">
                To: <span className="text-foreground">{recipient || "recipient@company.com"}</span>
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                {subject || "Your subject line"}
              </p>
            </div>
            <div className="prose prose-sm mt-4 max-w-none whitespace-pre-wrap text-sm text-foreground/90">
              {message || "Write your message and it will appear here in real time. This is exactly how your recipient will see the email."}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-lg bg-accent/50 p-3 text-xs text-accent-foreground">
              <Eye className="h-3.5 w-3.5" />
              Tracking pixel enabled — you'll be notified when this email is opened.
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}