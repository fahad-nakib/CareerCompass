"use client"
import { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { getAllPrograms, getApplicationsByInstitution } from "@/services/programsService"
import { GraduationCap, BookOpen, PlusCircle, Users, Clock, School, UserPlus } from "lucide-react"

const InstitutionDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  // Get institution programs
  const allPrograms = getAllPrograms()
  const institutionPrograms = allPrograms.filter((p) => p.university === user?.name)

  // Get all applications for this institution's programs
  const [applications, setApplications] = useState<any[]>([])
  const [pendingApplications, setPendingApplications] = useState<any[]>([])

  useEffect(() => {
    const fetchApplications = async () => {
      if (user) {
        const fetchedApplications = await getApplicationsByInstitution((user.id).toString())
        setApplications(fetchedApplications)
        setPendingApplications(fetchedApplications.filter((app) => app.status === "pending"))
      }
    }
    fetchApplications()
  }, [user])

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Institution Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <Link to="/institution/add-course">
              <Button className="bg-studyportal-blue hover:bg-blue-700">
                <PlusCircle size={16} className="mr-2" />
                Add New Program
              </Button>
            </Link>
            <Link to="/institution/add-employee">
              <Button variant="outline">
                <UserPlus size={16} className="mr-2" />
                Add Employee
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="staff">Employee</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-studyportal-blue" />
                    Programs
                  </CardTitle>
                  <CardDescription>Your listed education programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{institutionPrograms.length}</div>
                  <p className="text-sm text-gray-500 mt-1">Total programs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-studyportal-orange" />
                    Applications
                  </CardTitle>
                  <CardDescription>Student applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{applications.length}</div>
                  <p className="text-sm text-gray-500 mt-1">Total applications received</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-500" />
                    Pending
                  </CardTitle>
                  <CardDescription>Awaiting your review</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{pendingApplications.length}</div>
                  <p className="text-sm text-gray-500 mt-1">Pending applications</p>
                  {pendingApplications.length > 0 && (
                    <Link to="/institution/applications">
                      <Button variant="outline" className="mt-4 w-full">
                        Review Applications
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-purple-500" />
                    Employee
                  </CardTitle>
                  <CardDescription>Professors & Admission Officers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">0</div>
                  <p className="text-sm text-gray-500 mt-1">Total staff members</p>
                  <Link to="/institution/manage-users">
                    <Button variant="outline" className="mt-4 w-full">
                      Manage Employee
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Recent Applications</h2>
                <Link to="/institution/applications">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {applications.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Users className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-lg text-gray-600">No applications received yet</p>
                    <p className="text-gray-500 mt-2 mb-6">
                      When students apply to your programs, their applications will appear here.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {applications.slice(0, 3).map((application) => (
                    <Card key={application.id} className="overflow-hidden">
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
                        <CardDescription>
                          Applied on {new Date(application.application_date).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center">
                            <Users size={16} className="mr-2 text-gray-500" />
                            <span className="text-sm text-gray-600">{application.student_name || "Student"}</span>
                          </div>
                          <span
                            className={`text-sm font-medium px-3 py-1 rounded-full ${
                              application.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : application.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                        <Link to={`/institution/application/${application.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="programs">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Programs</h2>
              <Link to="/institution/add-course">
                <Button className="bg-studyportal-blue hover:bg-blue-700">
                  <PlusCircle size={16} className="mr-2" />
                  Add New Program
                </Button>
              </Link>
            </div>

            {institutionPrograms.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <BookOpen className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-lg text-gray-600">You haven't added any programs yet.</p>
                  <p className="text-gray-500 mt-2 mb-6">
                    Add your first educational program to start receiving applications.
                  </p>
                  <Link to="/institution/add-course">
                    <Button className="bg-studyportal-blue hover:bg-blue-700">
                      <PlusCircle size={16} className="mr-2" />
                      Add Your First Program
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {institutionPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <img
                      src={program.imageUrl || "/placeholder.svg"}
                      alt={program.title}
                      className="h-48 w-full object-cover"
                    />
                    <CardContent className="p-5">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="mr-2">{program.degree}</span>
                        <span className="mx-2">•</span>
                        <span>{program.discipline}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-studyportal-blue">{program.title}</h3>
                      <div className="flex items-center text-sm text-gray-600 mt-2 mb-4">
                        <GraduationCap size={16} className="mr-1" />
                        <span>{program.university}</span>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm">
                          <span className="text-gray-600">Applications: </span>
                          <span className="font-medium">
                            {applications.filter((a) => a.program.id === program.id).length}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/gig/${program.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                          <Link to={`/institution/edit-program/${program.id}`}>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="applications">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">All Applications</h2>
            </div>

            {applications.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Users className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-lg text-gray-600">No applications received yet</p>
                  <p className="text-gray-500 mt-2">
                    When students apply to your programs, their applications will appear here.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-4 md:w-2/3">
                        <div className="flex items-center mb-2">
                          <h3 className="font-medium text-lg">{application.program.title}</h3>
                          <span
                            className={`ml-3 text-xs font-medium px-2 py-1 rounded-full ${
                              application.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : application.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Applicant: <span className="font-medium">{application.student_name || "Student"}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Applied on {new Date(application.application_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 md:w-1/3 flex md:flex-col justify-between items-center md:items-end">
                        <div className="text-sm text-gray-600 md:mb-2">
                          {application.status === "pending" ? "Awaiting review" : "Reviewed"}
                        </div>
                        <Link to={`/institution/application/${application.id}`}>
                          <Button className="bg-studyportal-blue hover:bg-blue-700" size="sm">
                            Review Application
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="staff">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Employee Management</h2>
              <Link to="/institution/add-employee">
                <Button className="bg-studyportal-blue hover:bg-blue-700">
                  <UserPlus size={16} className="mr-2" />
                  Add New Employee
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5 text-studyportal-blue" />
                    Professors
                  </CardTitle>
                  <CardDescription>Manage your institution's professors</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Add professors to your institution who can interact with students and provide recommendation
                    letters.
                  </p>
                  <Link to="/institution/manage-professors">
                    <Button className="w-full">Manage Professors</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-studyportal-orange" />
                    Admission Officers
                  </CardTitle>
                  <CardDescription>Manage your admission team</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Add admission officers who can review applications and manage the admission process.
                  </p>
                  <Link to="/institution/manage-admission-officers">
                    <Button className="w-full">Manage Admission Officers</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>All Employee members associated with your institution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <UserPlus className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-lg text-gray-600">No Employee members added yet</p>
                  <p className="text-gray-500 mt-2 mb-6">
                    Add professors and admission officers to build your institution's team.
                  </p>
                  <Link to="/institution/manage-users">
                    <Button className="bg-studyportal-blue hover:bg-blue-700">
                      <UserPlus size={16} className="mr-2" />
                      Add Your First Employee Member
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default InstitutionDashboard
