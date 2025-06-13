import { type NextRequest, NextResponse } from "next/server"
import { type Role } from "@/lib/generated/prisma"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            homeworks: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error("Error fetching subjects:", error)
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, teacherId } = body

    if (!name || !teacherId) {
      return NextResponse.json({ error: "Name and teacher ID are required" }, { status: 400 })
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        description,
        teacherId,
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error("Error creating subject:", error)
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
