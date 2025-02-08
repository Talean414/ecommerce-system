import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    })

    // Here you would typically add the email to your newsletter service
    // For example, using a service like Mailchimp or SendGrid

    return NextResponse.json({ success: true, subscriber })
  } catch (error) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}

