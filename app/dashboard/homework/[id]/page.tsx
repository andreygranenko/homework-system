"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft, Download, FileText, Loader2, Calendar, User, BookOpen, Star } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Homework {
  id: string
  title: string
  description?: string
  content: string
  status: string
  grade?: string
  feedback?: string
  createdAt: Date
  dueDate?: Date
  student: {
    name: string
    email: string
  }
  subject: {
    name: string
    description?: string
    teacher: {
      name: string
    }
  }
  teacher?: {
    name: string
  }
  attachments: Array<{
    id: string
    filename: string
    originalName: string
    mimeType: string
    size: number
    url: string
  }>
}

export default function HomeworkDetailsPage({ params }: { params: { id: string } }) {
  const [homework, setHomework] = useState<Homework | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchHomework()
  }, [params.id])

  const fetchHomework = async () => {
    try {
      const response = await fetch(`/api/homework/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setHomework(data)
      } else {
        console.error("Failed to fetch homework")
      }
    } catch (error) {
      console.error("Error fetching homework:", error)
      // Fallback to mock data for demo
      const mockHomework: Homework = {
        id: params.id,
        title: "Algebra Homework",
        description: "Solving quadratic equations and graphing functions",
        content: `Problem 1: Solve the quadratic equation x² - 5x + 6 = 0

Solution:
Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a
Where a = 1, b = -5, c = 6

x = (5 ± √(25 - 24)) / 2
x = (5 ± 1) / 2

Therefore: x₁ = 3, x₂ = 2

Problem 2: Graph the function f(x) = x² - 4x + 3

The vertex form: f(x) = (x - 2)² - 1
Vertex: (2, -1)
y-intercept: (0, 3)
x-intercepts: (1, 0) and (3, 0)

Problem 3: Solve the system of equations:
2x + 3y = 7
x - y = 1

From the second equation: x = y + 1
Substituting into the first: 2(y + 1) + 3y = 7
2y + 2 + 3y = 7
5y = 5
y = 1, x = 2

Therefore: x = 2, y = 1`,
        status: "APPROVED",
        grade: "A",
        feedback: `Excellent work! Your solutions are correct and well-explained. I particularly appreciate:

1. Clear step-by-step approach to solving the quadratic equation
2. Proper use of the quadratic formula with all steps shown
3. Correct identification of vertex form and key points for graphing
4. Systematic approach to solving the system of equations

Areas for improvement:
- Consider adding a graph sketch for Problem 2 to visualize the parabola
- Double-check your arithmetic in future assignments

Keep up the great work! Your mathematical reasoning is strong.`,
        createdAt: new Date("2024-02-28"),
        dueDate: new Date("2024-03-01"),
        student: {
          name: "John Doe",
          email: "john.doe@example.com",
        },
        subject: {
          name: "Mathematics",
          description: "Advanced mathematics including algebra and calculus",
          teacher: {
            name: "Dr. Sarah Johnson",
          },
        },
        teacher: {
          name: "Dr. Sarah Johnson",
        },
        attachments: [
          {
            id: "1",
            filename: "algebra_homework.pdf",
            originalName: "algebra_homework.pdf",
            mimeType: "application/pdf",
            size: 1024000,
            url: "/placeholder.pdf",
          },
          {
            id: "2",
            filename: "graph_sketches.jpg",
            originalName: "graph_sketches.jpg",
            mimeType: "image/jpeg",
            size: 512000,
            url: "/placeholder.jpg",
          },
        ],
      }
      setHomework(mockHomework)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800"
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800"
      case "NEEDS_REVISION":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getGradeColor = (grade?: string) => {
    if (!grade) return "text-gray-500"
    const gradeValue = grade.charAt(0)
    switch (gradeValue) {
      case "A":
        return "text-green-600"
      case "B":
        return "text-blue-600"
      case "C":
        return "text-yellow-600"
      case "D":
        return "text-orange-600"
      case "F":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!homework) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Homework not found</h2>
          <p className="text-muted-foreground mb-4">The homework you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Submitted Works
        </Button>
        <h1 className="text-2xl font-bold">Homework Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Homework Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{homework.title}</CardTitle>
                  {homework.description && <p className="text-muted-foreground mt-1">{homework.description}</p>}
                </div>
                <Badge className={getStatusColor(homework.status)}>{homework.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Subject:</span>
                  <span className="font-medium">{homework.subject.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Teacher:</span>
                  <span className="font-medium">{homework.subject.teacher.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="font-medium">{new Date(homework.createdAt).toLocaleDateString()}</span>
                </div>
                {homework.dueDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Due Date:</span>
                    <span className="font-medium">{new Date(homework.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Homework Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Submission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">{homework.content}</pre>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          {homework.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Attachments ({homework.attachments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {homework.attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <div>
                          <span className="text-sm font-medium">{file.originalName}</span>
                          <p className="text-xs text-muted-foreground">
                            {file.mimeType} • {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Grade and Feedback */}
        <div className="space-y-6">
          {/* Grade Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Grade & Evaluation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {homework.grade ? (
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getGradeColor(homework.grade)}`}>{homework.grade}</div>
                  <p className="text-sm text-muted-foreground mt-1">Your Grade</p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl font-medium text-muted-foreground">-</div>
                  <p className="text-sm text-muted-foreground mt-1">Not graded yet</p>
                </div>
              )}

              <Separator />

              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge className={getStatusColor(homework.status)}>{homework.status.replace("_", " ")}</Badge>
                </div>
              </div>

              {homework.teacher && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Reviewed by</Label>
                    <p className="font-medium mt-1">{homework.teacher.name}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Feedback Card */}
          {homework.feedback && (
            <Card>
              <CardHeader>
                <CardTitle>Teacher Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">{homework.feedback}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {homework.status === "NEEDS_REVISION" && (
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Resubmit Homework
                </Button>
              )}
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Download Submission
              </Button>
              {homework.feedback && (
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Feedback
                </Button>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  )
}
