"use client"

import React, { useEffect, useState } from "react"
import Layout from "@/components/Layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { getProgramsByDegree, getApplicationsByStudentId } from "@/services/programsService"
import { GraduationCap, BookOpen, Award, Clock } from "lucide-react"
import Sidebar from "../../components/Sidebar"
import { Application, Program } from "@/models/types"

const StudentDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("bsc")

  const bscPrograms = getProgramsByDegree("Bachelor")
  const msPrograms = getProgramsByDegree("Master")
  const phdPrograms = getProgramsByDegree("PhD")

  const [applications, setApplications] = useState<(Application & { program: Program })[]>([])

  useEffect(() => {
    const fetchApplications = async () => {
      if (user) {
        const fetchedApplications = await getApplicationsByStudentId(user.id.toString())
        setApplications(fetchedApplications)
      }
    }
    fetchApplications()
  }, [user])

  return (
    <Layout>
      <div className="flex">
      <Sidebar role="student" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Student Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          </div>
        </div>

        {/* Applications section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Applications</h2>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Clock className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-lg text-gray-600">You haven't applied to any programs yet.</p>
                <p className="text-gray-500 mt-2">
                  Browse the available programs below and submit your first application!
                </p>
              </CardContent>
            </Card>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applications.map((application) => (
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
                    <CardDescription>{application.program.university}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <GraduationCap size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">{application.program.degree}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(application.application_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
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
                      <Link to={`/gig/${application.program.id}`}>
                        <Button variant="outline" size="sm">
                          View Program
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Program listings */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Browse Programs</h2>

          <Tabs defaultValue="bsc" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="bsc" className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Bachelor Programs
              </TabsTrigger>
              <TabsTrigger value="ms" className="flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                Master Programs
              </TabsTrigger>
              <TabsTrigger value="phd" className="flex items-center">
                <Award className="mr-2 h-4 w-4" />
                PhD Programs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bsc" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bscPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <img src={program.imageUrl} alt={program.title} className="h-48 w-full object-cover" />
                    <CardContent className="p-5">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="mr-2">{program.degree}</span>
                        <span className="mx-2">•</span>
                        <span>{program.discipline}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-studyportal-blue">{program.title}</h3>
                      <p className="text-gray-700 mb-3">{program.university}</p>
                      <div className="mt-4">
                        <Link to={`/student/course/bachelor/${program.id}`}>
                          <Button className="w-full bg-studyportal-blue hover:bg-blue-700">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ms" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {msPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <img src={program.imageUrl} alt={program.title} className="h-48 w-full object-cover" />
                    <CardContent className="p-5">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="mr-2">{program.degree}</span>
                        <span className="mx-2">•</span>
                        <span>{program.discipline}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-studyportal-blue">{program.title}</h3>
                      <p className="text-gray-700 mb-3">{program.university}</p>
                      <div className="mt-4">
                        <Link to={`/student/course/master/${program.id}`}>
                          <Button className="w-full bg-studyportal-blue hover:bg-blue-700">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="phd" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {phdPrograms.map((program) => (
                  <Card
                    key={program.id}
                    className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
                    <img src={program.imageUrl} alt={program.title} className="h-48 w-full object-cover" />
                    <CardContent className="p-5">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <span className="mr-2">{program.degree}</span>
                        <span className="mx-2">•</span>
                        <span>{program.discipline}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-1 text-studyportal-blue">{program.title}</h3>
                      <p className="text-gray-700 mb-3">{program.university}</p>
                      <div className="mt-4">
                        <Link to={`/student/course/phd/${program.id}`}>
                          <Button className="w-full bg-studyportal-blue hover:bg-blue-700">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
    </Layout>
  )
}

export default StudentDashboard
