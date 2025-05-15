"use client"

import type React from "react"
import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { Building, Check, FileText } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { saveUsers } from "@/services/authService" // Import the saveUsers function

// Import the User type from the models/types file
import type { User as APIUser } from "@/models/types"

// Extend the imported User type to include the document property
interface User extends APIUser {
  document?: File
}

const InstitutionRegistration = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [document, setDocument] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocument(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create user object for API
      const userData: User = {
        name,
        email,
        password,
        website,
        location,
        description,
        role: "institution",
        isRegistered: false,
        isApproved: false,
        id: 0,
        imageUrl: null
      }

      // Add document if it exists
      if (document) {
        userData.document = document
      }

      // Call the API to save the user
      const response = await saveUsers(userData)

      // Handle successful registration
      

      // If you need to login the user after registration
      // You might need to adjust this based on what your API returns
      if (response) {
        toast({
          title: "Registration successful",
          description: "Your institution has been registered and is pending approval by an administrator. You will be notified once approved.",
        })
        
      }
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Failed to register",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-col items-center space-y-2 pb-2">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center">
              <Building className="h-10 w-10 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold text-center">Institution Registration</h1>
            <p className="text-gray-500 text-center">Register your institution to connect with potential students</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Institution Name</Label>
                <Input
                  id="name"
                  placeholder="University of Example"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-blue-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://www.university.edu"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Institution Description</Label>
                <Textarea
                  id="description"
                  placeholder="Tell us about your institution..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              {/* Document Upload Section - ADDED */}
              <div className="space-y-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                <Label htmlFor="document" className="font-medium">
                  Upload Verification Document
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="document"
                    type="file"
                    onChange={handleDocumentChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </div>
                {document && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    <span>
                      Selected: {document.name} ({(document.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                )}
                <p className="text-xs text-gray-600 mt-1">
                  Please upload an official document that verifies your institution's identity (e.g., accreditation
                  certificate, registration document). Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="•••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-blue-50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="•••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span>Showcase your educational programs to a global audience</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span>Manage applications and student inquiries</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <Check className="h-5 w-5 text-gray-600 mt-0.5" />
                  <span>Post BSc, MS, and PhD program details</span>
                </div>
              </div>

              <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Institution accounts require approval from system administrators before full
                  access is granted.
                </p>
              </div>

              <Button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register Institution"}
              </Button>

              <div className="text-center text-sm pt-2">
                <span className="text-gray-600">Already have an account?</span>{" "}
                <Link to="/login" className="text-gray-900 font-medium">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default InstitutionRegistration
