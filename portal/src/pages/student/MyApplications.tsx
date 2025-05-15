"use client"
import Layout from "@/components/Layout"
import { useAuth } from "@/contexts/AuthContext"
import { addApplication, getApplicationsByStudentId } from "@/services/programsService"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { GraduationCap, Calendar, Clock, ExternalLink, FileText } from "lucide-react"
import { format } from "date-fns"
import Sidebar from "../../components/Sidebar"
import { Application, Program } from "@/models/types"
import React from "react"

const MyApplications = () => {
  // const dm: Application = {
  //   id: "dfsd",
  //   programId: "prog_1",
  //   studentId: "9f4b5efc-287f-11f0-8cb9-c85b767149ab",
  //   studentName: "Md. Fahad Nakib",
  //   status: "pending",
  //   applicationDate: new Date().toISOString(),
  //   sop: "amader chotonodi cole bake bake",
  //   comments: [],
  // }
  // const appi = addApplication(dm.programId, dm.studentId, dm.studentName,dm.sop);

  const { user } = useAuth()
  console.log("User id is: ", user?.id)
  const [applications, setApplications] = React.useState<(Application & { program: Program })[]>([])

  React.useEffect(() => {
    if (user) {
      getApplicationsByStudentId(user.id.toString()).then((data) => {
        setApplications(data)
      })
    }
  }, [user])

  console.log("Applications: ", applications)



  // Group applications by status
  const pendingApplications = applications.filter((app) => app.status === "pending")
  const approvedApplications = applications.filter((app) => app.status === "approved")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  return (
    <Layout>
      <div className="flex">
      <Sidebar role="student" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-studyportal-blue">My Applications</h1>
              <p className="text-gray-600 mt-2">Manage and track all your program applications</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/student/dashboard">
                <Button variant="outline" className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Browse Programs
                </Button>
              </Link>
            </div>
          </div>

          {applications.length === 0 ? (
            <Card className="mb-8">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Applications Yet</h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  You haven't applied to any programs yet. Browse available programs and submit your first application!
                </p>
                <Link to="/student/dashboard">
                  <Button className="bg-studyportal-blue hover:bg-blue-700">Browse Programs</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Pending Applications */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-yellow-500" />
                  Pending Applications ({pendingApplications.length})
                </h2>
                {pendingApplications.length === 0 ? (
                  <p className="text-gray-500 italic">No pending applications</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingApplications.map((app) => (
                      <ApplicationCard key={app.id} application={app} />
                    ))}
                  </div>
                )}
              </div>

              {/* Approved Applications */}
              <div className="mb-10">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <GraduationCap className="mr-2 h-5 w-5 text-green-500" />
                  Approved Applications ({approvedApplications.length})
                </h2>
                {approvedApplications.length === 0 ? (
                  <p className="text-gray-500 italic">No approved applications yet</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {approvedApplications.map((app) => (
                      <ApplicationCard key={app.id} application={app} />
                    ))}
                  </div>
                )}
              </div>

              {/* Rejected Applications */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-red-500" />
                  Rejected Applications ({rejectedApplications.length})
                </h2>
                {rejectedApplications.length === 0 ? (
                  <p className="text-gray-500 italic">No rejected applications</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rejectedApplications.map((app) => (
                      <ApplicationCard key={app.id} application={app} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}

const ApplicationCard = ({ application }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  }
  //console.log("date founded:",application.applicationDate);

  return (
    <Card className="overflow-hidden">
      <div
        className={`h-2 ${
          application.status === "approved"
            ? "bg-green-500"
            : application.status === "rejected"
              ? "bg-red-500"
              : "bg-yellow-500"
        }`}
      />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{application.program.title}</CardTitle>
        <p className="text-sm text-gray-600">{application.program.university}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <GraduationCap size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">{application.program.degree}</span>
            </div>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-gray-500" />
              <span className="text-sm text-gray-600">
                {format(new Date(application.application_date), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div>
            <Badge className={statusColors[application.status]}>
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Link to={`/student/course/${application.program.degree.toLowerCase()}/${application.program.id}`}>
            <Button variant="outline" size="sm" className="flex items-center">
              <ExternalLink className="mr-1 h-3 w-3" />
              View Program
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default MyApplications
