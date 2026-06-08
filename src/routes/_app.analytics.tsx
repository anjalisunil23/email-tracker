import { createFileRoute } from "@tanstack/react-router";
import { Eye, MousePointerClick, TrendingUp, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/PageHeader";
import { TrendAreaChart, OpensBarChart } from "@/components/dashboard/Charts";
import { topEmails, recentActivity, formatDate } from "@/lib/sample-data";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics — MailTrack" }] }),
  component: AnalyticsPage,
});

const summary = [
  { label: "Avg. Open Rate", value: "74.8%", icon: Eye },
  { label: "Avg. Click Rate", value: "24.9%", icon: MousePointerClick },
  { label: "Best Day", value: "Friday", icon: TrendingUp },
  { label: "Emails Tracked", value: "12,840", icon: Mail },
];

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Deep insights into your email engagement." />

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

      <Card className="rounded-2xl p-6 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Open & Click Rate Trends</h3>
            <p className="text-sm text-muted-foreground">Monthly engagement over time</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-chart-1" /> Open rate
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-chart-3" /> Click rate
            </span>
          </div>
        </div>
        <TrendAreaChart />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl p-6 shadow-card">
          <h3 className="mb-4 font-semibold text-foreground">Weekly Volume</h3>
          <OpensBarChart />
        </Card>

        <Card className="rounded-2xl p-6 shadow-card">
          <h3 className="mb-4 font-semibold text-foreground">Top Performing Emails</h3>
          <div className="space-y-3">
            {topEmails.map((e, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border bg-background p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{e.subject}</p>
                  <p className="text-xs text-muted-foreground">{e.recipient}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{e.openRate}%</p>
                  <p className="text-xs text-muted-foreground">{e.clicks} clicks</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="rounded-2xl p-6 shadow-card">
        <h3 className="mb-4 font-semibold text-foreground">Recent Tracking Events</h3>
        <div className="space-y-2">
          {recentActivity.map((ev) => (
            <div key={ev.id} className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${ev.type === "click" ? "bg-success/15 text-success" : "bg-chart-2/15 text-chart-2"}`}>
                  {ev.type === "click" ? <MousePointerClick className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">{ev.label}</p>
                  <p className="text-xs text-muted-foreground">{ev.location} · {ev.device}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{formatDate(ev.time)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}