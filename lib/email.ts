// Gmail SMTP sender for the application email. `nodemailer` is imported lazily
// (dynamic import inside the function) so a load failure surfaces as a caught
// error in the handler rather than crashing the whole serverless function.
//
// Env vars: EMAIL_SENDER, EMAIL_PASSWORD (Gmail App Password), SMTP_SERVER, SMTP_PORT

import type { ApplicationData } from './application';

export const ADMIN_EMAIL = 'dhaariinfo@gmail.com';

const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

let cachedTransport: any = null;
async function getTransport() {
  if (cachedTransport) return cachedTransport;
  const mod: any = await import('nodemailer');
  const nodemailer = mod.default ?? mod;
  const port = Number(process.env.SMTP_PORT) || 465;
  cachedTransport = nodemailer.createTransport({
    host: process.env.SMTP_SERVER || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: process.env.EMAIL_SENDER, pass: process.env.EMAIL_PASSWORD },
  });
  return cachedTransport;
}

/** Sends the admin notification (required) and the applicant confirmation (best effort). */
export async function sendApplicationEmails(d: ApplicationData): Promise<void> {
  if (!process.env.EMAIL_SENDER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email service not configured');
  }

  const roleDisplay = d.role === 'Other' ? `Other - ${d.other_description}` : d.role;
  const submittedAt = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  const from = `DHAARI <${process.env.EMAIL_SENDER}>`;
  const transport = await getTransport();

  const rows: Array<[string, string]> = [
    ['First Name', d.firstname],
    ['Last Name', d.lastname],
    ['Contact No', d.contact_no],
    ['Email ID', d.email],
    ['Address', d.address],
    ['Role', roleDisplay],
    ['Submitted', `${submittedAt} IST`],
  ];
  if (d.payment_id) rows.push(['Payment ID', d.payment_id]);

  const adminText =
    `Dear DHAARI Team,\n\nA new submission has been received on the DHAARI platform.\n\n` +
    `Submission Details:\n` +
    `--------------------------------------------------\n` +
    rows.map(([k, v]) => `${k.padEnd(12)} : ${v}`).join('\n') +
    `\n--------------------------------------------------\n\n` +
    `Please review the details and take the necessary action.\n\nRegards,\nDHAARI System`;

  const adminHtml = `
    <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px">New Submission Received | DHAARI</h2>
      <p style="margin:0 0 16px;color:#555">A new submission has been received on the DHAARI platform.</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) => `
          <tr>
            <td style="padding:8px 12px;border:1px solid #eee;font-weight:600;white-space:nowrap">${esc(k)}</td>
            <td style="padding:8px 12px;border:1px solid #eee">${esc(v)}</td>
          </tr>`
          )
          .join('')}
      </table>
    </div>`;

  const userText = `Dear ${d.firstname} ${d.lastname},

Thank you for submitting your details on DHAARI.

We have successfully received your information${d.payment_id ? ' and your payment of 500 INR' : ''} and our
team will review your profile shortly.

What happens next?
- Our team will verify your submission
- You may be contacted if your profile matches upcoming opportunities

Please note: This is an automated confirmation email.
If you did not submit this request, you may ignore this message.

We wish you the very best on your journey into the movie industry.

Warm regards,
Team DHAARI
Official Talent Gateway`;

  await transport.sendMail({
    from,
    to: ADMIN_EMAIL,
    replyTo: d.email,
    subject: `New Submission Received | DHAARI - ${d.firstname} ${d.lastname} (${roleDisplay})`,
    text: adminText,
    html: adminHtml,
  });

  try {
    await transport.sendMail({
      from,
      to: d.email,
      subject: 'Submission Confirmation | DHAARI',
      text: userText,
    });
  } catch (err: any) {
    console.error('applicant email failed:', err?.message || err);
  }
}
