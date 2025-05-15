"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Award, DollarSign, Filter } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"

// Mock scholarship data
const scholarships = [
  {
    id: "1",
    title: "Global Excellence Scholarship",
    institution: "Harvard University",
    amount: "$25,000",
    deadline: "2025-12-15",
    eligibility: "International students with outstanding academic achievements",
    description:
      "The Global Excellence Scholarship is awarded to exceptional international students who have demonstrated academic excellence and leadership potential.",
    requirements: [
      "Minimum GPA of 3.8",
      "Two letters of recommendation",
      "Statement of purpose",
      "Proof of financial need",
    ],
    category: "merit",
    tags: ["international", "undergraduate", "graduate"],
  },
  {
    id: "2",
    title: "STEM Innovation Scholarship",
    institution: "MIT",
    amount: "$30,000",
    deadline: "2023-11-30",
    eligibility: "Students pursuing degrees in Science, Technology, Engineering, or Mathematics",
    description:
      "The STEM Innovation Scholarship supports talented students who are pursuing degrees in STEM fields and have demonstrated exceptional aptitude and innovation.",
    requirements: ["Minimum GPA of 3.5", "Research proposal", "Academic transcript", "Portfolio of projects"],
    category: "field",
    tags: ["stem", "undergraduate", "research"],
  },
  {
    id: "3",
    title: "Community Leadership Grant",
    institution: "Stanford University",
    amount: "$15,000",
    deadline: "2024-01-15",
    eligibility: "Students with exceptional community service and leadership experience",
    description:
      "The Community Leadership Grant recognizes students who have made significant contributions to their communities through service, advocacy, and leadership.",
    requirements: ["Evidence of community service", "Leadership positions", "Personal statement", "Two references"],
    category: "service",
    tags: ["leadership", "undergraduate", "community"],
  },
  {
    id: "4",
    title: "Arts and Humanities Fellowship",
    institution: "Yale University",
    amount: "$20,000",
    deadline: "2023-12-01",
    eligibility: "Students pursuing degrees in Arts, Humanities, or related fields",
    description:
      "The Arts and Humanities Fellowship supports talented students who are pursuing degrees in arts and humanities disciplines and have demonstrated exceptional creativity and critical thinking.",
    requirements: [
      "Portfolio submission",
      "Academic transcript",
      "Statement of purpose",
      "Two letters of recommendation",
    ],
    category: "field",
    tags: ["arts", "humanities", "undergraduate", "graduate"],
  },
  {
    id: "5",
    title: "First Generation Student Scholarship",
    institution: "Princeton University",
    amount: "$22,000",
    deadline: "2024-02-15",
    eligibility: "First-generation college students with financial need",
    description:
      "The First Generation Student Scholarship supports students who are the first in their families to attend college and have demonstrated academic potential and determination.",
    requirements: [
      "Proof of first-generation status",
      "Financial need documentation",
      "Personal statement",
      "Academic transcript",
    ],
    category: "need",
    tags: ["first-generation", "undergraduate", "financial-need"],
  },
]

const StudentScholarships = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [savedScholarships, setSavedScholarships] = useState<string[]>([])
  const [appliedScholarships, setAppliedScholarships] = useState<string[]>([])

  useEffect(() => {
    // In a real app, you would fetch the user's saved and applied scholarships
    // For now, we'll use mock data
    setSavedScholarships(["1", "3"])
    setAppliedScholarships(["2"])
  }, [user])

  const handleSaveScholarship = (scholarshipId: string) => {
    if (savedScholarships.includes(scholarshipId)) {
      setSavedScholarships(savedScholarships.filter((id) => id !== scholarshipId))
      toast({
        title: "Scholarship removed",
        description: "The scholarship has been removed from your saved list.",
      })
    } else {
      setSavedScholarships([...savedScholarships, scholarshipId])
      toast({
        title: "Scholarship saved",
        description: "The scholarship has been added to your saved list.",
      })
    }
  }

  const handleApplyScholarship = (scholarshipId: string) => {
    if (!appliedScholarships.includes(scholarshipId)) {
      setAppliedScholarships([...appliedScholarships, scholarshipId])
      toast({
        title: "Application submitted",
        description: "Your scholarship application has been submitted successfully.",
      })
    }
  }

  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch =
      scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "saved") return matchesSearch && savedScholarships.includes(scholarship.id)
    if (activeTab === "applied") return matchesSearch && appliedScholarships.includes(scholarship.id)
    if (activeTab === "merit") return matchesSearch && scholarship.category === "merit"
    if (activeTab === "need") return matchesSearch && scholarship.category === "need"
    if (activeTab === "field") return matchesSearch && scholarship.category === "field"

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Scholarships</h1>
            <p className="text-gray-600 mt-2">Discover and apply for scholarships to fund your education</p>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search scholarships by name, institution, or description..."
              className="pl-10 pr-4 py-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="all">All Scholarships</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
              <TabsTrigger value="applied">Applied</TabsTrigger>
              <TabsTrigger value="merit">Merit-Based</TabsTrigger>
              <TabsTrigger value="need">Need-Based</TabsTrigger>
              <TabsTrigger value="field">Field-Specific</TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          <TabsContent value={activeTab}>
            {filteredScholarships.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Scholarships Found</h3>
                  <p className="text-gray-500 text-center max-w-md">
                    {searchTerm
                      ? "No scholarships match your search criteria. Try adjusting your search terms."
                      : "There are no scholarships available in this category at the moment."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships.map((scholarship) => (
                  <Card key={scholarship.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{scholarship.title}</CardTitle>
                          <CardDescription className="mt-1">{scholarship.institution}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            scholarship.category === "merit"
                              ? "default"
                              : scholarship.category === "need"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {scholarship.category === "merit"
                            ? "Merit-Based"
                            : scholarship.category === "need"
                              ? "Need-Based"
                              : scholarship.category === "field"
                                ? "Field-Specific"
                                : scholarship.category === "service"
                                  ? "Service-Based"
                                  : "Scholarship"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-4">
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span className="font-medium">{scholarship.amount}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span
                          className={`${
                            isDeadlinePassed(scholarship.deadline)
                              ? "text-red-500"
                              : isDeadlineSoon(scholarship.deadline)
                                ? "text-yellow-500"
                                : ""
                          }`}
                        >
                          {isDeadlinePassed(scholarship.deadline)
                            ? "Deadline passed"
                            : `Deadline: ${formatDeadline(scholarship.deadline)}`}
                        </span>
                      </div>

                      <p className="text-sm mb-4">{scholarship.description}</p>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium mb-2">Eligibility:</h4>
                        <p className="text-sm text-gray-600">{scholarship.eligibility}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {scholarship.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveScholarship(scholarship.id)}
                        className={savedScholarships.includes(scholarship.id) ? "bg-gray-100" : ""}
                      >
                        {savedScholarships.includes(scholarship.id) ? "Saved" : "Save"}
                      </Button>
                      <Button
                        size="sm"
                        disabled={
                          isDeadlinePassed(scholarship.deadline) || appliedScholarships.includes(scholarship.id)
                        }
                        onClick={() => handleApplyScholarship(scholarship.id)}
                      >
                        {appliedScholarships.includes(scholarship.id) ? "Applied" : "Apply Now"}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default StudentScholarships
