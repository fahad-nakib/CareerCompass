"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import Sidebar from "../../components/Sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Download, CheckCircle, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Application, Student, Education, Document } from "@/models/types"
import { programeNameByPid } from "@/services/programsService"
import { fetchProfessor } from "../professor/professorService"

interface Comments {
  id: string
  student_name: string
  author_id: string
  program_id: string
  university: string
  updated_at: string
  comment: string
}
interface ProfInfo{
  name: string
  email: string
}

const ViewApplication = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState<Application | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [education, setEducation] = useState<Education[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [recomnedations,setRecommendations] = useState<Comments[]>([])
  const [error, setError] = useState<string | null>(null)
  const [professorInfo, setProfessor] = useState<ProfInfo | null>(null)

  const [programName, setProgramName] = useState<string>("N/A")

  useEffect(() => {
    const fetchProgramName = async () => {
      if (application?.program_id) {
        const name = await programeNameByPid(application.program_id)
        setProgramName(name || "N/A")
      }
    }
    fetchProgramName()
  }, [application?.program_id])

  

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      setLoading(true)
      setError(null)

      try {
        // Fetch application details
        //console.log("The id is : ", id);
        const applicationResponse = await fetch(`http://localhost:8081/institution/application/${id}`)
        if (!applicationResponse.ok) {
          throw new Error(`Failed to fetch application: ${applicationResponse.statusText}`)
        }
        const applicationData = await applicationResponse.json()
        setApplication(applicationData[0])
        // console.log("Application data: ", applicationData);
        // console.log("Application after printing:",application);

        // Get student ID from application data
        const studentId = applicationData[0].student_id
        //console.log("This is Student ID: ", studentId);

        // Fetch student information
        const studentResponse = await fetch(`http://localhost:8081/student/studentuid/${studentId}`)
        if (!studentResponse.ok) {
          throw new Error(`Failed to fetch student info: ${studentResponse.statusText}`)
        }
        const studentData = await studentResponse.json()
        setStudent(studentData[0])
        //console.log("Stuent data fetched: ",studentData);

        // Fetch education history
        const educationResponse = await fetch(`http://localhost:8081/student/education/${studentId}`)
        if (!educationResponse.ok) {
          throw new Error(`Failed to fetch education: ${educationResponse.statusText}`)
        }
        const educationData = await educationResponse.json()
        setEducation(Array.isArray(educationData) ? educationData : [])


        // console.log("the application : ", application);
        // console.log("the application id : ", application.id);
        //Fetch Comments history
        //console.log("application Id :",id);
        const commentResponse = await fetch(`http://localhost:8081/student/getcomment/${id}`)
        if (!commentResponse.ok) {
          throw new Error(`Failed to fetch education: ${commentResponse.statusText}`)
        }
        const commentsData = await commentResponse.json()
        setRecommendations(Array.isArray(commentsData) ? commentsData : [])
        console.log("comments Data : ", commentsData);


        const profInfoResponse = await fetchProfessor(commentsData[0].author_id);
        const profInfo = profInfoResponse[0]; // Assuming the first professor is relevant
        setProfessor({
          name: profInfo.name,
          email: profInfo.email,
        });
        console.log("prof info :", profInfo);


        // Fetch documents
        // const documentsResponse = await fetch(`http://localhost:8081/student/document/${studentId}`)
        // if (!documentsResponse.ok) {
        //   throw new Error(`Failed to fetch documents: ${documentsResponse.statusText}`)
        // }
        // const documentsData = await documentsResponse.json()
        // setDocuments(Array.isArray(documentsData) ? documentsData : [])
      } catch (err) {
        console.error("Error fetching application data:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to load application details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        )
      case "under_review":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Under Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        )
      case "waitlisted":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800">
            Waitlisted
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getVerificationStatusIcon = (status?: string) => {
    if (!status) return <Clock className="h-5 w-5 text-gray-400" />

    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "fake":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "pending":
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  // const handleDownloadDocument = (document: Document) => {
  //   // In a real app, this would download the file from the server
  //   if (document.fileUrl) {
  //     // Create a temporary anchor element to trigger the download
  //     const link = document.createElement("a")
  //     link.href = document.fileUrl
  //     link.download = document.name
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)

  //     toast({
  //       title: "Download Started",
  //       description: `Downloading ${document.name}...`,
  //     })
  //   } else {
  //     toast({
  //       title: "Download Failed",
  //       description: "Document URL is not available",
  //       variant: "destructive",
  //     })
  //   }
  // }

  if (loading) {
    return (
      <Layout>
        <div className="flex">
          <Sidebar role="institution" />
          <div className="flex-1 p-8">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div className="flex">
          <Sidebar role="institution" />
          <div className="flex-1 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Error Loading Application</h2>
              <p className="mt-2 text-gray-600">{error}</p>
              <Button className="mt-4" onClick={() => navigate("/institution/applications")}>
                Back to Applications
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!application || !student) {
    return (
      <Layout>
        <div className="flex">
          <Sidebar role="institution" />
          <div className="flex-1 p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">Application Not Found</h2>
              <p className="mt-2 text-gray-600">
                The application you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Button className="mt-4" onClick={() => navigate("/institution/applications")}>
                Back to Applications
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex">
        <Sidebar role="institution" />
        <div className="flex-1 p-8">
          <div className="mb-6">
            <Button variant="outline" className="mb-4" onClick={() => navigate("/institution/applications")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Applications
            </Button>

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Application Details</h1>
                <p className="text-gray-600">
                  {programName} - {getStatusBadge(application.status)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Application ID: {application.id}</p>
                <p className="text-sm text-gray-600">
                  Submitted: {new Date(application.application_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Applicant's personal details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{student.name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{student.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{student.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Address</h3>
                      <p className="mt-1 text-lg font-medium text-gray-900">{student.address}</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Statement of Purpose</h3>
                    <div className="mt-2 p-4 bg-gray-50 rounded-md">
                      <p className="text-gray-800 whitespace-pre-line">{application.sop}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education History</CardTitle>
                  <CardDescription>Applicant's educational background</CardDescription>
                </CardHeader>
                <CardContent>
                  {education.length === 0 ? (
                    <p className="text-gray-600">No education records found.</p>
                  ) : (
                    <div className="space-y-6">
                      {education.map((edu) => (
                        <div key={edu.id} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">{edu.institution}</h3>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {edu.degree}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mt-1">{edu.field_of_study}</p>
                          <div className="mt-2 flex justify-between text-sm">
                            <p className="text-gray-500">
                              {new Date(edu.start_date).toLocaleDateString()} -{" "}
                              {new Date(edu.end_date).toLocaleDateString()}
                            </p>
                            <p className="font-medium">GPA: {edu.gpa}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Documents</CardTitle>
                  <CardDescription>Documents uploaded by the applicant</CardDescription>
                </CardHeader>
                <CardContent>
                  {documents.length === 0 ? (
                    <p className="text-gray-600">No documents found.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc) => (
                        <div key={doc.id} className="border rounded-md p-4 flex items-start">
                          <div className="bg-blue-100 p-2 rounded-md mr-4">
                            <FileText className="h-6 w-6 text-blue-700" />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-medium text-gray-900">{doc.name}</h3>
                                <p className="text-sm text-gray-500 capitalize">{doc.type.replace("_", " ")}</p>
                              </div>
                              <div className="flex items-center">
                                {getVerificationStatusIcon(doc.verificationStatus)}
                              </div>
                            </div>
                            <div className="mt-2 flex justify-between items-center">
                              <p className="text-xs text-gray-500">
                                Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800"
                                //onClick={() => handleDownloadDocument(doc)}
                              >
                                <Download className="h-4 w-4 mr-1" /> Download
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Comments</CardTitle>
                <CardDescription>Internal notes and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                {!recomnedations || recomnedations.length === 0 ? (
                  <p className="text-gray-600">No comments yet.</p>
                ) : (
                  <div className="space-y-4">
                    {recomnedations.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium text-gray-900">
                            {professorInfo.name} <span className="text-sm text-gray-500">Professor</span>
                          </h3>
                          <p className="text-sm text-gray-500">{new Date(comment.updated_at).toLocaleString()}</p>
                        </div>
                        <p className="mt-2 text-gray-700">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ViewApplication
