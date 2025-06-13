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

    // Complex aggregation query with JOINs and GROUP BY
    // This demonstrates: subjects JOIN users (teachers) JOIN homeworks with aggregation
    const subjectStats = await prisma.subject.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        // JOIN with teacher (users table)
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        // JOIN with homeworks and aggregate statistics
        homeworks: {
          select: {
            id: true,
            status: true,
            grade: true,
          },
        },
      },
    })

    // Process the data to calculate statistics (simulating GROUP BY with aggregation)
    const processedStats = subjectStats.map(subject => {
      const homeworks = subject.homeworks
      const totalHomeworks = homeworks.length
      const pendingHomeworks = homeworks.filter(h => h.status === 'PENDING').length
      const submittedHomeworks = homeworks.filter(h => h.status === 'SUBMITTED').length
      const approvedHomeworks = homeworks.filter(h => h.status === 'APPROVED').length
      const rejectedHomeworks = homeworks.filter(h => h.status === 'REJECTED').length
      
      // Calculate average grade (only for homeworks with grades)
      const homeworksWithGrades = homeworks.filter(h => h.grade !== null && h.grade !== undefined)
      const averageGrade = homeworksWithGrades.length > 0
        ? homeworksWithGrades.reduce((sum, h) => sum + (parseFloat(h.grade!) || 0), 0) / homeworksWithGrades.length
        : null

      return {
        subjectId: subject.id,
        subjectName: subject.name,
        subjectDescription: subject.description,
        teacherId: subject.teacher.id,
        teacherName: subject.teacher.name,
        teacherEmail: subject.teacher.email,
        totalHomeworks,
        pendingHomeworks,
        submittedHomeworks,
        approvedHomeworks,
        rejectedHomeworks,
        averageGrade,
      }
    })

    // Alternative: Raw SQL query for complex aggregation (commented for reference)
    /*
    const rawStats = await prisma.$queryRaw`
      SELECT 
        s.id as "subjectId",
        s.name as "subjectName",
        u.name as "teacherName",
        COUNT(h.id) as "totalHomeworks",
        COUNT(CASE WHEN h.status = 'PENDING' THEN 1 END) as "pendingHomeworks",
        COUNT(CASE WHEN h.status = 'APPROVED' THEN 1 END) as "approvedHomeworks",
        COUNT(CASE WHEN h.status = 'REJECTED' THEN 1 END) as "rejectedHomeworks",
        AVG(CASE WHEN h.grade ~ '^[0-9]+$' THEN h.grade::INTEGER ELSE NULL END) as "averageGrade"
      FROM subjects s
      INNER JOIN users u ON s."teacherId" = u.id
      LEFT JOIN homeworks h ON s.id = h."subjectId"
      GROUP BY s.id, s.name, u.name
      ORDER BY s.name
    `
    */

    return NextResponse.json(processedStats)
  } catch (error) {
    console.error("Error fetching subject statistics:", error)
    return NextResponse.json({ error: "Failed to fetch subject statistics" }, { status: 500 })
  }
} 