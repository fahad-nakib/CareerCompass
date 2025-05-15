"use client"
import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Award, Calendar, DollarSign, Users, PlusCircle, Edit, Trash2, CheckCircle, XCircle } from "lucide-react"
import type { Scholarship } from "@/models/types"

// Mock data - would come from services in a real implementation
const mockScholarships: Scholarship[] = [
  {
    id: "1",
    institutionId: "inst_1",
    title: "Computer Science Excellence Scholarship",
    description: "Awarded to outstanding students pursuing a degree in Computer Science with a GPA of 3.5 or higher.",
    amount: "$10,000 per year",
    deadline: "2023-12-15",
    eligibilityCriteria: [
      "Minimum GPA of 3.5",
      "Enrolled in Computer Science program",
      "Demonstrated leadership skills",
      "Financial need",
    ],
    programIds: ["1", "6"],
    isActive: true,
  },
  {
    id: "2",
    institutionId: "inst_1",
    title: "International Student Merit Scholarship",
    description:
      "Designed to support international students with exceptional academic achievements and leadership potential.",
    amount: "$15,000 per year",
    deadline: "2023-11-30",
    eligibilityCriteria: [
      "International student status",
      "Minimum GPA of 3.3",
      "Demonstrated financial need",
      "Strong leadership qualities",
    ],
    programIds: ["2", "7"],
    isActive: true,
  },
  {
    id: "3",
    institutionId: "inst_1",
    title: "STEM Women's Scholarship",
    description: "Supporting women pursuing degrees in Science, Technology, Engineering, and Mathematics fields.",
    amount: "$8,000 per year",
    deadline: "2024-01-15",
    eligibilityCriteria: [
      "Female student",
      "Enrolled in STEM program",
      "Minimum GPA of 3.0",
      "Demonstrated interest in promoting diversity in STEM",
    ],
    programIds: ["1", "4", "6"],
    isActive: false,
  },
]

