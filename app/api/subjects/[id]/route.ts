import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subject = await prisma.subject.findUnique({
      where: { id: params.id },
      include: {
        teacher: true,
        homeworks: {
          include: {
            student: true,
            attachments: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error fetching subject:", error)
    return NextResponse.json({ error: "Failed to fetch subject" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, description } = body

    const subject = await prisma.subject.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
      },
      include: {
        teacher: true,
      },
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error("Error updating subject:", error)
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.subject.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch (error) {
    console.error("Error deleting subject:", error)
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 })
  }
}
