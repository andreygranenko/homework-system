'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Homework } from "@/lib/generated/prisma"

const mockData = [
  {
    id: 1,
    student: "John Doe",
    subject: "Math",
    title: "Algebra Homework",
    submittedDate: "2024-02-28",
    description: "Solving quadratic equations and graphing functions",
  },
  {
    id: 2,
    student: "Jane Smith",
    subject: "Science",
    title: "Chemistry Lab Report",
    submittedDate: "2024-02-27",
    description: "Analysis of chemical reactions and molecular structures",
  },
  {
    id: 3,
    student: "Mike Johnson",
    subject: "Literature",
    title: "Book Review",
    submittedDate: "2024-02-26",
    description: "Critical analysis of 'To Kill a Mockingbird'",
  },
]

export default function PendingReviewsPage() {
  const { data: session } = useSession()
  const [homeworks, setHomeworks] = useState<Homework[]>([])
  useEffect(() => {
    const fetchHomeworks = async () => {
      const response = await fetch(`/api/homework?status=SUBMITTED`)

      const data = await response.json()
      console.log(data)
      setHomeworks(data)
    }
    fetchHomeworks()
  }, [session])
  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Pending Reviews</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Works Awaiting Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Submitted Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeworks.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.student.name}</TableCell>
                  <TableCell>{item.subject.name}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.submittedDate}</TableCell>
                  <TableCell>
                    <Button asChild>
                      <Link href={`/dashboard/review/${item.id}`}>Review</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
