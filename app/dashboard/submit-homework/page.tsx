"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

interface Subject {
  id: string
  name: string
  description?: string
}

export default function SubmitHomeworkPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubjectId, setSelectedSubjectId] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("/api/subjects")
        if (response.ok) {
          const data = await response.json()
          setSubjects(data)
        }
      } catch (error) {
        console.error("Error fetching subjects:", error)
      }
    }
    fetchSubjects()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) {
      toast({
        title: "Authentication Error",
        description: "Please log in to submit homework.",
        variant: "destructive",
      })
      return
    }

    const userId = session.user?.id
    if (!userId || !selectedSubjectId || !title || !content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/homework", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          title, 
          description,
          content, 
          studentId: userId, 
          subjectId: selectedSubjectId 
        }),
      })

      if (response.ok) {
        toast({
          title: "Homework Submitted",
          description: "Your homework has been successfully submitted for review.",
        })
        setSelectedSubjectId("")
        setTitle("")
        setDescription("")
        setContent("")
      } else {
        const errorData = await response.json()
        toast({
          title: "Submission Failed",
          description: errorData.error || "Failed to submit homework.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Please check your connection and try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Submit Homework</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>New Homework Submission</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select onValueChange={setSelectedSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter homework title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the homework"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                placeholder="Enter your homework content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="files">Attachments</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Drag and drop files here, or click to select files</p>
                <Input type="file" multiple className="hidden" />
              </div>
            </div> */}

            <Button type="submit" className="w-full">
              Submit Homework
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
