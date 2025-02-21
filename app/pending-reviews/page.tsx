import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockData = [
  { id: 1, student: "John Doe", subject: "Math", title: "Algebra Homework", submittedDate: "2024-02-28" },
  { id: 2, student: "Jane Smith", subject: "Science", title: "Chemistry Lab Report", submittedDate: "2024-02-27" },
  { id: 3, student: "Mike Johnson", subject: "Literature", title: "Book Review", submittedDate: "2024-02-26" },
]

export default function PendingReviewsPage() {
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
          {mockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.student}</TableCell>
              <TableCell>{item.subject}</TableCell>
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

