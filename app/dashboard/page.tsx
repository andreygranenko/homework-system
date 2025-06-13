"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Clock, FileText, CheckCircle, XCircle, Users, BarChart3 } from "lucide-react"
import { useSession } from "next-auth/react"

interface StatsData {
  // Student stats
  pendingSubmissions?: number
  submittedWorks?: number
  positiveWorks?: number
  negativeWorks?: number
  // Teacher stats
  pendingReviews?: number
  reviewedWorks?: number
  positiveReviews?: number
  negativeReviews?: number
}

interface RecentActivity {
  id: string
  title: string
  status: string
  studentName?: string
  createdAt: string
}

export default function DashboardPage() {
  const [userRole, setUserRole] = useState<"STUDENT" | "TEACHER">("STUDENT")
  const { data: session, status } = useSession()
  const [statsData, setStatsData] = useState<StatsData>({})
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) return

    async function fetchData() {
      try {
        const userId = session?.user?.id
        const role = session?.user?.role as "STUDENT" | "TEACHER"
        setUserRole(role)

        // Fetch stats
        const statsResponse = await fetch(`/api/stats/${userId}`)
        if (statsResponse.ok) {
          const stats = await statsResponse.json()
          setStatsData(stats)
        }

        // Fetch recent homework for activity
        const homeworkResponse = await fetch(`/api/homework?${role === "STUDENT" ? `studentId=${userId}` : `teacherId=${userId}`}&limit=3`)
        if (homeworkResponse.ok) {
          const homework = await homeworkResponse.json()
          setRecentActivity(homework)
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [session, status])

  if (status === "loading" || loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!session) {
    return <div className="p-6">Please log in to access the dashboard.</div>
  }

  const studentStats = [
    { 
      title: "Pending Submissions", 
      value: statsData.pendingSubmissions || 0, 
      icon: Clock, 
      color: "text-orange-600" 
    },
    { 
      title: "Submitted Works", 
      value: statsData.submittedWorks || 0, 
      icon: FileText, 
      color: "text-blue-600" 
    },
    { 
      title: "Positive Works", 
      value: statsData.positiveWorks || 0, 
      icon: CheckCircle, 
      color: "text-green-600" 
    },
    { 
      title: "Negative Works", 
      value: statsData.negativeWorks || 0, 
      icon: XCircle, 
      color: "text-red-600" 
    },
  ]

  const teacherStats = [
    { 
      title: "Pending Reviews", 
      value: statsData.pendingReviews || 0, 
      icon: Clock, 
      color: "text-orange-600" 
    },
    { 
      title: "Reviewed Works", 
      value: statsData.reviewedWorks || 0, 
      icon: FileText, 
      color: "text-blue-600" 
    },
    { 
      title: "Positive Reviews", 
      value: statsData.positiveReviews || 0, 
      icon: CheckCircle, 
      color: "text-green-600" 
    },
    { 
      title: "Negative Reviews", 
      value: statsData.negativeReviews || 0, 
      icon: XCircle, 
      color: "text-red-600" 
    },
  ]

  const stats = userRole === "STUDENT" ? studentStats : teacherStats

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return CheckCircle
      case "REJECTED":
        return XCircle
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return Clock
      default:
        return FileText
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600"
      case "REJECTED":
        return "text-red-600"
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return "text-orange-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">
          {userRole === "STUDENT" ? "Student" : "Teacher"} Dashboard
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recentActivity.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">
            {userRole === "STUDENT" ? "Recent Activity" : "Recent Reviews"}
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const StatusIcon = getStatusIcon(activity.status)
                  const statusColor = getStatusColor(activity.status)
                  
                  return (
                    <div key={activity.id} className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 ${statusColor}`} />
                      <span className="text-sm">
                        {userRole === "TEACHER" && activity.studentName
                          ? `${activity.studentName}: ${activity.title}`
                          : activity.title}
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
