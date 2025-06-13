"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const [userRole, setUserRole] = useState<"STUDENT" | "TEACHER">("STUDENT")

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role as "STUDENT" | "TEACHER")
    }
  }, [session])

  if (status === "loading") {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div className="flex items-center justify-center min-h-screen">Please log in to access the dashboard.</div>
  }

  return (
    <SidebarProvider>
      <AppSidebar userRole={userRole} />
      <main className="flex-1 overflow-auto">{children}</main>
    </SidebarProvider>
  )
}
