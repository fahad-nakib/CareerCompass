"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Layout from "@/components/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getProgramById } from "@/services/programsService"
import type { Program } from "@/models/types"
import {
  Calendar,
  DollarSign,
  Languages,
  Award,
  BookOpen,
  Clock,
  Heart,
  Share2,
  MapPin,
  GraduationCap,
  Check,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { postSavedProgramsId } from "@/services/programsService"

const GigDetail = () => {
  //-----!!!-----
  const { user } = useAuth()
  const { id } = useParams<{ id: string }>()
  const [program, setProgram] = useState<Program | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const foundProgram = getProgramById(id)
      setProgram(foundProgram || null)
      setIsLoading(false)
    }
  }, [id])

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-64 bg-gray-200 rounded mb-4"></div>
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  if (!program) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Program Not Found</h1>
            <p className="text-gray-600 mb-6">The program you're looking for doesn't exist or has been removed.</p>
            <Link to="/gigs">
              <Button className="bg-studyportal-blue hover:bg-blue-700">Browse All Programs</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  function haandleSaveProgram(program_id: string): void {
    //const newUser: User = {
    const newSavedProgram = {
      id: "", // Provide a unique ID or leave it empty if the backend generates it
      program_id: program_id, // Add the required program_id property
      programId: program_id,
      studentId: (user.id).toString(),
      savedDate: new Date().toISOString(), // Add the current date as the saved date
    }
    //postSavedProgramsId(program_id, (user.id).toString());
    postSavedProgramsId(newSavedProgram)
      .then((response) => {
        console.log("Saved program successfully:", response)
      })
      .catch((error) => {
        console.error("Error saving program:", error)
      })
    console.log("Program saved successfully!", program_id,user.id,);
  }

  return (
    <Layout>
      {/* Header Banner */}
      <div className="bg-studyportal-blue py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <div className="flex items-center text-white/80 text-sm mb-2">
                <Link to="/" className="hover:text-white">
                  Home
                </Link>
                <span className="mx-2">›</span>
                <Link to="/gigs" className="hover:text-white">
                  Programs
                </Link>
                <span className="mx-2">›</span>
                <span>{program.title}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{program.title}</h1>
              <p className="text-xl text-white/90">{program.university}</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button variant="outline" className="text-studyportal-blue border-white hover:bg-white hover:text-black"
              onClick={() => haandleSaveProgram(program.id)}
              >
                <Heart size={18} className="mr-2" />
                Save
              </Button>
              <Button variant="outline" className="text-studyportal-blue border-white hover:bg-white hover:text-black">
                <Share2 size={18} className="mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:w-2/3">
            {/* Program Image */}
            <div className="mb-8">
              <img src={program.imageUrl} alt={program.title} className="w-full rounded-lg object-cover h-80" />
            </div>

            {/* Program Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Program Overview</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{program.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="flex items-start">
                  <div className="mr-3 p-2 bg-studyportal-lightBlue rounded-lg">
                    <Clock size={20} className="text-studyportal-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{program.duration}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 p-2 bg-studyportal-lightBlue rounded-lg">
                    <BookOpen size={20} className="text-studyportal-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Discipline</p>
                    <p className="font-medium">{program.discipline}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 p-2 bg-studyportal-lightBlue rounded-lg">
                    <GraduationCap size={20} className="text-studyportal-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Degree</p>
                    <p className="font-medium">{program.degree}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 p-2 bg-studyportal-lightBlue rounded-lg">
                    <DollarSign size={20} className="text-studyportal-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tuition</p>
                    <p className="font-medium">{program.tuitionFee}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 p-2 bg-studyportal-lightBlue rounded-lg">
                    <Languages size={20} className="text-studyportal-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Language</p>
                    <p className="font-medium">{"English"}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 p-2 bg-studyportal-lightBlue rounded-lg">
                    <Calendar size={20} className="text-studyportal-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Application Deadline</p>
                    <p className="font-medium">{(program.deadline).slice(0, 10) || "Contact university"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admission Requirements */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Admission Requirements</h2>
              {program.requirements ? (
                <ul className="list-none space-y-3">
                  {program.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={20} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700">Please contact the university for detailed admission requirements.</p>
              )}

              {program.applicationFee && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="flex items-center text-gray-700">
                    <AlertCircle size={18} className="text-studyportal-blue mr-2" />
                    Application Fee: <span className="font-medium ml-1">{program.applicationFee}</span>
                  </p>
                </div>
              )}
            </div>

            {/* University Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About the University</h2>
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1562774053-701939374585"
                    alt={program.university}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{program.university}</h3>
                  <p className="text-gray-700 mb-3">
                    {program.university} is a prestigious institution offering high-quality education and research
                    opportunities in various disciplines. With a strong focus on academic excellence and innovation, the
                    university provides students with a transformative learning experience.
                  </p>
                  <div className="flex items-center mb-2">
                    <MapPin size={18} className="text-studyportal-blue mr-2" />
                    <span className="text-gray-600">{program.location}</span>
                  </div>
                  {program.ranking && (
                    <div className="flex items-center">
                      <Award size={18} className="text-studyportal-blue mr-2" />
                      <span className="text-gray-600">Ranked #{program.ranking} in its category</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:w-1/3">
            {/* Application Card */}
            <Card className="mb-6 sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-studyportal-blue mb-4">Apply to this Program</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="font-medium">{(program.deadline).slice(0, 10) || "Contact university"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Study Start Date:</span>
                    <span className="font-medium">Fall Semester</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Fee:</span>
                    <span className="font-medium">{program.applicationFee || "Varies"}</span>
                  </div>
                </div>
                <Button className="w-full bg-studyportal-blue hover:bg-blue-700 mb-3">Request Information</Button>
                <Button variant="outline" className="w-full">
                  Visit University Website
                </Button>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">Study advisors are available to answer your questions</p>
                </div>
              </CardContent>
            </Card>

            {/* Similar Programs */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Similar Programs</h3>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-studyportal-blue">MSc in Data Analytics</h4>
                    <p className="text-sm text-gray-600 mb-2">Harvard University</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">United States</span>
                      <Link to="/gig/9">
                        <Button variant="link" className="text-studyportal-blue p-0">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-studyportal-blue">MSc in Artificial Intelligence</h4>
                    <p className="text-sm text-gray-600 mb-2">MIT</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">United States</span>
                      <Link to="/gig/10">
                        <Button variant="link" className="text-studyportal-blue p-0">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-studyportal-blue">MSc in Computer Engineering</h4>
                    <p className="text-sm text-gray-600 mb-2">ETH Zurich</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Switzerland</span>
                      <Link to="/gig/11">
                        <Button variant="link" className="text-studyportal-blue p-0">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default GigDetail