const InstitutionScholarships = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [scholarships, setScholarships] = useState<Scholarship[]>(mockScholarships)
  const [isAddingScholarship, setIsAddingScholarship] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null)
  const [activeTab, setActiveTab] = useState("active")

  // New scholarship form state
  const [newScholarship, setNewScholarship] = useState<Omit<Scholarship, "id" | "institutionId" | "isActive">>({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    eligibilityCriteria: [""],
    programIds: [],
  })

  const handleAddCriteria = () => {
    setNewScholarship({
      ...newScholarship,
      eligibilityCriteria: [...newScholarship.eligibilityCriteria, ""],
    })
  }

  const handleRemoveCriteria = (index: number) => {
    const updatedCriteria = [...newScholarship.eligibilityCriteria]
    updatedCriteria.splice(index, 1)
    setNewScholarship({
      ...newScholarship,
      eligibilityCriteria: updatedCriteria,
    })
  }

  const handleCriteriaChange = (index: number, value: string) => {
    const updatedCriteria = [...newScholarship.eligibilityCriteria]
    updatedCriteria[index] = value
    setNewScholarship({
      ...newScholarship,
      eligibilityCriteria: updatedCriteria,
    })
  }

  const handleCreateScholarship = () => {
    // Validate form
    if (!newScholarship.title || !newScholarship.amount || !newScholarship.deadline) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Filter out empty criteria
    const filteredCriteria = newScholarship.eligibilityCriteria.filter((c) => c.trim() !== "")

    if (filteredCriteria.length === 0) {
      toast({
        title: "Missing eligibility criteria",
        description: "Please add at least one eligibility criterion",
        variant: "destructive",
      })
      return
    }

    const scholarship: Scholarship = {
      id: `scholarship_${Date.now()}`,
      institutionId: user?.id || "",
      isActive: true,
      ...newScholarship,
      eligibilityCriteria: filteredCriteria,
    }

    setScholarships([...scholarships, scholarship])

    // Reset form
    setNewScholarship({
      title: "",
      description: "",
      amount: "",
      deadline: "",
      eligibilityCriteria: [""],
      programIds: [],
    })

    setIsAddingScholarship(false)

    toast({
      title: "Scholarship created",
      description: "Your scholarship has been created successfully",
    })
  }

  const handleToggleActive = (id: string) => {
    setScholarships(scholarships.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s)))

    const scholarship = scholarships.find((s) => s.id === id)

    toast({
      title: scholarship?.isActive ? "Scholarship deactivated" : "Scholarship activated",
      description: scholarship?.isActive
        ? "The scholarship is now hidden from students"
        : "The scholarship is now visible to students",
    })
  }

  const handleDeleteScholarship = (id: string) => {
    setScholarships(scholarships.filter((s) => s.id !== id))

    toast({
      title: "Scholarship deleted",
      description: "The scholarship has been permanently removed",
    })
  }

  const activeScholarships = scholarships.filter((s) => s.isActive)
  const inactiveScholarships = scholarships.filter((s) => !s.isActive)

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Scholarships Management</h1>
            <p className="text-gray-600 mt-2">Create and manage scholarships for your institution</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button className="bg-studyportal-blue hover:bg-blue-700" onClick={() => setIsAddingScholarship(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Scholarship
            </Button>
          </div>
        </div>

        {/* Scholarships Tabs */}
        <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="active" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Active
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {activeScholarships.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="inactive" className="flex items-center">
              <XCircle className="mr-2 h-4 w-4" />
              Inactive
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {inactiveScholarships.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeScholarships.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Award className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Active Scholarships</h3>
                  <p className="text-gray-500 text-center max-w-md mb-6">
                    You don't have any active scholarships. Create a new scholarship to attract talented students to
                    your programs.
                  </p>
                  <Button
                    className="bg-studyportal-blue hover:bg-blue-700"
                    onClick={() => setIsAddingScholarship(true)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Your First Scholarship
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteScholarship}
                    onEdit={setEditingScholarship}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="inactive">
            {inactiveScholarships.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Inactive Scholarships</h3>
                  <p className="text-gray-500 text-center max-w-md">You don't have any inactive scholarships.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {inactiveScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onToggleActive={handleToggleActive}
                    onDelete={handleDeleteScholarship}
                    onEdit={setEditingScholarship}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Add Scholarship Dialog */}
        <Dialog open={isAddingScholarship} onOpenChange={setIsAddingScholarship}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Scholarship</DialogTitle>
              <DialogDescription>Add a new scholarship to attract talented students to your programs</DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Scholarship Title*</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Merit Scholarship"
                    value={newScholarship.title}
                    onChange={(e) => setNewScholarship({ ...newScholarship, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Scholarship Amount*</Label>
                  <Input
                    id="amount"
                    placeholder="e.g. $5,000 per year"
                    value={newScholarship.amount}
                    onChange={(e) => setNewScholarship({ ...newScholarship, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the scholarship and its purpose..."
                  value={newScholarship.description}
                  onChange={(e) => setNewScholarship({ ...newScholarship, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline*</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newScholarship.deadline}
                  onChange={(e) => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Eligibility Criteria*</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddCriteria}>
                    Add Criterion
                  </Button>
                </div>

                {newScholarship.eligibilityCriteria.map((criterion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`Criterion ${index + 1}`}
                      value={criterion}
                      onChange={(e) => handleCriteriaChange(index, e.target.value)}
                    />
                    {newScholarship.eligibilityCriteria.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCriteria(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddingScholarship(false)}>
                  Cancel
                </Button>
                <Button className="bg-studyportal-blue hover:bg-blue-700" onClick={handleCreateScholarship}>
                  Create Scholarship
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Scholarship Dialog - Similar to Add but pre-populated */}
        <Dialog open={!!editingScholarship} onOpenChange={(open) => !open && setEditingScholarship(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Scholarship</DialogTitle>
              <DialogDescription>Update the details of your scholarship</DialogDescription>
            </DialogHeader>

            {/* Edit form would go here - similar to the add form but pre-populated */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingScholarship(null)}>
                Cancel
              </Button>
              <Button className="bg-studyportal-blue hover:bg-blue-700">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  )
}

interface ScholarshipCardProps {
  scholarship: Scholarship
  onToggleActive: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (scholarship: Scholarship) => void
}

const ScholarshipCard = ({ scholarship, onToggleActive, onDelete, onEdit }: ScholarshipCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{scholarship.title}</CardTitle>
          <div className="flex items-center">
            <Label htmlFor={`active-${scholarship.id}`} className="mr-2 text-sm">
              {scholarship.isActive ? "Active" : "Inactive"}
            </Label>
            <Switch
              id={`active-${scholarship.id}`}
              checked={scholarship.isActive}
              onCheckedChange={() => onToggleActive(scholarship.id)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-gray-600">{scholarship.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-studyportal-blue mr-2" />
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{scholarship.amount}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-studyportal-blue mr-2" />
              <div>
                <p className="text-sm text-gray-500">Deadline</p>
                <p className="font-medium">{new Date(scholarship.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Eligibility Criteria</h4>
            <ul className="list-disc pl-5 space-y-1">
              {scholarship.eligibilityCriteria.map((criterion, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {criterion}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center">
              <Users className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">{scholarship.programIds?.length || 0} associated programs</span>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(scholarship)}>
                <Edit size={16} className="mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:bg-red-50 hover:text-red-500"
                onClick={() => onDelete(scholarship.id)}
              >
                <Trash2 size={16} className="mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default InstitutionScholarships
