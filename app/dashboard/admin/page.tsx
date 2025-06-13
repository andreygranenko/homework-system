"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface User {
  id: string
  name: string
  email: string
  role: "STUDENT" | "TEACHER" | "ADMIN"
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // State for new user form
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "STUDENT", password: "" })

  useEffect(() => {
    // Protect route for admins only
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      router.push("/dashboard")
    }

    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      fetchUsers()
    }
  }, [session, status, router])
  
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast.error("Failed to fetch users.")
      }
    } catch (error) {
      toast.error("An error occurred while fetching users.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({ ...prev, role: value }))
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error("Please fill all fields.")
      return
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        toast.success("User added successfully!")
        setNewUser({ name: "", email: "", role: "STUDENT", password: "" })
        fetchUsers() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "Failed to add user.")
      }
    } catch (error) {
      toast.error("An error occurred while adding the user.")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (userId === session?.user?.id) {
      toast.error("You cannot delete your own account.")
      return
    }
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("User deleted successfully!")
        fetchUsers() // Refresh the list
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || "Failed to delete user.")
      }
    } catch (error) {
      toast.error("An error occurred while deleting the user.")
    }
  }

  if (status === "loading" || isLoading) {
    return <div className="p-6">Loading...</div>
  }
  
  if (session?.user?.role !== "ADMIN") {
    return <div className="p-6">Access Denied.</div>
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger />
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                name="name"
                placeholder="Name"
                value={newUser.name}
                onChange={handleInputChange}
              />
              <Input
                name="email"
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={handleInputChange}
              />
              <Select onValueChange={handleRoleChange} value={newUser.role}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">Student</SelectItem>
                  <SelectItem value="TEACHER">Teacher</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">Add User</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={user.id === session?.user?.id}
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user
                              and all their associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 