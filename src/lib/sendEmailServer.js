import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_PASS;
  if (!user || !pass) return null;
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
  return transporter;
}

export function isEmailConfigured() {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_PASS);
}

/**
 * @param {{ to: string, subject: string, text: string, html?: string }} params
 */
export async function sendEmail({ to, subject, text, html }) {
  const transport = getTransporter();
  if (!transport) {
    console.warn(`Email skipped (set GMAIL_USER + GMAIL_PASS) → ${to} | ${subject}`);
    return { ok: false, skipped: true };
  }

  await transport.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    text,
    ...(html ? { html } : {}),
  });

  return { ok: true };
}
