import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { getScheduledEmails, cancelScheduledEmail } from "@/services/emailService";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_app/scheduled")({
  head: () => ({ meta: [{ title: "Scheduled Emails — MailTrack" }] }),
  component: ScheduledPage,
});

function ScheduledPage() {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScheduled = () => {
    setLoading(true);
    getScheduledEmails()
      .then((res) => setEmails(res.data))
      .catch(() => toast.error("Failed to load scheduled emails"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScheduled();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await cancelScheduledEmail(id);
      toast.success("Scheduled email cancelled");
      fetchScheduled();
    } catch {
      toast.error("Failed to cancel email");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Scheduled Emails"
        description="View and manage emails queued for future delivery."
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading scheduled emails...</p>
      ) : emails.length === 0 ? (
        <Card className="rounded-2xl p-12 text-center shadow-card">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">
            No scheduled emails. Schedule one from Send Email.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <Card
              key={email.id}
              className="rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="flex-1">
                <p className="font-semibold text-foreground">{email.subject}</p>
                <p className="text-sm text-muted-foreground">To: {email.recipient}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-primary">
                  <Clock className="h-3.5 w-3.5" />
                  Scheduled for {formatDate(email.scheduleAt)}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancel(email.id)}
                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
