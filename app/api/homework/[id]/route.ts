import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const homework = await prisma.homework.findUnique({
      where: { id: params.id },
      include: {
        student: true,
        teacher: true,
        subject: {
          include: {
            teacher: true,
          },
        },
        attachments: true,
      },
    })

    if (!homework) {
      return NextResponse.json({ error: "Homework not found" }, { status: 404 })
    }

    return NextResponse.json(homework)
  } catch (error) {
    console.error("Error fetching homework:", error)
    return NextResponse.json({ error: "Failed to fetch homework" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, description, content, status, grade, feedback, teacherId } = body

    const homework = await prisma.homework.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(content && { content }),
        ...(status && { status }),
        ...(grade && { grade }),
        ...(feedback && { feedback }),
        ...(teacherId && { teacherId }),
      },
      include: {
        student: true,
        teacher: true,
        subject: true,
        attachments: true,
      },
    })

    return NextResponse.json(homework)
  } catch (error) {
    console.error("Error updating homework:", error)
    return NextResponse.json({ error: "Failed to update homework" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.homework.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Homework deleted successfully" })
  } catch (error) {
    console.error("Error deleting homework:", error)
    return NextResponse.json({ error: "Failed to delete homework" }, { status: 500 })
  }
}
