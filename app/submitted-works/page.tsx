import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const mockData = [
  { id: 1, subject: "Math", title: "Calculus Assignment", submittedDate: "2024-02-25", status: "Pending" },
  { id: 2, subject: "Physics", title: "Mechanics Problem Set", submittedDate: "2024-02-23", status: "Approved" },
  { id: 3, subject: "History", title: "Essay on World War II", submittedDate: "2024-02-20", status: "Rejected" },
]

export default function SubmittedWorksPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Submitted Works</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.submittedDate}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    item.status === "Approved" ? "success" : item.status === "Rejected" ? "destructive" : "default"
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

