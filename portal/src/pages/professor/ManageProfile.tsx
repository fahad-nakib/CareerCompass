"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Layout from "@/components/Layout"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { fetchProfessor, updateProfessor } from "@/pages/professor/professorService"
import { Loader2, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { Professor } from "@/models/types"

// Define the Professor type
const ManageProfile = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null)
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null)

  const [formData, setFormData] = useState<Professor>({
    id: "", // Default value for id
    institutionId: "", // Default value for institutionId
    name: "",
    email: "",
    contactInfo: "",
    officeHours: "",
    bio: "",
    imageUrl: null,
    institution: "",
    department: "",
    expertise: [],
  })

  useEffect(() => {
    const loadProfessorData = async () => {
      if (!user?.id) {
        setError("User ID not found")
        setLoading(false)
        return
      }

      try {
        const professorData = await fetchProfessor((user.id).toString())
        if (professorData && professorData.length > 0) {
          const professor = professorData[0]
          setFormData({
            id: professor.id,
            //userId: professor.userId || (user.id).toString(),
            name: professor.name || user.name || "",
            email: professor.email || user.email || "",
            contactInfo: professor.office || "",
            officeHours: professor.contactTime || "",
            expertise: Array.isArray(professor.expertise) ? professor.expertise : (professor.expertise ? [professor.expertise] : []),
            bio: professor.bio || "",
            imageUrl: professor.profilePicture || user.imageUrl || null,
            institution: professor.institution || "",
            department: professor.department || "",
            specialization: professor.specialization || [],
            institutionId: professor.institutionId || "", // Ensure institutionId is included
          })
        } else {
          // If no professor data exists, initialize with user data
          setFormData({
            id: (user.id).toString(),
            name: user.name || "",
            email: user.email || "",
            contactInfo: "",
            officeHours: "",
            expertise: [],
            bio: "",
            imageUrl: user.imageUrl || null,
            institution: "",
            department: "", // Ensure department is included
            institutionId: "", // Ensure institutionId is included
          })
        }
      } catch (err) {
        console.error("Error fetching professor data:", err)
        setError("Failed to load professor data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadProfessorData()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Profile picture must be less than 5MB",
          variant: "destructive",
        })
        return
      }

      setProfilePictureFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfilePicturePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      toast({
        title: "Error",
        description: "User ID not found",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Handle profile picture upload if there's a new file
      let profilePictureUrl = formData.imageUrl

      if (profilePictureFile) {
        // In a real implementation, you would upload the file to your server or a storage service
        // and get back a URL. For this example, we'll simulate that.

        // This is a placeholder. In a real app, you'd upload the file and get a URL back
        profilePictureUrl = URL.createObjectURL(profilePictureFile)

        // In a real implementation, you might do something like:
        // const formData = new FormData()
        // formData.append('file', profilePictureFile)
        // const response = await fetch('/api/upload', { method: 'POST', body: formData })
        // const data = await response.json()
        // profilePictureUrl = data.url
      }

      const updatedProfessor: Professor = {
        ...formData,
        imageUrl: profilePictureUrl,
      }

      // If the professor already exists, update it; otherwise, create a new one
      if (formData.id) {
        await updateProfessor((user.id).toString(), {
          ...updatedProfessor, expertise: updatedProfessor.expertise.join(", "),
          institution_id: ""
        })
      } else {
        // In a real implementation, you would call postProfessor here
        // await postProfessor(updatedProfessor)
        console.log("Would create new professor:", updatedProfessor)
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      })

      // Navigate back to dashboard
      navigate("/professor/dashboard")
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again later.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-studyportal-blue" />
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-studyportal-blue mb-6">Manage Profile</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Picture Section */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your profile image</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={profilePicturePreview || formData.imageUrl || ""} alt={formData.name} />
                  <AvatarFallback className="text-4xl">{formData.name?.charAt(0) || "P"}</AvatarFallback>
                </Avatar>

                <Label
                  htmlFor="profilePicture"
                  className="cursor-pointer bg-studyportal-blue hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Picture
                </Label>
                <Input
                  id="profilePicture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
                <p className="text-xs text-gray-500 mt-2">Recommended: Square image, max 5MB</p>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" name="department" value={formData.department} onChange={handleInputChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How students can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="office">Office Location</Label>
                    <Input
                      id="office"
                      name="office"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      placeholder="Building and room number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactTime">Office Hours</Label>
                    <Input
                      id="contactTime"
                      name="contactTime"
                      value={formData.officeHours}
                      onChange={handleInputChange}
                      placeholder="e.g., Mon/Wed 2-4pm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Share your background and expertise</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experiences">Professional Experience</Label>
                  <Textarea
                    id="experiences"
                    name="experiences"
                    value={formData.expertise}
                    onChange={handleInputChange}
                    placeholder="Share your work experience, research, and achievements"
                    className="min-h-[150px]"
                  />
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label htmlFor="description">About Me</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell students about yourself, your teaching philosophy, and research interests"
                    className="min-h-[150px]"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/professor/dashboard")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-studyportal-blue hover:bg-blue-700" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default ManageProfile
