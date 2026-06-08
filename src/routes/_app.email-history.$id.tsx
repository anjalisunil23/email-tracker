import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Eye,
  MousePointerClick,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Mail,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { getEmail, trackingTimeline, formatDate } from "@/lib/sample-data";

export const Route = createFileRoute("/_app/email-history/$id")({
  head: () => ({ meta: [{ title: "Email Details — MailTrack" }] }),
  component: EmailDetailsPage,
  notFoundComponent: NotFound,
});

function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="text-muted-foreground">This email could not be found.</p>
      <Button asChild variant="outline" className="mt-4 rounded-xl">
        <Link to="/email-history">Back to history</Link>
      </Button>
    </div>
  );
}

const deviceIcon = (d: string) =>
  d === "Mobile" ? Smartphone : d === "Tablet" ? Tablet : Monitor;

function EmailDetailsPage() {
  const { id } = Route.useParams();
  const router = useRouter();
  const email = getEmail(id);

  if (!email) return <NotFound />;

  const opens = trackingTimeline.filter((t) => t.type === "open");
  const clicks = trackingTimeline.filter((t) => t.type === "click");

  const summary = [
    { label: "Opens", value: email.opens, icon: Eye },
    { label: "Clicks", value: email.clicks, icon: MousePointerClick },
    { label: "Devices", value: 3, icon: Monitor },
    { label: "Locations", value: 2, icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        onClick={() => router.history.back()}
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <PageHeader title="Email Details" description={`Tracking report for ${email.id}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label} className="rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground">
              <s.icon className="h-4 w-4" />
              <span className="text-sm">{s.label}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl p-6 shadow-card lg:col-span-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-sm font-medium">Email Information</span>
          </div>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Recipient</dt>
              <dd className="font-medium text-foreground">{email.recipientName}</dd>
              <dd className="text-xs text-muted-foreground">{email.recipient}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Subject</dt>
              <dd className="font-medium text-foreground">{email.subject}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sent</dt>
              <dd className="font-medium text-foreground">{formatDate(email.sentDate)}</dd>
            </div>
            <div>
              <dt className="mb-1 text-muted-foreground">Status</dt>
              <dd><StatusBadge status={email.status} /></dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Preview</dt>
              <dd className="mt-1 rounded-lg bg-muted/60 p-3 text-foreground/80">{email.preview}</dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl p-6 shadow-card">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Eye className="h-4 w-4 text-chart-2" /> Open Tracking Timeline
            </h3>
            <Timeline events={opens} accent="text-chart-2" />
          </Card>

          <Card className="rounded-2xl p-6 shadow-card">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <MousePointerClick className="h-4 w-4 text-success" /> Click Tracking Timeline
            </h3>
            <Timeline events={clicks} accent="text-success" />
          </Card>
        </div>
      </div>
    </div>
  );
}

function Timeline({
  events,
  accent,
}: {
  events: typeof trackingTimeline;
  accent: string;
}) {
  if (events.length === 0) {
    return <p className="mt-4 text-sm text-muted-foreground">No events recorded yet.</p>;
  }
  return (
    <ol className="mt-4 space-y-5">
      {events.map((ev, i) => {
        const DeviceIcon = deviceIcon(ev.device);
        return (
          <li key={ev.id} className="relative flex gap-4 pl-2">
            <div className="flex flex-col items-center">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full bg-muted ${accent}`}>
                <Clock className="h-4 w-4" />
              </span>
              {i < events.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="pb-1">
              <p className="text-sm font-medium text-foreground">{ev.label}</p>
              <p className="text-xs text-muted-foreground">{formatDate(ev.time)}</p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3 w-3" /> {ev.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <DeviceIcon className="h-3 w-3" /> {ev.device}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Monitor className="h-3 w-3" /> {ev.browser}
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}