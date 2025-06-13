import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Complex JOIN query: homeworks with student, teacher, and subject data
    const homeworkAnalytics = await prisma.homework.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        grade: true,
        createdAt: true,
        updatedAt: true,
        // JOIN with student (users table)
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // LEFT JOIN with teacher (users table) - some homeworks might not have assigned teachers
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // JOIN with subject
        subject: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(homeworkAnalytics)
  } catch (error) {
    console.error("Error fetching homework analytics:", error)
    return NextResponse.json({ error: "Failed to fetch homework analytics" }, { status: 500 })
  }
} 