export type EmailStatus = 'delivered' | 'opened' | 'clicked' | 'bounced';

export function deriveStatus(opens: number, clicks: number): EmailStatus {
  if (clicks > 0) return 'clicked';
  if (opens > 0) return 'opened';
  return 'delivered';
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
    html = escapeHtml(html).replace(/\n/g, '<br>');
  }

  const pixel = `<img src="${backendUrl}/api/track/open/${trackingId}" width="1" height="1" alt="" style="display:none;" />`;
  return `<div style="font-family:sans-serif;font-size:14px;line-height:1.6;color:#333;">${html}${pixel}</div>`;
}
