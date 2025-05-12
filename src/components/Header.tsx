"use client"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Search, Globe, Menu, User, Building, LogOut, GraduationCap, FileText, Award, Bell } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const Header = () => {
  const { user, logout, isAuthenticated, isStudent, isInstitution,isAdmin, isProfessor,isAdmissionOfficer } = useAuth()
  const navigate = useNavigate()

  // Mock unread notifications count
  const unreadNotifications = 3

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-studyportal-blue">CareerCompass</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link to="/" className="text-gray-700 hover:text-studyportal-blue font-medium">
                Home
              </Link>
              <Link to="/gigs" className="text-gray-700 hover:text-studyportal-blue font-medium">
                Programs
              </Link>

              {isStudent && (
                <>
                  <Link to="/student/dashboard" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Dashboard
                  </Link>
                  <Link to="/student/applications" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    My Applications
                  </Link>
                  <Link to="/student/professors" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Professors
                  </Link>
                  <Link to="/student/SavedPrograms" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Saved Program
                  </Link>
                  <Link to="/student/scholarship" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Scholarship
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Dashboard
                  </Link>
                  <Link to="/admin/approvals" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Applications
                  </Link>
                
                </>
              )}

              {isProfessor && (
                <>
                  <Link to="/professor/dashboard" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Dashboard
                  </Link>
                  <Link to="/professor/approvals" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Applications
                  </Link>
                
                </>
              )}

              {isAdmissionOfficer && (
                <>
                  <Link to="/admission/dashboard" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Dashboard
                  </Link>
                  <Link to="/admission/approvals" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Applications
                  </Link>
                
                </>
              )}

              {isInstitution && (
                <>
                  <Link to="/institution/dashboard" className="text-gray-700 hover:text-studyportal-blue font-medium">
                    Dashboard
                  </Link>
                  <Link
                    to="/institution/applications"
                    className="text-gray-700 hover:text-studyportal-blue font-medium"
                  >
                    Applications
                  </Link>
                  <Link
                    to="/institution/scholarships"
                    className="text-gray-700 hover:text-studyportal-blue font-medium"
                  >
                    Scholarships
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="rounded-full">
              <Search size={18} className="mr-2" />
              Search
            </Button>

            <Button variant="outline" size="sm" className="rounded-full">
              <Globe size={18} className="mr-2" />
              EN
            </Button>

            {isAuthenticated && isStudent && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full relative"
                onClick={() => navigate("/student/notifications")}
              >
                <Bell size={18} />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            )}

            {!isAuthenticated ? (
              <Link to="/login">
                <Button className="bg-studyportal-blue hover:bg-blue-700 text-white rounded-full">Sign In</Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full">
                    <User size={18} className="mr-2" />
                    {user?.name?.split(" ")[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {isStudent && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/student/dashboard")}>
                        <GraduationCap className="mr-2 h-4 w-4" />
                        <span>Student Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/student/applications")}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Applications</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/student/documents")}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>My Documents</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/student/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/student/notifications")}>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                        {unreadNotifications > 0 && (
                          <Badge className="ml-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                            {unreadNotifications}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    </>
                  )}

                  {isInstitution && (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/institution/dashboard")}>
                        <Building className="mr-2 h-4 w-4" />
                        <span>Institution Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/institution/add-course")}>
                        <GraduationCap className="mr-2 h-4 w-4" />
                        <span>Add Program</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/institution/applications")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Manage Applications</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/institution/scholarships")}>
                        <Award className="mr-2 h-4 w-4" />
                        <span>Manage Scholarships</span>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu size={24} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
