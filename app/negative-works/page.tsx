import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockData = [
  { id: 1, subject: "Chemistry", title: "Organic Chemistry Report", submittedDate: "2024-02-22", grade: "D" },
  { id: 2, subject: "History", title: "Ancient Civilizations Essay", submittedDate: "2024-02-19", grade: "C-" },
  { id: 3, subject: "Computer Science", title: "Algorithm Implementation", submittedDate: "2024-02-17", grade: "F" },
]

export default function NegativeWorksPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Negative Works</h1>
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

