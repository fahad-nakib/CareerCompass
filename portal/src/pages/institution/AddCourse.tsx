"use client"

import type React from "react"
import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { addProgram, addRequirments } from "@/services/programsService"
import { useToast } from "@/hooks/use-toast"

const AddCourse = () => {
  const { user } = useAuth()
  //console.log("User in AddCourse:", user);
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const myReq = ["adfaf","dsfasdfa","dsfdsfds"];
  //addRequirments(myReq, "Green University of Bangladesh_Computer Science and Engineering}");


  // Form state
  const [formData, setFormData] = useState({
    title: "",
    degree: "Bachelor",
    duration: "",
    tuition: "",
    description: "",
    location: "",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f",
    startDate: "",
    deadline: "",
    language: "English",
    requirements: "",
    applicationFee: "",
    scholarshipsAvailable: false,
    ranking: "",
    department: "",
  })
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to add programs",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const requirementsArray = formData.requirements
        .split("\n")
        .map((item) => item.trim())
        .filter((item) => item !== "")
      //id: `${(user.name).slice(0, 10)}_${(formData.title).slice(0, 10)}`,
      const newProgram = {
        ...formData,
        university: user.name,
        id: `${user.id}_${Date.now()}`,
        requirements: requirementsArray,
        ranking: formData.ranking, // Add a default or appropriate value
        institutionId: (user.id).toString(), // Assuming `user` contains `institutionId`
        level: formData.degree as "Bachelors" | "Masters" | "PhD" | "Certificate" | "Diploma",
        tuitionFee: formData.tuition, // Map `tuition` to `tuitionFee`
        scholarships: formData.scholarshipsAvailable,
        discipline: formData.title,
        applicationFee: formData.applicationFee,
        // Add other required fields with appropriate values
      }

      console.log("Requirments Array:", requirementsArray);
      addProgram(newProgram)
      addRequirments(newProgram.requirements, newProgram.id );

      
      toast({
        title: "Program added successfully",
        description: "Your new program has been added to the platform.",
      })

      navigate("/institution/dashboard")
    } catch (error) {
      toast({
        title: "Error adding program",
        description: "There was a problem adding your program. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-studyportal-blue mb-8">Add New Educational Program</h1>

          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Program Title*</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="e.g. Computer Science"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department*</Label>
                      <Input
                        id="department"
                        name="department"
                        placeholder="e.g. Engineering"
                        value={formData.department}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree Type*</Label>
                      <Select
                        name="degree"
                        value={formData.degree}
                        onValueChange={(value) => handleSelectChange("degree", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select degree type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Bachelor">Bachelor's Degree</SelectItem>
                          <SelectItem value="Master">Master's Degree</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location*</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="e.g. New York, USA"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration*</Label>
                      <Input
                        id="duration"
                        name="duration"
                        placeholder="e.g. 4 years"
                        value={formData.duration}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tuition">Tuition Fee*</Label>
                      <Input
                        id="tuition"
                        name="tuition"
                        placeholder="e.g. $10,000 per year"
                        value={formData.tuition}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ranking">Ranking*</Label>
                      <Input
                        id="ranking"
                        name="ranking"
                        placeholder="e.g. 1"
                        value={formData.ranking}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applicationFee">Application Fee*</Label>
                      <Input
                        id="applicationFee"
                        name="applicationFee"
                        placeholder="e.g. 1"
                        value={formData.applicationFee}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Program Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the program, its objectives, and benefits..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                {/* Additional Information */}
                

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date*</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        placeholder="e.g. 2025-12-15"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline">Application Deadline</Label>
                      <Input
                        id="deadline"
                        name="deadline"
                        placeholder="e.g. 2025-12-15"
                        value={formData.deadline}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language of Instruction</Label>
                      <Input
                        id="language"
                        name="language"
                        placeholder="e.g. English"
                        value={formData.language}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-2">
                      <Label htmlFor="scholarshipsAvailable" className="block mb-2">
                        Scholarships Available
                      </Label>
                      <div className="flex items-center">
                        <Switch
                          id="scholarshipsAvailable"
                          checked={formData.scholarshipsAvailable}
                          onCheckedChange={(checked) => handleSwitchChange("scholarshipsAvailable", checked)}
                        />
                        <span className="ml-2 text-sm text-gray-600">{formData.scholarshipsAvailable ? "Yes" : "No"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="requirements">Entry Requirements</Label>
                  <Textarea
                    id="requirements"
                    name="requirements"
                    placeholder="List each requirement on a new line..."
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">Enter each requirement on a new line.</p>
                </div>

                {/* Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Program Image URL</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={handleChange}
                  />
                  <p className="text-sm text-gray-500">A default image will be used if none is provided.</p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate("/institution/dashboard")}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-studyportal-blue hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? "Adding Program..." : "Add Program"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default AddCourse
