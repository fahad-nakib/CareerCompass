"use client"

import type React from "react"

import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import type { UserRole } from "../models/types"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole | string
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the appropriate dashboard based on role
    if (user?.role === "student") {
      return <Navigate to="/student/dashboard" replace />
    } else if (user?.role === "institution") {
      return <Navigate to="/institution/dashboard" replace />
    } else if (user?.role === "professor") {
      return <Navigate to="/professor/dashboard" replace />
    } else if (user?.role === "admission_officer") {
      return <Navigate to="/admission/dashboard" replace />
    } else if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
