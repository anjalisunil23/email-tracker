import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { getEmailAnalytics } from "@/services/analyticsService";
import { MapPin, Search, ChevronLeft, ChevronRight, Eye, MousePointerClick } from "lucide-react";
import { useEffect, useState } from "react";
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
import { listEmails } from "@/services/emailService";
import { formatDate } from "@/lib/format";

type EmailHistorySearch = { q?: string };

export const Route = createFileRoute("/_app/email-history")({
  validateSearch: (search: Record<string, unknown>): EmailHistorySearch => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({ meta: [{ title: "Email History — MailTrack" }] }),
  component: EmailHistoryPage,
});

import type { EmailStatus } from "@/lib/types";

function EmailHistoryPage() {
  const { q: initialQ } = Route.useSearch();
  const [query, setQuery] = useState(initialQ || "");
  const [status, setStatus] = useState<EmailStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Fetch email detail when an email is selected
  useEffect(() => {
    if (selectedEmailId) {
      setDetailLoading(true);
      getEmailAnalytics(selectedEmailId)
        .then((res) => setDetailData(res.data))
        .catch(console.error)
        .finally(() => setDetailLoading(false));
    }
  }, [selectedEmailId]);

  useEffect(() => {
    if (initialQ) setQuery(initialQ);
  }, [initialQ]);

  useEffect(() => {
    setLoading(true);
    listEmails({
      search: query || undefined,
      status: status === "all" ? undefined : status,
      page,
    })
      .then((res) => {
        setRows(res.data.items);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query, status, page]);

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

          {/* Detail Dialog */}
          <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
            <DialogContent className="max-w-2xl rounded-2xl p-6">
              <DialogHeader>
                <DialogTitle>Email Details</DialogTitle>
                <DialogDescription>Full open and click timeline</DialogDescription>
              </DialogHeader>
              {detailLoading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : detailData ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Recipient</p>
                      <p>{detailData.email.recipient}</p>
                    </div>
                    <div>
                      <p className="font-medium">Subject</p>
                      <p>{detailData.email.subject}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium">Opens</p>
                      <p>{detailData.email.opens}</p>
                    </div>
                    <div>
                      <p className="font-medium">Clicks</p>
                      <p>{detailData.email.clicks}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Open Timeline</h3>
                    <ul className="space-y-2">
                      {detailData.openHistory.map((ev: any) => (
                        <li key={ev.id} className="text-sm">
                          {formatDate(ev.time)} – {ev.device} – {ev.browser} – {ev.location}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Click Timeline</h3>
                    <ul className="space-y-2">
                      {detailData.clickHistory.map((ev: any) => (
                        <li key={ev.id} className="text-sm">
                          {formatDate(ev.time)} – {ev.device} – {ev.browser} – {ev.location}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>Unique locations: {detailData.uniqueLocations}</span>
                  </div>
                </div>
              ) : null}
            </DialogContent>
          </Dialog>

          {/* Status Filter */}
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
              <SelectItem value="pending">Scheduled</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="clicked">Clicked</SelectItem>
              <SelectItem value="opened">Opened</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Email Table */}
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    Loading...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground">
                    No emails match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((e) => (
                  <tr
                    key={e.id}
                    className="group transition-colors hover:bg-muted/50"
                    onClick={() => {
                      setSelectedEmailId(e.id);
                      setDetailOpen(true);
                    }}
                  >
                    <td className="px-3 py-3">
                      <Link to="/email-history/$id" params={{ id: e.id }} className="block">
                        <span className="font-medium text-foreground group-hover:text-primary">
                          {e.recipientName}
                        </span>
                        <span className="block text-xs text-muted-foreground">{e.recipient}</span>
                      </Link>
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-3 text-muted-foreground">
                      {e.subject}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-muted-foreground">
                      {formatDate(e.sentDate)}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={e.status} />
                    </td>
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {rows.length} of {total} emails
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg"
              disabled={page >= totalPages}
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
