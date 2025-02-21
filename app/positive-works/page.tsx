import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockData = [
  { id: 1, subject: "Math", title: "Calculus Assignment", submittedDate: "2024-02-20", grade: "A" },
  { id: 2, subject: "Physics", title: "Mechanics Problem Set", submittedDate: "2024-02-18", grade: "A-" },
  { id: 3, subject: "Literature", title: "Shakespeare Essay", submittedDate: "2024-02-15", grade: "B+" },
]

export default function PositiveWorksPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Positive Works</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Subject</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Submitted Date</TableHead>
            <TableHead>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockData.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.subject}</TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.submittedDate}</TableCell>
              <TableCell>{item.grade}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

