import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { subject, content } = await request.json()

    // Fetch all subscribers
    const subscribers = await prisma.newsletterSubscriber.findMany()

    // Here you would typically use an email service to send the newsletter
    // For example, using a service like Mailchimp or SendGrid
    // This is a placeholder for the actual email sending logic
    for (const subscriber of subscribers) {
      console.log(`Sending email to ${subscriber.email}:`, { subject, content })
      // await emailService.send({ to: subscriber.email, subject, content })
    }

    return NextResponse.json({ success: true, message: "Newsletter sent successfully" })
  } catch (error) {
    console.error("Error sending newsletter:", error)
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 })
  }
}

