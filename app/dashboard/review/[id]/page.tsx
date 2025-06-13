"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"
import { Homework } from "@/lib/generated/prisma"

export default function ReviewPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const [grade, setGrade] = useState("")
  const [feedback, setFeedback] = useState("")
  const [status, setStatus] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const [homework, setHomework] = useState<Homework | null>(null)
  useEffect(() => {
    const fetchHomework = async () => {
      const response = await fetch(`/api/homework/${params.id}`)
      const data = await response.json()
      setHomework(data)
    }
    fetchHomework()
  }, [params.id])
  const handleSubmitReview = () => {
    if (!grade || !status) {
      toast({
        title: "Error",
        description: "Please select a grade and status",
        variant: "destructive",
      })
      return
    }

    const submitReview = async () => {
      const response = await fetch(`/api/homework/${params.id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ grade, status, feedback, teacherId: session?.user?.id }),
      })  
    }
    submitReview()
    toast({
      title: "Review Submitted",
      description: `Homework has been ${status.toLowerCase()} with grade ${grade}`,
    })

    setTimeout(() => {
      router.push("/dashboard/pending-reviews")
    }, 1500)
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Review Homework</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Homework Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Homework Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Student</Label>
                  <p className="font-medium">{homework?.student.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Subject</Label>
                  <p className="font-medium">{homework?.subject.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="font-medium">{homework?.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Submitted</Label>
                  <p className="font-medium">{homework?.submittedDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="mt-1">{homework?.description}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Homework Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm">{homework?.content}</pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {homework?.attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">{file}</span>
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
        </div>

        {/* Review Form */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="grade">Grade</Label>
                <Select onValueChange={setGrade}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A (90-100)</SelectItem>
                    <SelectItem value="B">B (80-89)</SelectItem>
                    <SelectItem value="C">C (70-79)</SelectItem>
                    <SelectItem value="D">D (60-69)</SelectItem>
                    <SelectItem value="F">F (0-59)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Provide detailed feedback for the student..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={6}
                />
              </div>

              <Button onClick={handleSubmitReview} className="w-full">
                Submit Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
