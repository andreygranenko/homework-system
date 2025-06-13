import { type NextRequest, NextResponse } from "next/server"
import type { Role } from "@/lib/generated/prisma"
import { prisma } from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!session || !session.user || session.user.id !== params.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const role = session.user.role;
    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    if (role === "STUDENT") {
      const [pending, submitted, approved, rejected] = await Promise.all([
        prisma.homework.count({
          where: { studentId: userId, status: "PENDING" },
        }),
        prisma.homework.count({
          where: { studentId: userId, status: "SUBMITTED" },
        }),
        prisma.homework.count({
          where: { studentId: userId, status: "APPROVED" },
        }),
        prisma.homework.count({
          where: { studentId: userId, status: "REJECTED" },
        }),
      ])

      return NextResponse.json({
        pendingSubmissions: pending,
        submittedWorks: submitted,
        positiveWorks: approved,
        negativeWorks: rejected,
      })
    } else if (role === "TEACHER") {
      const [pendingReviews, reviewed, approved, rejected] = await Promise.all([
        prisma.homework.count({
          where: {
            subject: { teacherId: userId },
            status: { in: ["SUBMITTED", "UNDER_REVIEW"] },
          },
        }),
        prisma.homework.count({
          where: {
            subject: { teacherId: userId },
            status: { in: ["APPROVED", "REJECTED", "NEEDS_REVISION"] },
          },
        }),
        prisma.homework.count({
          where: {
            subject: { teacherId: userId },
            status: "APPROVED",
          },
        }),
        prisma.homework.count({
          where: {
            subject: { teacherId: userId },
            status: "REJECTED",
          },
        }),
      ])

      return NextResponse.json({
        pendingReviews,
        reviewedWorks: reviewed,
        positiveReviews: approved,
        negativeReviews: rejected,
      })
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
