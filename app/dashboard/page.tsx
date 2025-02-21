"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data
const studentData = {
  pendingSubmissions: 3,
  submittedWorks: 5,
  positiveWorks: 4,
  negativeWorks: 1,
}

const teacherData = {
  pendingReviews: 7,
  reviewedWorks: 15,
  positiveReviews: 12,
  negativeReviews: 3,
}

export default function DashboardPage() {
  const [isTeacher, setIsTeacher] = useState(false)
  const data = isTeacher ? teacherData : studentData

  useEffect(() => {
    // In a real application, you would check the user's role from your authentication system
    // For this demo, we'll just randomly set the role
    setIsTeacher(Math.random() < 0.5)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{isTeacher ? "Teacher" : "Student"} Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title={isTeacher ? "Pending Reviews" : "Pending Submissions"}
          value={isTeacher ? data.pendingReviews : data.pendingSubmissions}
          link={isTeacher ? "/pending-reviews" : "/pending-submissions"}
        />
        <DashboardCard
          title={isTeacher ? "Reviewed Works" : "Submitted Works"}
          value={isTeacher ? data.reviewedWorks : data.submittedWorks}
          link={isTeacher ? "/reviewed-works" : "/submitted-works"}
        />
        <DashboardCard
          title="Positive Works"
          value={isTeacher ? data.positiveReviews : data.positiveWorks}
          link="/positive-works"
        />
        <DashboardCard
          title="Negative Works"
          value={isTeacher ? data.negativeReviews : data.negativeWorks}
          link="/negative-works"
        />
      </div>
    </div>
  )
}

function DashboardCard({ title, value, link }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
        <Link href={link}>
          <Button className="mt-4">View Details</Button>
        </Link>
      </CardContent>
    </Card>
  )
}

