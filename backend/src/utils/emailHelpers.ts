export type EmailStatus = "pending" | "failed" | "delivered" | "opened" | "clicked" | "bounced";
export type DeliveryStatus = "pending" | "sent" | "failed";

export function deriveEngagementStatus(
  opens: number,
  clicks: number,
): "delivered" | "opened" | "clicked" {
  if (clicks > 0) return "clicked";
  if (opens > 0) return "opened";
  return "delivered";
}

export function resolveEmailStatus(
  deliveryStatus: DeliveryStatus | string,
  opens: number,
  clicks: number,
): EmailStatus {
  if (deliveryStatus === "pending") return "pending";
  if (deliveryStatus === "failed") return "failed";
  return deriveEngagementStatus(opens, clicks);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

export function buildTrackedHtml(content: string, trackingId: string, backendUrl: string): string {
  const trackClick = (url: string) =>
    `${backendUrl}/api/track/click/${trackingId}?url=${encodeURIComponent(url)}`;

  let html = content;

  // Rewrite existing anchor hrefs
  html = html.replace(
    /<a\s+([^>]*?)href=["']([^"']+)["']([^>]*)>/gi,
    (_match, before, url, after) => {
      if (url.startsWith(`${backendUrl}/api/track/click/`)) return _match;
      return `<a ${before}href="${trackClick(url)}"${after}>`;
    },
  );

  // Convert bare URLs to clickable tracked links
  html = html.replace(/(?<!href=["'])(https?:\/\/[^\s<>"']+)/g, (url) => {
    return `<a href="${trackClick(url)}" style="color:#2563eb;text-decoration:underline;">${url}</a>`;
  });

  // Plain text: newlines to <br> if no HTML tags present
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    html = escapeHtml(html).replace(/\n/g, "<br>");
  }

  const pixelUrl = `${backendUrl}/api/track/open/${trackingId}`;
  const pixel = `<img src="${pixelUrl}" width="1" height="1" alt="" style="display:block;width:1px;height:1px;border:0;" />`;
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;"><div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#333333;">${html}${pixel}</div></body></html>`;
}
