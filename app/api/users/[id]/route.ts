import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        subjects: true,
        submittedHomeworks: {
          include: {
            subject: true,
            attachments: true,
          },
        },
        reviewedHomeworks: {
          include: {
            student: true,
            subject: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { email, name, role } = body

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
      },
      include: {
        subjects: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = params.id

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  // Prevent admin from deleting themselves
  if (userId === session.user.id) {
    return NextResponse.json({ error: "Cannot delete your own account" }, { status: 403 })
  }

  try {

    await prisma.user.delete({
      where: { id: userId },
    })

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    // Check for specific Prisma errors, e.g., record not found
    if (error instanceof Error && (error as any).code === 'P2025') {
       return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
