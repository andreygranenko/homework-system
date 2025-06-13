import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@/lib/generated/prisma"
import type { HomeworkStatus } from "@/lib/generated/prisma"

const prisma = new PrismaClient()

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, grade, feedback, teacherId } = body

    if (!status || !teacherId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const homework = await prisma.homework.update({
      where: { id: params.id },
      data: {
        status: status as HomeworkStatus,
        grade,
        feedback,
        teacherId,
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
    console.error("Error reviewing homework:", error)
    return NextResponse.json({ error: "Failed to review homework" }, { status: 500 })
  }
}
