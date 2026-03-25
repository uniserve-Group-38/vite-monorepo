

import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function submitSupportMessage(formData: FormData) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session?.user) {
            return { error: "You must be logged in to submit a support message." }
        }

        const subject = formData.get("subject") as string
        const message = formData.get("message") as string

        if (!subject || !message) {
            return { error: "Subject and message are required." }
        }

        if (subject.length < 5) {
            return { error: "Subject must be at least 5 characters long." }
        }

        if (message.length < 10) {
            return { error: "Message must be at least 10 characters long." }
        }

        await prisma.supportMessage.create({
            data: {
                userId: session.user.id,
                subject,
                message,
                status: "Open"
            }
        })

        return { success: true }
    } catch (error) {
        console.error("Error submitting support message:", error)
        return { error: "Failed to submit message. Please try again later." }
    }
}
