import { cn } from "@/lib/utils";
import type { EmailStatus } from "@/lib/types";

const styles: Record<EmailStatus, string> = {
  pending: "bg-warning/15 text-warning-foreground",
  failed: "bg-destructive/15 text-destructive",
  opened: "bg-chart-2/15 text-chart-2",
  clicked: "bg-success/15 text-success",
  delivered: "bg-muted text-muted-foreground",
  bounced: "bg-destructive/15 text-destructive",
};

const labels: Record<EmailStatus, string> = {
  pending: "Scheduled",
  failed: "Failed",
  opened: "Opened",
  clicked: "Clicked",
  delivered: "Delivered",
  bounced: "Bounced",
};

export function StatusBadge({ status }: { status: EmailStatus }) {
  const safeStatus = styles[status] ? status : "delivered";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[safeStatus],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[safeStatus]}
    </span>
  );
}
