"use client"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

interface Homework {
  id: string
  title: string
  subject: {
    name: string
  }
  dueDate: string
}
// const mockData = [
//   { id: 1, subject: "Math", title: "Algebra Homework", dueDate: "2024-03-01" },
//   { id: 2, subject: "Science", title: "Chemistry Lab Report", dueDate: "2024-03-03" },
//   { id: 3, subject: "Literature", title: "Book Review", dueDate: "2024-03-05" },
// ]

export default function PendingSubmissionsPage() {
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
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Pending Submissions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments Due</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {homeworks.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.subject.name}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.dueDate}</TableCell>
                  <TableCell>
                    <Button>Submit</Button>
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
