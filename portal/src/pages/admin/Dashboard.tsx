"use client"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Users, Building, GraduationCap, ShieldCheck, AlertTriangle, BarChart3, Settings, Award } from "lucide-react"
import { useState } from "react"

// Mock data - would come from services in a real implementation
const pendingInstitutions = [
  { id: "1", name: "Cambridge University", email: "admin@cambridge.edu", date: "2023-05-15" },
  { id: "2", name: "Oxford University", email: "admin@oxford.edu", date: "2023-05-16" },
]

const recentActivity = [
  { id: "1", action: "New institution registered", entity: "Harvard University", time: "2 hours ago" },
  { id: "2", action: "Student application approved", entity: "John Doe", time: "3 hours ago" },
  { id: "3", action: "New scholarship added", entity: "MIT Scholarship", time: "5 hours ago" },
  { id: "4", action: "Document verification completed", entity: "Sarah Johnson", time: "1 day ago" },
]

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    students: 1245,
    institutions: 87,
    applications: 3456,
    scholarships: 156,
    pendingApprovals: 2,
    reportedIssues: 3,
  })

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <Link to="/admin/settings">
              <Button variant="outline">
                <Settings size={16} className="mr-2" />
                System Settings
              </Button>
            </Link>
            <Link to="/admin/reports">
              <Button className="bg-studyportal-blue hover:bg-blue-700">
                <BarChart3 size={16} className="mr-2" />
                View Reports
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Students</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.students}</h3>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-studyportal-blue" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/students">
                  <Button variant="link" className="p-0 h-auto text-studyportal-blue">
                    Manage Students →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Institutions</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.institutions}</h3>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/institutions">
                  <Button variant="link" className="p-0 h-auto text-studyportal-blue">
                    Manage Institutions →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Applications</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.applications}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/applications">
                  <Button variant="link" className="p-0 h-auto text-studyportal-blue">
                    View Applications →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Scholarships</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.scholarships}</h3>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/scholarships">
                  <Button variant="link" className="p-0 h-auto text-studyportal-blue">
                    Manage Scholarships →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingApprovals}</h3>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/approvals">
                  <Button variant="link" className="p-0 h-auto text-studyportal-blue">
                    Review Approvals →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Reported Issues</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.reportedIssues}</h3>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin/issues">
                  <Button variant="link" className="p-0 h-auto text-studyportal-blue">
                    Resolve Issues →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Approvals */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Pending Institution Approvals</CardTitle>
                <CardDescription>Universities waiting for approval to join the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingInstitutions.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No pending approvals</p>
                ) : (
                  <div className="space-y-4">
                    {pendingInstitutions.map((institution) => (
                      <div key={institution.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{institution.name}</h4>
                          <p className="text-sm text-gray-500">{institution.email}</p>
                          <p className="text-xs text-gray-400">
                            Registered: {new Date(institution.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50">
                            Reject
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-4">
                      <Link to="/admin/approvals">
                        <Button variant="link">View All Pending Approvals</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.entity}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <Link to="/admin/activity">
                    <Button variant="link">View All Activity</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminDashboard
