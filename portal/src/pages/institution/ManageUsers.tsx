"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { registerProfessor, registerAdmissionOfficer } from "@/services/authService"
import { GraduationCap, Users, CheckCircle } from "lucide-react"

const ManageUsers = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("professors")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Professor form state
  const [professorForm, setProfessorForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    expertise: "",
    bio: "",
  })

  // Admission Officer form state
  const [officerForm, setOfficerForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admission_officer",
  })

  const handleProfessorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfessorForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleOfficerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setOfficerForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfessorSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add professors",
        variant: "destructive",
      })
      return
    }

    // Validate form
    if (!professorForm.name || !professorForm.email || !professorForm.password || !professorForm.department) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Convert expertise string to array
      const expertiseArray = professorForm.expertise
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")

      await registerProfessor({
        name: professorForm.name,
        email: professorForm.email,
        password: professorForm.password,
        department: professorForm.department,
        expertise: expertiseArray,
        bio: professorForm.bio,
        institutionId: user.id,
        institutionName: user.name,
      })

      toast({
        title: "Professor added",
        description: "The professor has been successfully added to your institution.",
      })

      setSuccessMessage(`Professor ${professorForm.name} has been added successfully.`)

      // Reset form
      setProfessorForm({
        name: "",
        email: "",
        password: "",
        department: "",
        expertise: "",
        bio: "",
      })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    } catch (error) {
      console.error("Error adding professor:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the professor. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOfficerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add admission officers",
        variant: "destructive",
      })
      return
    }

    // Validate form
    if (!officerForm.name || !officerForm.email || !officerForm.password) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await registerAdmissionOfficer({
        name: officerForm.name,
        email: officerForm.email,
        password: officerForm.password,
        institutionId: user.id,
        institutionName: user.name,
      })

      toast({
        title: "Admission Officer added",
        description: "The admission officer has been successfully added to your institution.",
      })

      setSuccessMessage(`Admission Officer ${officerForm.name} has been added successfully.`)

      // Reset form
      setOfficerForm({
        name: "",
        email: "",
        password: "",
        role: "admission_officer",
      })

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 5000)
    } catch (error) {
      console.error("Error adding admission officer:", error)
      toast({
        title: "Error",
        description: "There was a problem adding the admission officer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Manage Staff</h1>
            <p className="text-gray-600 mt-2">Add professors and admission officers to your institution</p>
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <div>
              <p className="font-medium text-green-800">{successMessage}</p>
              <p className="text-sm text-green-600">The user can now log in with their credentials.</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="professors" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="professors" className="flex items-center">
              <GraduationCap className="mr-2 h-4 w-4" />
              Add Professor
            </TabsTrigger>
            <TabsTrigger value="officers" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Add Admission Officer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="professors">
            <Card>
              <CardHeader>
                <CardTitle>Add New Professor</CardTitle>
                <CardDescription>
                  Add a professor who can interact with students and provide recommendation letters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfessorSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name*</Label>
                      <Input
                        id="name"
                        name="name"
                        value={professorForm.name}
                        onChange={handleProfessorChange}
                        placeholder="Dr. John Smith"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={professorForm.email}
                        onChange={handleProfessorChange}
                        placeholder="professor@university.edu"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password*</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={professorForm.password}
                        onChange={handleProfessorChange}
                        placeholder="Create a secure password"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Password must be at least 8 characters long with letters and numbers
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department*</Label>
                      <Input
                        id="department"
                        name="department"
                        value={professorForm.department}
                        onChange={handleProfessorChange}
                        placeholder="e.g. Computer Science"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expertise">Areas of Expertise</Label>
                    <Input
                      id="expertise"
                      name="expertise"
                      value={professorForm.expertise}
                      onChange={handleProfessorChange}
                      placeholder="e.g. Machine Learning, Artificial Intelligence, Data Science"
                    />
                    <p className="text-xs text-gray-500">Separate multiple areas with commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={professorForm.bio}
                      onChange={handleProfessorChange}
                      placeholder="Brief professional biography and research interests"
                      rows={4}
                    />
                  </div>

                  <Button type="submit" className="bg-studyportal-blue hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Adding Professor..." : "Add Professor"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="officers">
            <Card>
              <CardHeader>
                <CardTitle>Add New Admission Officer</CardTitle>
                <CardDescription>
                  Add an admission officer who can review applications and manage the admission process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleOfficerSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="officer-name">Full Name*</Label>
                      <Input
                        id="officer-name"
                        name="name"
                        value={officerForm.name}
                        onChange={handleOfficerChange}
                        placeholder="Jane Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officer-email">Email Address*</Label>
                      <Input
                        id="officer-email"
                        name="email"
                        type="email"
                        value={officerForm.email}
                        onChange={handleOfficerChange}
                        placeholder="officer@university.edu"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="officer-password">Password*</Label>
                      <Input
                        id="officer-password"
                        name="password"
                        type="password"
                        value={officerForm.password}
                        onChange={handleOfficerChange}
                        placeholder="Create a secure password"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Password must be at least 8 characters long with letters and numbers
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officer-role">Role</Label>
                      <Select
                        value={officerForm.role}
                        onValueChange={(value) => setOfficerForm((prev) => ({ ...prev, role: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admission_officer">Admission Officer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="bg-studyportal-blue hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Adding Officer..." : "Add Admission Officer"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default ManageUsers
