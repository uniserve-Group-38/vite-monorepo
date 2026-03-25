import { Resend } from "resend"

type SendEmailParams = {
  to: string
  subject: string
  text?: string
  html?: string
}

const resendApiKey = process.env.RESEND_API_KEY

const resend =
  resendApiKey != null
    ? new Resend(resendApiKey)
    : null

export async function sendEmail({ to, subject, text, html }: SendEmailParams) {
  if (!resend) {
    console.error("RESEND_API_KEY is not configured. Skipping email send.")
    return
  }

  try {
    // Resend's type definitions require at least one body field (html, text, react or template)
    // By conditionally adding html/text, we avoid passing undefined fields. We cast to any to bypass the strict union typing.
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Uniserve <no-reply@example.com>",
      to,
      subject,
      ...(html ? { html } : { text: text || " " }), // provide fallback to prevent API error
    } as any)
  } catch (error) {
    console.error("Error sending email via Resend:", error)
  }
}

