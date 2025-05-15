"use client"

import React from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, User, CalendarClock, BookOpen, Link } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { getApplicationsByInstitution, updateApplicationStatus } from "@/services/programsService"
import { useToast } from "@/hooks/use-toast"
import { Application, Program } from "@/models/types"
import { useNavigate } from "react-router-dom"

const ManageApplications = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [applications, setApplications] = React.useState<(Application & { program: Program })[]>([])

  React.useEffect(() => {
    if (user) {
      //console.log("Institution User id is: ", user.id);
      getApplicationsByInstitution(user.id.toString()).then((data) => {
        console.log("Applications data: ", data);
        setApplications(data)
      })
    }
  }, [user])

  const pendingApplications = applications.filter((app) => app.status === "pending")
  const approvedApplications = applications.filter((app) => app.status === "approved")
  const rejectedApplications = applications.filter((app) => app.status === "rejected")

  const handleUpdateStatus = (applicationId: string, status: "approved" | "rejected") => {
    try {
      updateApplicationStatus(applicationId, status)
      toast({
        title: `Application ${status}`,
        description: `The application has been ${status} successfully.`,
      })

      // Update the local state
      setApplications((prev) => prev.map((app) => (app.id === applicationId ? { ...app, status } : app)))
    } catch (error) {
      toast({
        title: "Action failed",
        description: "There was an error updating the application status.",
        variant: "destructive",
      })
    }
  }

  const renderApplications = (applicationsList: typeof applications) => {
    if (applicationsList.length === 0) {
      return (
        <div className="text-center py-12">
          <CalendarClock className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-lg text-gray-600">No applications found</p>
          <p className="text-gray-500 mt-2">No applications in this category at the moment.</p>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {applicationsList.map((application) => (
          <Card key={application.id} className="overflow-hidden">
            <div
              className={`h-1 ${
                application.status === "approved"
                  ? "bg-green-500"
                  : application.status === "rejected"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            />
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{application.program.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <BookOpen size={16} />
                    <span>
                      {application.program.degree} in {application.program.discipline}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-500" />
                      <span>Student Name: {application.student_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarClock size={16} className="text-gray-500" />
                      <span>Applied on: {new Date(application.application_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {application.status === "pending" && (
                  <div className="flex flex-col md:flex-row gap-2 self-end">
                    
                      <Button 
                        variant="outline" 
                        className="w-full md:w-auto bg-studyportal-blue hover:bg-blue-700"
                        onClick={() => navigate(`/institution/application/${application.id}`)}>
                            View Details
                      </Button>
                                    
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => handleUpdateStatus(application.id, "rejected")}
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </Button>
                    
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleUpdateStatus(application.id, "approved")}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </Button>
                  </div>
                )}

                {application.status === "approved" && (
                  <div className="self-end">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle size={14} className="mr-1" />
                      Approved
                    </span>
                  </div>
                )}

                {application.status === "rejected" && (
                  <div className="self-end">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      <XCircle size={14} className="mr-1" />
                      Rejected
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-studyportal-blue mb-8">Manage Applications</h1>

          <Tabs defaultValue="pending">
            <TabsList className="mb-8 w-full justify-start">
              <TabsTrigger value="pending" className="flex items-center">
                <CalendarClock className="mr-2 h-4 w-4" />
                Pending
                {pendingApplications.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    {pendingApplications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approved
                {approvedApplications.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {approvedApplications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center">
                <XCircle className="mr-2 h-4 w-4" />
                Rejected
                {rejectedApplications.length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    {rejectedApplications.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Applications</CardTitle>
                </CardHeader>
                <CardContent>{renderApplications(pendingApplications)}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approved">
              <Card>
                <CardHeader>
                  <CardTitle>Approved Applications</CardTitle>
                </CardHeader>
                <CardContent>{renderApplications(approvedApplications)}</CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rejected">
              <Card>
                <CardHeader>
                  <CardTitle>Rejected Applications</CardTitle>
                </CardHeader>
                <CardContent>{renderApplications(rejectedApplications)}</CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}

export default ManageApplications
