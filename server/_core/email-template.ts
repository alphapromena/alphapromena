/* ── Branded HTML email for lead notifications ──────────────────── */

export interface LeadField {
  label: string;
  value: string;
  href?: string | null;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ROSE = "#FF1E57";
const INK = "#14131A";
const SOFT = "#56535F";
const FAINT = "#8A8893";
const LINE = "#E7E2D6";
const PAPER = "#FBFAF8";

export function renderLeadEmail(opts: {
  heading: string;
  badge: string;
  fields: LeadField[];
  message: string;
  replyEmail: string;
}): string {
  const { heading, badge, fields, message, replyEmail } = opts;

  const rows = fields
    .map((f) => {
      const val = f.href
        ? `<a href="${escapeHtml(f.href)}" style="color:${ROSE};text-decoration:none;font-weight:600;">${escapeHtml(f.value)}</a>`
        : `<span style="color:${INK};font-weight:600;">${escapeHtml(f.value)}</span>`;
      return `
        <tr>
          <td style="padding:12px 0;border-top:1px solid ${LINE};vertical-align:top;width:150px;">
            <span style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT};">${escapeHtml(f.label)}</span>
          </td>
          <td style="padding:12px 0;border-top:1px solid ${LINE};vertical-align:top;font-size:15px;">${val}</td>
        </tr>`;
    })
    .join("");

  const messageHtml = escapeHtml(message).replace(/\r?\n/g, "<br>");

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border:1px solid ${LINE};border-radius:14px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:${ROSE};padding:22px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="font-size:15px;font-weight:800;letter-spacing:-0.02em;color:#ffffff;">Alpha&nbsp;Pro&nbsp;MENA</td>
            <td align="right" style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.85);">New&nbsp;Lead</td>
          </tr></table>
        </td></tr>

        <!-- Title -->
        <tr><td style="padding:32px 32px 8px 32px;">
          <div style="display:inline-block;background:#FFEAF0;color:#D11048;font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;padding:5px 10px;border-radius:100px;">${escapeHtml(badge)}</div>
          <h1 style="margin:16px 0 0 0;font-size:24px;line-height:1.2;letter-spacing:-0.03em;color:${INK};font-weight:800;">${escapeHtml(heading)}</h1>
        </td></tr>

        <!-- Fields -->
        <tr><td style="padding:16px 32px 8px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding:16px 32px 8px 32px;">
          <div style="font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${FAINT};margin-bottom:8px;">Message</div>
          <div style="background:${PAPER};border:1px solid ${LINE};border-radius:10px;padding:16px 18px;font-size:15px;line-height:1.6;color:${INK};">${messageHtml}</div>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:24px 32px 32px 32px;">
          <a href="mailto:${escapeHtml(replyEmail)}" style="display:inline-block;background:${ROSE};color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:12px 22px;border-radius:8px;">Reply to ${escapeHtml(replyEmail)}</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:18px 32px;border-top:1px solid ${LINE};background:${PAPER};">
          <span style="font-size:12px;color:${SOFT};">Submitted from alphapromena.com · Amman, Jordan · Saudi Arabia</span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* Plain-text fallback for clients that don't render HTML. */
export function renderLeadText(opts: { heading: string; badge: string; fields: LeadField[]; message: string }): string {
  const lines = opts.fields.map((f) => `${f.label}: ${f.value}`);
  return `${opts.heading} (${opts.badge})\n\n${lines.join("\n")}\n\nMessage:\n${opts.message}`;
}
