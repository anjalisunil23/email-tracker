import { cn } from "@/lib/utils";
import type { EmailStatus } from "@/lib/sample-data";

const styles: Record<EmailStatus, string> = {
  opened: "bg-chart-2/15 text-chart-2",
  clicked: "bg-success/15 text-success",
  delivered: "bg-muted text-muted-foreground",
  bounced: "bg-destructive/15 text-destructive",
};

const labels: Record<EmailStatus, string> = {
  opened: "Opened",
  clicked: "Clicked",
  delivered: "Delivered",
  bounced: "Bounced",
};

export function StatusBadge({ status }: { status: EmailStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}