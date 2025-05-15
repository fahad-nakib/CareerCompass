"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Clock, Globe, GraduationCap, Calendar, DollarSign, CheckCircle, ListChecks, Link } from "lucide-react"
import { getProgramById, addApplication, getApplicationsByStudentId } from "@/services/programsService"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Application, Program } from "@/models/types"

const CourseDetail = () => {
  const { degree, id } = useParams<{ degree: string; id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isApplying, setIsApplying] = useState(false)

  // Get program details
  const program = id ? getProgramById(id) : undefined

  // Check if user has already applied
  const [userApplications, setUserApplications] = useState<(Application & { program: Program })[]>([])
  const [hasApplied, setHasApplied] = useState(false)

  useEffect(() => {
    const fetchApplications = async () => {
      if (user) {
        const applications = await getApplicationsByStudentId(user.id.toString())
        setUserApplications(applications)
        setHasApplied(applications.some((app) => app.program.id === id))
      }
    }
    fetchApplications()
  }, [user, id])

  if (!program) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-studyportal-blue mb-4">Program Not Found</h1>
          <p className="mb-8">The program you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/student/dashboard")}>Back to Dashboard</Button>
        </div>
      </Layout>
    )
  }

  const handleApply = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to apply for this program",
        variant: "destructive",
      })
      navigate("/login")
      return
    }

    if (hasApplied) {
      toast({
        title: "Already applied",
        description: "You have already applied to this program",
      })
      return
    }

    setIsApplying(true)
    try {
      navigate(`/student/application-form/${program.id}`);
      // addApplication(program.id, user.id.toString())
      // toast({
      //   title: "Application submitted",
      //   description: "Your application has been successfully submitted!",
      // })
      setIsApplying(false)
      // Reload the page to update the UI
      window.location.reload()
    } catch (error) {
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      })
      setIsApplying(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Program Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-studyportal-blue">{program.title}</h1>
                <div className="flex items-center mt-2">
                  <GraduationCap size={18} className="text-gray-500 mr-2" />
                  <span className="text-gray-700">{program.university}</span>
                </div>
              </div>

              <Button
                onClick={() => navigate(`/student/application-form/${program.id}`)}
                disabled={isApplying || hasApplied}
                className="bg-studyportal-blue hover:bg-blue-700"
              >
                {hasApplied ? "Already Applied" : isApplying ? "Applying..." : "Apply Now"}
              </Button>
            </div>
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column - Program details */}
            <div className="md:col-span-2">
                <div className="mb-8">
                <img
                  src={"imageUrl" in program && typeof program.imageUrl === "string" ? program.imageUrl : "https://via.placeholder.com/600x400"}
                  alt={program.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Program Overview</h2>
                <p className="text-gray-700">{program.description}</p>
              </div>

              {program.requirements && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Requirements</h2>
                  <ul className="list-none space-y-2">
                    {program.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={18} className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right column - Key information */}
            <div>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Key Information</h3>

                  <ul className="space-y-4">
                    <li className="flex items-center">
                      <GraduationCap size={18} className="text-studyportal-blue mr-3" />
                      <div>
                        <span className="text-gray-500 text-sm block">Degree</span>
                        <span className="font-medium">{program.degree}</span>
                      </div>
                    </li>

                    <Separator />

                    <li className="flex items-center">
                      <Globe size={18} className="text-studyportal-blue mr-3" />
                      <div>
                        <span className="text-gray-500 text-sm block">Location</span>
                        <span className="font-medium">{program.location}</span>
                      </div>
                    </li>

                    <Separator />

                    <li className="flex items-center">
                      <Clock size={18} className="text-studyportal-blue mr-3" />
                      <div>
                        <span className="text-gray-500 text-sm block">Duration</span>
                        <span className="font-medium">{program.duration}</span>
                      </div>
                    </li>

                    <Separator />

                    <li className="flex items-center">
                      <DollarSign size={18} className="text-studyportal-blue mr-3" />
                      <div>
                        <span className="text-gray-500 text-sm block">Tuition</span>
                        <span className="font-medium">{program.tuitionFee}</span>
                      </div>
                    </li>

                    {program.deadline && (
                      <>
                        <Separator />
                        <li className="flex items-center">
                          <Calendar size={18} className="text-studyportal-blue mr-3" />
                          <div>
                            <span className="text-gray-500 text-sm block">Application Deadline</span>
                            <span className="font-medium">{program.deadline}</span>
                          </div>
                        </li>
                      </>
                    )}

                    {program && (
                      <>
                        <Separator />
                        <li className="flex items-center">
                          <ListChecks size={18} className="text-studyportal-blue mr-3" />
                          <div>
                            <span className="text-gray-500 text-sm block">Language</span>
                            <span className="font-medium"></span>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>

                  <div className="mt-6">
                    <Button
                      onClick={() => navigate(`/student/application-form/${program.id}`)}
                      disabled={isApplying || hasApplied}
                      className="w-full bg-studyportal-blue hover:bg-blue-700"
                    >
                      {hasApplied ? "Already Applied" : isApplying ? "Applying..." : "Apply Now"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CourseDetail
