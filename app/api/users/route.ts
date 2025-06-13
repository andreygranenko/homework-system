import { type NextRequest, NextResponse } from "next/server"
import { type Role } from "@/lib/generated/prisma"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        subjects: true,
        _count: {
          select: {
            submittedHomeworks: true,
            reviewedHomeworks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role } = body

    if (!email || !name || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role as Role,
      },
      include: {
        subjects: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
