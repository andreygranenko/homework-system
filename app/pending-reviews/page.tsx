'use client'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect } from "react"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { Homework } from "@/lib/generated/prisma"

const mockData = [
  { id: 1, student: "John Doe", subject: "Math", title: "Algebra Homework", submittedDate: "2024-02-28" },
  { id: 2, student: "Jane Smith", subject: "Science", title: "Chemistry Lab Report", submittedDate: "2024-02-27" },
  { id: 3, student: "Mike Johnson", subject: "Literature", title: "Book Review", submittedDate: "2024-02-26" },
]

export default function PendingReviewsPage() {
  const { data: session } = useSession()
  const [homeworks, setHomeworks] = useState<Homework[]>([])
  useEffect(() => {
    const fetchHomeworks = async () => {
      const response = await fetch(`/api/homework?studentId=${session?.user?.id}`)
      const data = await response.json()
      setHomeworks(data)
    }
    fetchHomeworks()
  }, [session])
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Reviews</h1>
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
              <TableCell>{item.student.name}</TableCell>
              <TableCell>{item.subject.name}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.submittedDate}</TableCell>
              <TableCell>
                <Button>Review</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

