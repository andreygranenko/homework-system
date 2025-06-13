"use client"

import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useSession } from "next-auth/react"

interface Homework {
  id: string
  title: string
  student: {
    name: string
    email: string
  }
  subject: {
    name: string
  }
  status: string
  grade?: string
  feedback?: string
  createdAt: string
  updatedAt: string
}

type SortField = "subject" | "title" | "student" | "createdAt" | "updatedAt" | "status"
type SortOrder = "asc" | "desc"

export default function ReviewedWorksPage() {
  const [homeworks, setHomeworks] = useState<Homework[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<SortField>("updatedAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "loading") return
    if (!session) return
    fetchReviewedWorks()
  }, [session, status])

  const fetchReviewedWorks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const teacherId = session?.user?.id
      if (!teacherId) {
        setError("User ID not found")
        return
      }

      const response = await fetch(`/api/homework?teacherId=${teacherId}&status=APPROVED,REJECTED`)
      if (response.ok) {
        const data = await response.json()
        setHomeworks(data.filter((hw: any) => 
          hw.status === "APPROVED" || 
          hw.status === "REJECTED" || 
          hw.grade || 
          hw.feedback
        ))
      } else {
        setError("Failed to fetch reviewed works")
      }
    } catch (error) {
      console.error("Error fetching reviewed works:", error)
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Filtered and sorted homeworks
  const filteredAndSortedHomeworks = useMemo(() => {
    let filtered = homeworks

    // Filter by search term (subject name or student name)
    if (searchTerm) {
      filtered = filtered.filter((homework) =>
        homework.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        homework.student.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort the results
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case "subject":
          aValue = a.subject.name.toLowerCase()
          bValue = b.subject.name.toLowerCase()
          break
        case "title":
          aValue = a.title.toLowerCase()
          bValue = b.title.toLowerCase()
          break
        case "student":
          aValue = a.student.name.toLowerCase()
          bValue = b.student.name.toLowerCase()
          break
        case "createdAt":
          aValue = new Date(a.createdAt).getTime()
          bValue = new Date(b.createdAt).getTime()
          break
        case "updatedAt":
          aValue = new Date(a.updatedAt).getTime()
          bValue = new Date(b.updatedAt).getTime()
          break
        case "status":
          aValue = a.status.toLowerCase()
          bValue = b.status.toLowerCase()
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return sorted
  }, [homeworks, searchTerm, sortField, sortOrder])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      // Set new field with default descending order
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
    }
    return sortOrder === "asc" ? 
      <ArrowUp className="h-4 w-4 text-blue-600" /> : 
      <ArrowDown className="h-4 w-4 text-blue-600" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      case "SUBMITTED":
        return "bg-blue-100 text-blue-800"
      case "UNDER_REVIEW":
        return "bg-yellow-100 text-yellow-800"
      case "NEEDS_REVISION":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSortField("updatedAt")
    setSortOrder("desc")
  }

  if (status === "loading" || loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold">Reviewed Works</h1>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="p-6">
        <div className="text-center py-8">Please log in to view reviewed works.</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Reviewed Works</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reviewed Student Homeworks ({filteredAndSortedHomeworks.length})</CardTitle>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by subject or student name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={sortField} onValueChange={(value) => setSortField(value as SortField)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Review Date</SelectItem>
                  <SelectItem value="subject">Subject</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Descending</SelectItem>
                  <SelectItem value="asc">Ascending</SelectItem>
                </SelectContent>
              </Select>

              {(searchTerm || sortField !== "updatedAt" || sortOrder !== "desc") && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground border rounded-md hover:bg-muted"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-red-600">
              Error: {error}
              <button 
                onClick={fetchReviewedWorks}
                className="block mx-auto mt-2 text-blue-600 hover:underline"
              >
                Try again
              </button>
            </div>
          ) : filteredAndSortedHomeworks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {homeworks.length === 0 ? (
                <>
                  No reviewed works found. 
                  <br />
                  <span className="text-sm">Review your first student homework to see it here!</span>
                </>
              ) : (
                <>
                  No results found for "{searchTerm}".
                  <br />
                  <span className="text-sm">Try adjusting your search or filters.</span>
                </>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <button
                      onClick={() => handleSort("student")}
                      className="flex items-center gap-2 hover:text-foreground"
                    >
                      Student
                      {getSortIcon("student")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("subject")}
                      className="flex items-center gap-2 hover:text-foreground"
                    >
                      Subject
                      {getSortIcon("subject")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-2 hover:text-foreground"
                    >
                      Title
                      {getSortIcon("title")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("createdAt")}
                      className="flex items-center gap-2 hover:text-foreground"
                    >
                      Submitted Date
                      {getSortIcon("createdAt")}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("status")}
                      className="flex items-center gap-2 hover:text-foreground"
                    >
                      Status
                      {getSortIcon("status")}
                    </button>
                  </TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedHomeworks.map((homework) => (
                  <TableRow key={homework.id}>
                    <TableCell className="font-medium">{homework.student.name}</TableCell>
                    <TableCell>{homework.subject.name}</TableCell>
                    <TableCell>{homework.title}</TableCell>
                    <TableCell>{new Date(homework.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(homework.status)}>
                        {homework.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{homework.grade || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
