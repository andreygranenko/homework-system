"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

interface HomeworkAnalytics {
  id: string
  title: string
  status: string
  grade: string | null
  createdAt: string
  updatedAt: string
  student: {
    id: string
    name: string
    email: string
  }
  teacher: {
    id: string
    name: string
    email: string
  } | null
  subject: {
    id: string
    name: string
    description: string | null
  }
}

interface SubjectStats {
  subjectId: string
  subjectName: string
  teacherName: string
  totalHomeworks: number
  pendingHomeworks: number
  submittedHomeworks: number
  approvedHomeworks: number
  rejectedHomeworks: number
  averageGrade: number | null
}

interface UserPerformance {
  userId: string
  userName: string
  userEmail: string
  userRole: string
  totalHomeworks: number
  approvedHomeworks: number
  rejectedHomeworks: number
  averageGrade: number | null
  subjectsCount: number
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [homeworkAnalytics, setHomeworkAnalytics] = useState<HomeworkAnalytics[]>([])
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([])
  const [userPerformance, setUserPerformance] = useState<UserPerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchAnalyticsData()
    }
  }, [session, status])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      // Fetch homework analytics with JOIN data
      const homeworkResponse = await fetch("/api/analytics/homework")
      if (homeworkResponse.ok) {
        const homeworkData = await homeworkResponse.json()
        setHomeworkAnalytics(homeworkData)
      }

      // Fetch subject statistics with JOIN data
      const subjectResponse = await fetch("/api/analytics/subjects")
      if (subjectResponse.ok) {
        const subjectData = await subjectResponse.json()
        setSubjectStats(subjectData)
      }

      // Fetch user performance with JOIN data
      const userResponse = await fetch("/api/analytics/users")
      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUserPerformance(userData)
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: "secondary", icon: Clock },
      SUBMITTED: { color: "default", icon: FileText },
      UNDER_REVIEW: { color: "default", icon: AlertCircle },
      APPROVED: { color: "default", icon: CheckCircle },
      REJECTED: { color: "destructive", icon: XCircle },
      NEEDS_REVISION: { color: "secondary", icon: AlertCircle },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon
    
    return (
      <Badge variant={config.color as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (status === "loading" || isLoading) {
    return <div className="p-6">Loading analytics...</div>
  }

  if (!session) {
    return <div className="p-6">Please log in to view analytics.</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Homeworks</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{homeworkAnalytics.length}</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectStats.length}</div>
            <p className="text-xs text-muted-foreground">
              With homework submissions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userPerformance.length}</div>
            <p className="text-xs text-muted-foreground">
              Students and teachers
            </p>
          </CardContent>
        </Card>
        
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userPerformance.length > 0 
                ? Math.round(userPerformance.reduce((acc, user) => acc + (user.averageGrade || 0), 0) / userPerformance.length) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average grade across users
            </p>
          </CardContent>
        </Card> */}
      </div>

      {/* Subject Statistics Table - Shows JOIN between subjects, homeworks, and users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Performance Analysis
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aggregated data from subjects, homeworks, and users tables using JOIN operations
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Total Works</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Rejected</TableHead>
                <TableHead>Avg Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subjectStats.map((subject) => (
                <TableRow key={subject.subjectId}>
                  <TableCell className="font-medium">{subject.subjectName}</TableCell>
                  <TableCell>{subject.teacherName}</TableCell>
                  <TableCell>{subject.totalHomeworks}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{subject.pendingHomeworks}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{subject.approvedHomeworks}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{subject.rejectedHomeworks}</Badge>
                  </TableCell>
                  <TableCell>
                    {subject.averageGrade ? `${Math.round(subject.averageGrade)}%` : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Performance Table - Shows JOIN between users and homeworks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Performance Report
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            User statistics with homework data joined from multiple tables
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Works</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Rejected</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userPerformance.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell className="font-medium">{user.userName}</TableCell>
                  <TableCell>
                    <Badge variant={user.userRole === 'TEACHER' ? 'default' : 'secondary'}>
                      {user.userRole}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.userEmail}</TableCell>
                  <TableCell>{user.totalHomeworks}</TableCell>
                  <TableCell>
                    <Badge variant="default">{user.approvedHomeworks}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive">{user.rejectedHomeworks}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.totalHomeworks > 0 
                      ? `${Math.round((user.approvedHomeworks / user.totalHomeworks) * 100)}%`
                      : 'N/A'
                    }
                  </TableCell>
                  <TableCell>
                    {user.averageGrade ? `${Math.round(user.averageGrade)}%` : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detailed Homework Report - Shows JOIN between all tables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detailed Homework Report
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete homework data with student, teacher, and subject information from JOINed tables
          </p>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {homeworkAnalytics.map((homework) => (
                  <TableRow key={homework.id}>
                    <TableCell className="font-medium">{homework.title}</TableCell>
                    <TableCell>{homework.student.name}</TableCell>
                    <TableCell>{homework.subject.name}</TableCell>
                    <TableCell>{homework.teacher?.name || 'Unassigned'}</TableCell>
                    <TableCell>{getStatusBadge(homework.status)}</TableCell>
                    <TableCell>{homework.grade || 'N/A'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(homework.createdAt)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(homework.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

     
    </div>
  )
} 