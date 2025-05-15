"use client"
import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Search, Mail, BookOpen, Calendar, MapPin, ExternalLink, Send } from "lucide-react"
import type { Professor } from "@/models/types"
import Sidebar from "../../components/Sidebar"

// Mock data - would come from services in a real implementation
const professors: Professor[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@stanford.edu",
    institutionId: "stanford",
    department: "Computer Science",
    expertise: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
    bio: "Dr. Johnson is a leading researcher in AI with over 15 years of experience. She has published numerous papers in top-tier conferences and journals.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
    officeHours: "Monday and Wednesday, 2-4 PM",
    contactInfo: "Office: CS Building, Room 305",
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    email: "michael.chen@mit.edu",
    institutionId: "mit",
    department: "Electrical Engineering",
    expertise: ["Robotics", "Control Systems", "Embedded Systems"],
    bio: "Professor Chen specializes in robotics and control systems. His research focuses on developing autonomous robots for various applications.",
    imageUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5",
    officeHours: "Tuesday and Thursday, 1-3 PM",
    contactInfo: "Office: Engineering Building, Room 210",
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@harvard.edu",
    institutionId: "harvard",
    department: "Business Administration",
    expertise: ["Strategic Management", "Entrepreneurship", "Innovation"],
    bio: "Dr. Rodriguez is an expert in strategic management and entrepreneurship. She has worked with numerous startups and established companies.",
    imageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    officeHours: "Friday, 10 AM - 12 PM",
    contactInfo: "Office: Business School, Room 405",
  },
  {
    id: "4",
    name: "Prof. David Wilson",
    email: "david.wilson@oxford.edu",
    institutionId: "oxford",
    department: "Medicine",
    expertise: ["Neuroscience", "Clinical Research", "Medical Ethics"],
    bio: "Professor Wilson is a renowned neuroscientist with extensive experience in clinical research. His work has contributed significantly to our understanding of neurological disorders.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    officeHours: "Monday and Thursday, 9-11 AM",
    contactInfo: "Office: Medical Sciences Building, Room 120",
  },
]

const StudentProfessors = () => {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null)
  const [messageContent, setMessageContent] = useState("")

  // Filter professors based on search term and active tab
  const filteredProfessors = professors.filter((prof) => {
    const matchesSearch =
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.expertise.some((exp) => exp.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return matchesSearch && prof.department.toLowerCase() === activeTab.toLowerCase()
  })

  // Get unique departments for tabs
  const departments = [...new Set(professors.map((prof) => prof.department))]

  const handleSendMessage = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Empty message",
        description: "Please enter a message to send",
        variant: "destructive",
      })
      return
    }

    // Simulate sending message
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${selectedProfessor?.name}`,
    })
    setMessageContent("")
  }

  return (
    <Layout>
      <div className="flex">
      <Sidebar role="student" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-studyportal-blue">Professors Directory</h1>
              <p className="text-gray-600 mt-2">Connect with professors from top universities</p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search professors, departments, expertise..."
                  className="pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Departments</TabsTrigger>
              {departments.map((dept) => (
                <TabsTrigger key={dept} value={dept}>
                  {dept}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredProfessors.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Professors Found</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchTerm
                        ? "No professors match your search criteria. Try different keywords."
                        : "There are no professors in this department yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProfessors.map((professor) => (
                    <ProfessorCard
                      key={professor.id}
                      professor={professor}
                      onContact={() => setSelectedProfessor(professor)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Contact Professor Dialog */}
          <Dialog open={!!selectedProfessor} onOpenChange={(open) => !open && setSelectedProfessor(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Contact Professor</DialogTitle>
                <DialogDescription>Send a message to {selectedProfessor?.name}</DialogDescription>
              </DialogHeader>

              {selectedProfessor && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedProfessor.imageUrl || "/placeholder.svg"}
                      alt={selectedProfessor.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{selectedProfessor.name}</h4>
                      <p className="text-sm text-gray-500">{selectedProfessor.department}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Your Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Write your message here..."
                      rows={5}
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setSelectedProfessor(null)}>
                      Cancel
                    </Button>
                    <Button className="bg-studyportal-blue hover:bg-blue-700" onClick={handleSendMessage}>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  )
}

interface ProfessorCardProps {
  professor: Professor
  onContact: () => void
}

const ProfessorCard = ({ professor, onContact }: ProfessorCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-48">
          <img
            src={professor.imageUrl || "/placeholder.svg"}
            alt={professor.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
            <div className="p-4 text-white">
              <h3 className="text-xl font-bold">{professor.name}</h3>
              <p>{professor.department}</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="space-y-3 mb-4">
            <div className="flex items-start">
              <Mail className="h-4 w-4 text-gray-500 mt-1 mr-2" />
              <span className="text-sm">{professor.email}</span>
            </div>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-500 mt-1 mr-2" />
              <span className="text-sm">{professor.contactInfo}</span>
            </div>
            <div className="flex items-start">
              <Calendar className="h-4 w-4 text-gray-500 mt-1 mr-2" />
              <span className="text-sm">{professor.officeHours}</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {professor.expertise.map((exp, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {exp}
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{professor.bio}</p>

          <div className="flex justify-between">
            <Button variant="outline" size="sm" className="text-studyportal-blue">
              <ExternalLink className="mr-1 h-3 w-3" />
              View Profile
            </Button>
            <Button size="sm" className="bg-studyportal-blue hover:bg-blue-700" onClick={onContact}>
              <Mail className="mr-1 h-3 w-3" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StudentProfessors
