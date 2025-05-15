"use client"

import type React from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

interface SidebarProps {
  role: "student" | "institution" | "admin" | "professor" | "admission"
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path ? "bg-blue-700" : ""
  }

  const renderLinks = () => {
    switch (role) {
      case "student":
        return (
          <>
            <Link
              to="/student/dashboard"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/student/dashboard")}`}
            >
              Dashboard
            </Link>
            <Link to="/student/profile" className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/student/profile")}`}>
              Profile
            </Link>
            <Link
              to="/student/applications"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/student/applications")}`}
            >
              My Applications
            </Link>
            <Link
              to="/student/documents"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/student/documents")}`}
            >
              Documents
            </Link>
            <Link
              to="/student/professors"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/student/professors")}`}
            >
              Contact Professors
            </Link>
            <Link
              to="/student/notifications"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/student/notifications")}`}
            >
              Notifications
            </Link>
            <Link
              to="/student/SavedPrograms"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/student/notifications")}`}
            >
              Saved Programs
            </Link>
            <Link to="/gigs" className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/programs")}`}>
              Browse Programs
            </Link>
          </>
        )
      case "institution":
        return (
          <>
            <Link
              to="/institution/dashboard"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/institution/dashboard")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/institution/add-course"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/institution/add-course")}`}
            >
              Add Program
            </Link>
            <Link
              to="/institution/applications"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/institution/applications")}`}
            >
              Manage Applications
            </Link>
            <Link
              to="/institution/scholarships"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/institution/scholarships")}`}
            >
              Scholarships
            </Link>
            <Link
              to="/institution/add-employee"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/institution/add-employee")}`}
            >
              Add Employee
            </Link>
            <Link
              to="/institution/professors"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/institution/professors")}`}
            >
              Manage Professors
            </Link>
            <Link
              to="/institution/admissions"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/institution/admissions")}`}
            >
              Admission Officers
            </Link>
          </>
        )
      case "admin":
        return (
          <>
            <Link to="/admin/dashboard" className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admin/dashboard")}`}>
              Dashboard
            </Link>
            <Link
              to="/admin/institutions"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admin/institutions")}`}
            >
              Institution Approvals
            </Link>
            <Link to="/admin/users" className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admin/users")}`}>
              Manage Users
            </Link>
            <Link to="/admin/analytics" className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admin/analytics")}`}>
              Analytics
            </Link>
            <Link to="/admin/system" className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admin/system")}`}>
              System Settings
            </Link>
          </>
        )
      case "professor":
        return (
          <>
            <Link
              to="/professor/dashboard"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/professor/dashboard")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/professor/profile"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/professor/profile")}`}
            >
              Profile
            </Link>
            <Link
              to="/professor/students"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/professor/students")}`}
            >
              Student Inquiries
            </Link>
            <Link
              to="/professor/recommendations"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/professor/recommendations")}`}
            >
              Recommendation Letters
            </Link>
          </>
        )
      case "admission":
        return (
          <>
            <Link
              to="/admission/dashboard"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admission/dashboard")}`}
            >
              Dashboard
            </Link>
            <Link
              to="/admission/applications"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admission/applications")}`}
            >
              Review Applications
            </Link>
            <Link
              to="/admission/payments"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admission/payments")}`}
            >
              Payment Verification
            </Link>
            <Link
              to="/admission/documents"
              className={`p-3 hover:bg-blue-700 rounded-md ${isActive("/admission/documents")}`}
            >
              Document Verification
            </Link>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-blue-800 text-white w-64 min-h-screen p-4">
      <div className="text-2xl font-bold mb-8">Study Portal</div>
      <div className="flex flex-col space-y-2">
        {renderLinks()}
        <button onClick={logout} className="p-3 hover:bg-blue-700 rounded-md mt-auto text-left">
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
