"use client"
import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Mail, Users, FileText, Clock, Edit, User, MessageSquare, BookOpen, Loader2 } from "lucide-react"
import { fetchProfessor, fetchRecommendationRequests, fetchMessages, fetchCourses, getInstitutionNameById } from "@/pages/professor/professorService"
import { useToast } from "@/components/ui/use-toast"
import { programeNameByPid } from "@/services/programsService"
import { useNavigate } from "react-router-dom"

// Define types
interface RecommendationRequest {
  updated_at: string | number | Date
  program_id: string
  id: string
  student_name: string
  studentName: string
  program: string
  university: string
  requestDate: string
}

interface Message {
  id: string
  studentName: string
  subject: string
  date: string
  preview: string
}

interface Course {
  id: string
  name: string
  code: string
  institution: string
  studentCount: number
}

interface Professor {
  id?: string
  name: string
  email: string
  office?: string
  contactTime?: string
  experiences?: string
  description?: string
  profilePicture?: string | null
  institution?: string
  department?: string
  specialization?: string[]
}

const programName = async (programId: string) => {
  try {
    const programData = await programeNameByPid(programId)
    return programData
  } catch (error) {
    console.error("Error fetching program name:", error)
    return null
  }
}



const ProfessorDashboard = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [professor, setProfessor] = useState<Professor | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationRequest[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfessorData = async () => {
      if (!user?.id) {
        setError("User ID not found")
        setLoading(false)
        return
      }

      try {
        // Fetch professor profile
        const professorData = await fetchProfessor((user.id).toString())
        //console.log("Fetched professor data:", professorData)
        if (professorData && professorData.length > 0) {
          setProfessor(professorData[0])
          const insName = await getInstitutionNameById(professorData[0]?.institution_id);
          //console.log("Institution Name and id:", insName, professorData[0]?.institution_id);
        if (insName) {
          setProfessor((prev) => ({
            ...prev,
            institution: insName,
          }))
        }
        } else {
          // If no professor data exists, initialize with user data
          setProfessor({
            name: user.name || "",
            email: user.email || "",
            profilePicture: "",
          })
        }
        
        
    

        // Fetch initial recommendation requests
        setLoadingRecommendations(true)
        const recommendationsData = await fetchRecommendationRequests((user.id).toString())
        setRecommendations(
          (recommendationsData || []).map((request) => ({
            ...request,
            student_name: request.student_name || request.studentName,
            program_id: request.program_id || request.program,
            upadated_at: request.requestDate || request.updated_at,

          }))
        )
        setLoadingRecommendations(false)
      } catch (err) {
        console.error("Error fetching professor data:", err)
        setError("Failed to load professor data. Please try again later.")
        toast({
          title: "Error",
          description: "Failed to load professor data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProfessorData()
  }, [user, toast])



  const handleWriteRecommendation = (request: RecommendationRequest) => {
    navigate(`/professor/writeRecommendation/${user.id}`, {
      state: { studentInfo: request },
    })
  }


  const loadMessages = async () => {
    if (!user?.id) return

    setLoadingMessages(true)
    try {
      const messagesData = await fetchMessages((user.id).toString())
      setMessages(messagesData || [])
    } catch (err) {
      console.error("Error fetching messages:", err)
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingMessages(false)
    }
  }

  const loadCourses = async () => {
    if (!user?.id) return

    setLoadingCourses(true)
    try {
      const coursesData = await fetchCourses((user.id).toString())
      setCourses(coursesData || [])
    } catch (err) {
      console.error("Error fetching courses:", err)
      toast({
        title: "Error",
        description: "Failed to load courses. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoadingCourses(false)
    }
  }

  const handleTabChange = (value: string) => {
    if (value === "messages" && messages.length === 0 && !loadingMessages) {
      loadMessages()
    } else if (value === "courses" && courses.length === 0 && !loadingCourses) {
      loadCourses()
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-studyportal-blue" />
            <p className="text-gray-600">Loading professor dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Professor Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {professor?.name || user?.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/professor/manageprofile">
              <Button className="bg-studyportal-blue hover:bg-blue-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </div>
        </div>

        {/* Professor Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Profile Overview</CardTitle>
              <CardDescription>Your public profile information visible to students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={professor?.profilePicture || ""} alt={professor?.name} />
                  <AvatarFallback className="text-2xl">{professor?.name?.charAt(0) || "P"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">{professor?.name}</h2>
                  <p className="text-gray-600">
                    {professor?.department ? `Professor of ${professor.department}` : "Professor"}
                  </p>
                  <p className="text-gray-600">{professor.institution || "University"}</p>
                  <p className="text-gray-600">{professor.email || "Email"}</p>
                  {professor?.specialization && professor.specialization.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {professor.specialization.map((spec, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Your activity overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-blue-100 rounded-lg">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Unread Messages</p>
                      <p className="font-medium">{messages.length || 0}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600"
                    onClick={() => handleTabChange("messages")}
                  >
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-green-100 rounded-lg">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Recommendation Requests</p>
                      <p className="font-medium">{recommendations.length}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600"
                    onClick={() => handleTabChange("recommendations")}
                  >
                    View
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Student Inquiries</p>
                      <p className="font-medium">
                        {messages.filter((m) => m.subject.toLowerCase().includes("inquiry")).length || 0}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-purple-600"
                    onClick={() => handleTabChange("messages")}
                  >
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="recommendations" onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="recommendations" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Recommendation Requests
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center">
              <BookOpen className="mr-2 h-4 w-4" />
              My Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
            <Card>
              <CardHeader>
                <CardTitle>Pending Recommendation Requests</CardTitle>
                <CardDescription>Students waiting for your recommendation letters</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRecommendations ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-studyportal-blue" />
                    <p className="text-gray-600">Loading recommendation requests...</p>
                  </div>
                ) : recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No Pending Requests</h3>
                    <p className="text-gray-500">You don't have any pending recommendation letter requests.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recommendations.map( (request) => (
                      console.log("Recommendation Request:", request),
                      <div
                        key={request.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-500 mr-2" />
                            <h3 className="font-medium">{request.student_name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{request.program_id}</p>
                          <p className="text-sm text-gray-600">{request.university}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>Requested on {new Date(request.updated_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/pages/institution/application/${request.id}`}>
                          <Button variant="outline" size="sm"
                          >
                            View Details
                          </Button>
                          </Link>
                          
                          <Button className="bg-studyportal-blue hover:bg-blue-700" size="sm"
                          onClick={() => handleWriteRecommendation(request)}>
                            Write Recommendation
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Communications from students</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingMessages ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-studyportal-blue" />
                    <p className="text-gray-600">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No Messages</h3>
                    <p className="text-gray-500">You don't have any messages from students.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{message.subject}</h3>
                            <p className="text-sm text-gray-600 mt-1">From: {message.studentName}</p>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(message.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-600 mt-2 line-clamp-2">{message.preview}</p>
                        <div className="mt-3">
                          <Button variant="link" className="p-0 h-auto text-studyportal-blue">
                            Read & Reply
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="text-center mt-4">
                      <Button variant="outline">View All Messages</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Courses you're associated with</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCourses ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-studyportal-blue" />
                    <p className="text-gray-600">Loading courses...</p>
                  </div>
                ) : courses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No Courses</h3>
                    <p className="text-gray-500">You don't have any courses assigned yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map((course) => (
                      <Card key={course.id}>
                        <CardContent className="p-4">
                          <h3 className="font-medium">{course.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.code} - {course.institution}
                          </p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{course.studentCount} students</span>
                          </div>
                          <Button variant="link" className="p-0 h-auto text-studyportal-blue mt-2">
                            View Course
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default ProfessorDashboard
