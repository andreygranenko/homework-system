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

    // Complex query with JOINs to get user performance data
    // This demonstrates: users LEFT JOIN homeworks (as students) with aggregation
    const userPerformance = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // LEFT JOIN with homeworks as student
        submittedHomeworks: {
          select: {
            id: true,
            status: true,
            grade: true,
            subject: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        // For teachers: JOIN with subjects they teach
        subjects: {
          select: {
            id: true,
            name: true,
            // COUNT homeworks in each subject
            homeworks: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Process the data to calculate performance metrics
    const processedPerformance = userPerformance.map(user => {
      const homeworks = user.submittedHomeworks
      const totalHomeworks = homeworks.length
      const approvedHomeworks = homeworks.filter(h => h.status === 'APPROVED').length
      const rejectedHomeworks = homeworks.filter(h => h.status === 'REJECTED').length
      const pendingHomeworks = homeworks.filter(h => h.status === 'PENDING').length
      const underReviewHomeworks = homeworks.filter(h => h.status === 'UNDER_REVIEW').length

      // Calculate average grade for students
      const homeworksWithGrades = homeworks.filter(h => h.grade !== null && h.grade !== undefined)
      const averageGrade = homeworksWithGrades.length > 0
        ? homeworksWithGrades.reduce((sum, h) => sum + (parseFloat(h.grade!) || 0), 0) / homeworksWithGrades.length
        : null

      // Count unique subjects for students
      const uniqueSubjects = new Set(homeworks.map(h => h.subject.id))
      const subjectsCount = uniqueSubjects.size

      // For teachers, count subjects they teach
      const teachingSubjectsCount = user.subjects.length
      const totalHomeworksInSubjects = user.subjects.reduce((sum, subject) => sum + subject.homeworks.length, 0)

      return {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        userRole: user.role,
        totalHomeworks: user.role === 'STUDENT' ? totalHomeworks : totalHomeworksInSubjects,
        approvedHomeworks,
        rejectedHomeworks,
        pendingHomeworks,
        underReviewHomeworks,
        averageGrade,
        subjectsCount: user.role === 'STUDENT' ? subjectsCount : teachingSubjectsCount,
        // Additional metrics for display
        successRate: totalHomeworks > 0 ? (approvedHomeworks / totalHomeworks) * 100 : 0,
        memberSince: user.createdAt,
      }
    })

    // Alternative: Raw SQL query for complex user statistics (commented for reference)
    /*
    const rawUserStats = await prisma.$queryRaw`
      SELECT 
        u.id as "userId",
        u.name as "userName",
        u.email as "userEmail",
        u.role as "userRole",
        COUNT(h.id) as "totalHomeworks",
        COUNT(CASE WHEN h.status = 'APPROVED' THEN 1 END) as "approvedHomeworks",
        COUNT(CASE WHEN h.status = 'REJECTED' THEN 1 END) as "rejectedHomeworks",
        AVG(CASE WHEN h.grade ~ '^[0-9]+$' THEN h.grade::INTEGER ELSE NULL END) as "averageGrade",
        COUNT(DISTINCT h."subjectId") as "subjectsCount"
      FROM users u
      LEFT JOIN homeworks h ON u.id = h."studentId"
      WHERE u.role = 'STUDENT'
      GROUP BY u.id, u.name, u.email, u.role
      
      UNION ALL
      
      SELECT 
        u.id as "userId",
        u.name as "userName",
        u.email as "userEmail",
        u.role as "userRole",
        COUNT(h.id) as "totalHomeworks",
        0 as "approvedHomeworks",
        0 as "rejectedHomeworks",
        NULL as "averageGrade",
        COUNT(DISTINCT s.id) as "subjectsCount"
      FROM users u
      LEFT JOIN subjects s ON u.id = s."teacherId"
      LEFT JOIN homeworks h ON s.id = h."subjectId"
      WHERE u.role = 'TEACHER'
      GROUP BY u.id, u.name, u.email, u.role
      
      ORDER BY "userName"
    `
    */

    return NextResponse.json(processedPerformance)
  } catch (error) {
    console.error("Error fetching user performance:", error)
    return NextResponse.json({ error: "Failed to fetch user performance" }, { status: 500 })
  }
} 