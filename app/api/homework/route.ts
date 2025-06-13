import { type NextRequest, NextResponse } from "next/server"
import type { HomeworkStatus } from "@/lib/generated/prisma"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const teacherId = searchParams.get("teacherId")
    const status = searchParams.get("status")
    const subjectId = searchParams.get("subjectId")
    const limit = searchParams.get("limit")

    const where: any = {}

    if (studentId) {
      where.studentId = studentId
    }

    if (teacherId) {
      where.subject = {
        teacherId,
      }
    }

    if (status) {
      const statusList = status.split(',').map(s => s.trim())
      if (statusList.length > 1) {
        where.status = {
          in: statusList as HomeworkStatus[]
        }
      } else {
        where.status = status as HomeworkStatus
      }
    }

    if (subjectId) {
      where.subjectId = subjectId
    }

    const homeworks = await prisma.homework.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subject: {
          include: {
            teacher: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(limit && { take: parseInt(limit) }),
    })

    return NextResponse.json(homeworks)
  } catch (error) {
    console.error("Error fetching homework:", error)
    return NextResponse.json({ error: "Failed to fetch homework" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, content, dueDate, studentId, subjectId } = body
    console.log(body)

    if (!title || !content || !studentId || !subjectId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const homework = await prisma.homework.create({
      data: {
        title,
        description,
        content,
        dueDate: dueDate ? new Date(dueDate) : null,
        studentId,
        subjectId,
        status: "SUBMITTED",
      },
      include: {
        student: true,
        subject: {
          include: {
            teacher: true,
          },
        },
        attachments: true,
      },
    })

    return NextResponse.json(homework, { status: 201 })
  } catch (error) {
    console.error("Error creating homework:", error)
    return NextResponse.json({ error: "Failed to create homework" }, { status: 500 })
  }
}
