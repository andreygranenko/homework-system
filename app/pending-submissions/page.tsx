import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockData = [
  { id: 1, subject: "Math", title: "Algebra Homework", dueDate: "2024-03-01" },
  { id: 2, subject: "Science", title: "Chemistry Lab Report", dueDate: "2024-03-03" },
  { id: 3, subject: "Literature", title: "Book Review", dueDate: "2024-03-05" },
]

export default function PendingSubmissionsPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Pending Submissions</h1>
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
          {mockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.dueDate}</TableCell>
              <TableCell>
                <Button>Submit</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

