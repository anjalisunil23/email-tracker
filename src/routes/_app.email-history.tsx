import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Eye, MousePointerClick } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { emails, formatDate, type EmailStatus } from "@/lib/sample-data";

export const Route = createFileRoute("/_app/email-history")({
  head: () => ({ meta: [{ title: "Email History — MailTrack" }] }),
  component: EmailHistoryPage,
});

const PAGE_SIZE = 8;

function EmailHistoryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<EmailStatus | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return emails.filter((e) => {
      const matchesQuery =
        e.recipientName.toLowerCase().includes(query.toLowerCase()) ||
        e.recipient.toLowerCase().includes(query.toLowerCase()) ||
        e.subject.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === "all" || e.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const rows = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <PageHeader title="Email History" description="Search and filter every email you've sent." />

      <Card className="rounded-2xl p-4 shadow-card sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by recipient or subject..."
              className="h-11 rounded-xl pl-9"
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v as EmailStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-xl sm:w-44">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="clicked">Clicked</SelectItem>
              <SelectItem value="opened">Opened</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="bounced">Bounced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 pb-3 font-medium">Recipient</th>
                <th className="px-3 pb-3 font-medium">Subject</th>
                <th className="px-3 pb-3 font-medium">Sent Date</th>
                <th className="px-3 pb-3 font-medium">Status</th>
                <th className="px-3 pb-3 text-center font-medium">Opens</th>
                <th className="px-3 pb-3 text-center font-medium">Clicks</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((e) => (
                <tr key={e.id} className="group transition-colors hover:bg-muted/50">
                  <td className="px-3 py-3">
                    <Link to="/email-history/$id" params={{ id: e.id }} className="block">
                      <span className="font-medium text-foreground group-hover:text-primary">{e.recipientName}</span>
                      <span className="block text-xs text-muted-foreground">{e.recipient}</span>
                    </Link>
                  </td>
                  <td className="max-w-[220px] truncate px-3 py-3 text-muted-foreground">{e.subject}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">{formatDate(e.sentDate)}</td>
                  <td className="px-3 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-3.5 w-3.5" /> {e.opens}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MousePointerClick className="h-3.5 w-3.5" /> {e.clicks}
                    </span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    No emails match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {rows.length} of {filtered.length} emails
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg"
              disabled={current <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {current} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg"
              disabled={current >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}