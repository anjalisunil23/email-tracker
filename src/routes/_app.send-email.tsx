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

export const Route = createFileRoute("/_app/send-email")({
  head: () => ({ meta: [{ title: "Send Email — MailTrack" }] }),
  component: SendEmailPage,
});

const toolbar = [Bold, Italic, Underline, List, Link2];

function SendEmailPage() {
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject) {
      toast.error("Recipient and subject are required.");
      return;
    }
    toast.success(`Email sent to ${recipient} — tracking enabled.`);
    setRecipient("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Send Email" description="Compose a tracked email with open and click analytics." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6 shadow-card">
          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="to">Recipient Email</Label>
              <Input
                id="to"
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="recipient@company.com"
                className="h-11 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
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
              <Button type="submit" className="rounded-xl bg-gradient-primary shadow-elevated hover:opacity-90">
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