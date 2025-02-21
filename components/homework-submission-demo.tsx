"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

export function HomeworkSubmissionDemo() {
  const [subject, setSubject] = useState("")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (subject && title && content) {
      toast({
        title: "Homework Submitted",
        description: "Your homework has been successfully submitted for review.",
      })
      setSubject("")
      setTitle("")
      setContent("")
    } else {
      toast({
        title: "Submission Failed",
        description: "Please fill in all fields before submitting.",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Enter homework title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          placeholder="Enter your homework content here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full">
        Submit Homework
      </Button>
    </form>
  )
}

