import { Resend } from "resend";

type SendEmailParams = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const resendApiKey = process.env.RESEND_API_KEY;

const resend =
  resendApiKey != null ? new Resend(resendApiKey) : null;

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  if (!resend) {
    console.error("RESEND_API_KEY is not configured. Skipping email send.");
    return;
  }
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Uniserve <no-reply@example.com>",
      to,
      subject,
      ...(html ? { html } : { text: text || " " }),
    } as any);
  } catch (error) {
    console.error("Error sending email via Resend:", error);
  }
}
