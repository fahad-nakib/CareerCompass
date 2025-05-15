"use client"

import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, BookOpen, GraduationCap, Calendar, MapPin, Trash2, ExternalLink } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Link } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import { getPrograms } from "@/services/programService"
import { fetchSavedProgramsId } from "@/services/programsService"
import type { Program } from "@/models/types"
import { useEffect } from "react"

//my data

const SavedPrograms = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [savedPrograms, setSavedPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSavedPrograms = async () => {
      try {
        setIsLoading(true)
        if (!user?.id) return

        // Fetch all programs
        const allPrograms = await getPrograms()
        console.log("All Programs:", allPrograms);

        // Fetch saved program IDs for the current user
        const savedProgramIds = await fetchSavedProgramsId((user.id).toString())
        console.log("Saved Program IDs:", savedProgramIds);

        // Filter programs to only include those that are saved by the user
        const userSavedPrograms = allPrograms.filter((program) =>
          savedProgramIds.some((savedProgram) => savedProgram.program_id === program.id),
        )
        console.log("Saved Programs:", userSavedPrograms);

        setSavedPrograms(userSavedPrograms)
      } catch (error) {
        console.error("Error loading saved programs:", error)
        toast({
          title: "Error",
          description: "Failed to load your saved programs. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadSavedPrograms()
  }, [user, toast])

  const handleRemoveProgram = async (programId: string) => {
    try {
      if (!user?.id) return

      // Here you would add the API call to remove the program from saved list
      // For example: await removeSavedProgram(user.id, programId)

      // Update local state
      setSavedPrograms(savedPrograms.filter((program) => program.id !== programId))

      toast({
        title: "Program removed",
        description: "The program has been removed from your saved list.",
      })
    } catch (error) {
      console.error("Error removing program:", error)
      toast({
        title: "Error",
        description: "Failed to remove the program. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredPrograms = savedPrograms.filter((program) => {
    const matchesSearch =
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "Bachelor") return matchesSearch && program.degree === "Bachelor"
    if (activeTab === "Master") return matchesSearch && program.degree === "Master"
    if (activeTab === "Doctorate") return matchesSearch && program.degree === "Doctorate"

    return matchesSearch
  })

  const formatDeadline = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const isDeadlineSoon = (dateString: string) => {
    const deadline = new Date(dateString)
    const now = new Date()
    const diffTime = deadline.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 30 && diffDays > 0
  }

  const isDeadlinePassed = (dateString: string) => {
    const deadline = new Date(dateString)
    const now = new Date()
    return deadline < now
  }

  return (
    <Layout>
      <div className="flex">
        <Sidebar role="student" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-studyportal-blue">Saved Programs</h1>
              <p className="text-gray-600 mt-2">Manage your saved academic programs</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search saved programs..."
                className="pl-10 pr-4 py-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="Bachelor">Undergraduate</TabsTrigger>
              <TabsTrigger value="Master">Graduate</TabsTrigger>
              <TabsTrigger value="Doctorate">Doctorate</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-studyportal-blue"></div>
                </div>
              ) : filteredPrograms.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Saved Programs</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchTerm
                        ? "No programs match your search criteria. Try adjusting your search terms."
                        : "You haven't saved any programs yet. Browse the program listings to find and save programs you're interested in."}
                    </p>
                    <Button className="mt-6" asChild>
                      <Link to="/gigs">Browse Programs</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredPrograms.map((program) => (
                    <Card key={program.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{program.title}</CardTitle>
                            <CardDescription className="mt-1">{program.university}</CardDescription>
                          </div>
                          <Badge
                            variant={
                              program.degree === "Bachelor"
                                ? "default"
                                : program.degree === "Master"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {program.degree === "Bachelor"
                              ? "Undergraduate"
                              : program.degree === "Master"
                                ? "Graduate"
                                : program.degree === "Doctorate"
                                  ? "Doctorate"
                                  : "Program"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{program.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{program.startDate}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span>{program.duration}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span
                              className={`${
                                isDeadlinePassed(program.deadline)
                                  ? "text-red-500"
                                  : isDeadlineSoon(program.deadline)
                                    ? "text-yellow-500"
                                    : ""
                              }`}
                            >
                              {isDeadlinePassed(program.deadline)
                                ? "Deadline passed"
                                : `Deadline: ${formatDeadline(program.deadline)}`}
                            </span>
                          </div>
                        </div>

                        <p className="text-sm mb-4">{program.description}</p>

                        <div className="flex flex-wrap gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">
                            {program.title}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveProgram(program.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/gig/${program.id}`}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View Details
                            </Link>
                          </Button>
                          <Button size="sm" asChild disabled={isDeadlinePassed(program.deadline)}>
                            <Link to={`/student/application-form/${program.id}`}>Apply Now</Link>
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  )
}

export default SavedPrograms
