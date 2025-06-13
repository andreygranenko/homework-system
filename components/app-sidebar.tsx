"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  Home,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Users,
  BarChart3,
  Settings,
  LogOut,
  BookOpen,
  PenTool,
} from "lucide-react"

interface AppSidebarProps {
  userRole: "STUDENT" | "TEACHER" | "ADMIN"
}

const studentMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  // {
  //   title: "Pending Submissions",
  //   url: "/dashboard/pending-submissions",
  //   icon: Clock,
  // },
  {
    title: "Submitted Works",
    url: "/dashboard/submitted-works",
    icon: FileText,
  },
  // {
  //   title: "Analytics",
  //   url: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Positive Works",
  //   url: "/dashboard/positive-works",
  //   icon: CheckCircle,
  // },
  // {
  //   title: "Negative Works",
  //   url: "/dashboard/negative-works",
  //   icon: XCircle,
  // },
  {
    title: "Submit Homework",
    url: "/dashboard/submit-homework",
    icon: PenTool,
  },
]

const teacherMenuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Pending Reviews",
    url: "/dashboard/pending-reviews",
    icon: Clock,
  },
  {
    title: "Reviewed Works",
    url: "/dashboard/reviewed-works",
    icon: FileText,
  },
  // {
  //   title: "Analytics",
  //   url: "/dashboard/analytics",
  //   icon: BarChart3,
  // },
  // {
  //   title: "Students",
  //   url: "/dashboard/students",
  //   icon: Users,
  // },
  // {
  //   title: "Subjects",
  //   url: "/dashboard/subjects",
  //   icon: BookOpen,
  // },
]

const adminMenuItems = [
  {
    title: "Admin Panel",
    url: "/dashboard/admin",
    icon: Settings,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart3,
  },
]

export function AppSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname()
  const menuItems = userRole === "STUDENT" ? studentMenuItems : userRole === "TEACHER" ? teacherMenuItems : adminMenuItems

  const handleLogout = async () => {
    try {
      await signOut({ 
        callbackUrl: "/login",
        redirect: true 
      })
    } catch (error) {
      console.error("Error during logout:", error)
      await signOut({ 
        callbackUrl: "/login",
        redirect: true 
      })
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <BookOpen className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="font-semibold">Homework System</span>
            <span className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton> */}
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
