"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useParams, useNavigate } from "react-router-dom"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { addApplication } from "@/services/programsService"
import { getPrograms } from "@/services/programService"
import { FileText, CreditCard, CheckCircle, HelpCircle, AlertCircle } from "lucide-react"
import type { Program, Document } from "@/models/types"

// Mock SOP templates
const sopTemplates = [
  {
    id: "1",
    title: "General Graduate Program Template",
    content:
      "Dear Admissions Committee,\n\nI am writing to express my interest in the [PROGRAM_NAME] at [UNIVERSITY_NAME]. With my background in [YOUR_BACKGROUND], I am excited about the opportunity to further my education in this field.\n\n[PARAGRAPH ABOUT YOUR ACADEMIC BACKGROUND]\n\n[PARAGRAPH ABOUT YOUR PROFESSIONAL EXPERIENCE]\n\n[PARAGRAPH ABOUT WHY THIS SPECIFIC PROGRAM]\n\n[PARAGRAPH ABOUT YOUR FUTURE GOALS]\n\nThank you for considering my application. I look forward to the possibility of joining your esteemed institution.\n\nSincerely,\n[YOUR_NAME]",
    tips: [
      "Be specific about why you're interested in this particular program",
      "Connect your past experiences to your future goals",
      "Highlight unique qualities that set you apart",
      "Proofread carefully for grammar and spelling errors",
    ],
  },
  {
    id: "2",
    title: "Computer Science Master's Template",
    content:
      "Dear Admissions Committee,\n\nI am writing to apply for the Master's program in Computer Science at [UNIVERSITY_NAME]. As a graduate with a Bachelor's degree in [YOUR_DEGREE], I am eager to deepen my knowledge in [SPECIFIC_AREA] under the guidance of your distinguished faculty.\n\n[PARAGRAPH ABOUT YOUR TECHNICAL SKILLS AND PROJECTS]\n\n[PARAGRAPH ABOUT RELEVANT WORK OR RESEARCH EXPERIENCE]\n\n[PARAGRAPH ABOUT SPECIFIC COURSES OR RESEARCH OPPORTUNITIES AT THE UNIVERSITY]\n\n[PARAGRAPH ABOUT HOW THIS PROGRAM ALIGNS WITH YOUR CAREER GOALS]\n\nThank you for considering my application. I am excited about the prospect of contributing to and learning from your academic community.\n\nSincerely,\n[YOUR_NAME]",
    tips: [
      "Mention specific technical skills and projects relevant to your application",
      "Reference faculty members whose research aligns with your interests",
      "Discuss how this program will help you achieve your career goals",
      "Include any relevant publications or conference presentations",
    ],
    programType: "Master",
    discipline: "Computer Science",
  },
]

const ApplicationForm: React.FC = () => {
  const { id: programId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [activeStep, setActiveStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [program, setProgram] = useState<Program | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    statementOfPurpose: "",
    agreeToTerms: false,
  })
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [newDocument, setNewDocument] = useState<Partial<Document>>({
    name: "",
    type: "transcript",
  })
  const [file, setFile] = useState<File | null>(null)
  const [showSopGuidance, setShowSopGuidance] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("credit")

  // Form state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    country: "",
  })

  const [academicInfo, setAcademicInfo] = useState({
    degree: "",
    institution: "",
    graduationYear: "",
    gpa: "",
    relevantCourses: "",
  })

  const [sopInfo, setSopInfo] = useState({
    sop: "",
    selectedTemplateId: "",
  })

  const [documentState, setDocumentState] = useState({
    transcript: null as File | null,
    certificate: null as File | null,
    identification: null as File | null,
    additionalDocs: [] as File[],
  })

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    agreeToTerms: false,
  })

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        setLoading(true)
        const programs = getPrograms()
        const foundProgram = programs.find((p) => p.id === programId)

        if (foundProgram) {
          setProgram(foundProgram)
        } else {
          console.error("Program not found with ID:", programId)
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching program data:", error)
        setLoading(false)
      }
    }

    fetchProgramData()
  }, [programId])

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = sopTemplates.find((t) => t.id === templateId)
    if (template) {
      // Replace placeholders with actual values
      const content = template.content
        .replace("[PROGRAM_NAME]", program?.title || "")
        .replace("[UNIVERSITY_NAME]", program?.university || "")
        .replace("[YOUR_NAME]", `${personalInfo.firstName} ${personalInfo.lastName}`)

      setSopInfo({
        ...sopInfo,
        selectedTemplateId: templateId,
        sop: content,
      })
    }
  }

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPersonalInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleAcademicInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAcademicInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleSopChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSopInfo((prev) => ({ ...prev, sop: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof documentState) => {
    if (e.target.files && e.target.files[0]) {
      if (type === "additionalDocs") {
        setDocumentState((prev) => ({
          ...prev,
          additionalDocs: [...prev.additionalDocs, e.target.files![0]],
        }))
      } else {
        setDocumentState((prev) => ({
          ...prev,
          [type]: e.target.files![0],
        }))
      }
    }
  }

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewDocument((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleAddDocument = () => {
    if (!newDocument.name || !file) {
      alert("Please provide a document name and file")
      return
    }

    // In a real app, upload file to server and get URL
    const fileUrl = URL.createObjectURL(file)

    const document: Document = {
      id: Date.now().toString(),
      studentId: (user?.id).toString() || "",
      name: newDocument.name || "",
      type: (newDocument.type as Document["type"]) || "other",
      file: fileUrl,
      uploadDate: new Date().toISOString(),
      verified: false,
    }

    setDocuments([...documents, document])
    setNewDocument({
      name: "",
      type: "transcript",
    })
    setFile(null)
  }

  const handlePaymentCheckboxChange = (checked: boolean) => {
    setPaymentInfo((prev) => ({ ...prev, agreeToTerms: checked }))
  }

  const handleNextStep = () => {
    // Validate current step
    if (activeStep === 1) {
      if (!personalInfo.firstName || !personalInfo.lastName || !personalInfo.email) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    } else if (activeStep === 2) {
      if (!academicInfo.degree || !academicInfo.institution || !academicInfo.graduationYear) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields",
          variant: "destructive",
        })
        return
      }
    } else if (activeStep === 3) {
      if (!sopInfo.sop) {
        toast({
          title: "Missing Statement of Purpose",
          description: "Please write or select a Statement of Purpose template",
          variant: "destructive",
        })
        return
      }
    } else if (activeStep === 4) {
      if (!documentState.transcript || !documentState.identification) {
        toast({
          title: "Missing documents",
          description: "Please upload all required documents",
          variant: "destructive",
        })
        return
      }
    }

    setActiveStep((prev) => prev + 1)
  }

  const handlePrevStep = () => {
    setActiveStep((prev) => prev - 1)
  }

  const handleSubmit = () => {
    if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      toast({
        title: "Missing payment information",
        description: "Please fill in all payment details",
        variant: "destructive",
      })
      return
    }

    if (!paymentInfo.agreeToTerms) {
      toast({
        title: "Terms and conditions",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate application submission
    setTimeout(() => {
      if (program && user) {
        try {
          addApplication(program.id, user.id.toString(), user.name,sopInfo.sop)
          toast({
            title: "Application submitted",
            description: "Your application has been successfully submitted!",
          })
          navigate("/student/applications")
        } catch (error) {
          toast({
            title: "Application failed",
            description: "There was an error submitting your application. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Application failed",
          description: "Missing program or user information",
          variant: "destructive",
        })
      }
      setIsSubmitting(false)
    }, 2000)
  }

  if (!program) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-studyportal-blue mb-4">Program Not Found</h1>
          <p className="mb-8">The program you're trying to apply for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/student/dashboard")}>Back to Dashboard</Button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-studyportal-blue">Application Form</h1>
            <p className="text-gray-600 mt-2">
              Applying for <span className="font-medium">{program.title}</span> at{" "}
              <span className="font-medium">{program.university}</span>
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div
                className={`flex flex-col items-center ${activeStep >= 1 ? "text-studyportal-blue" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    activeStep >= 1 ? "bg-studyportal-blue text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  1
                </div>
                <span className="text-xs">Personal Info</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 2 ? "bg-studyportal-blue" : "bg-gray-200"}`} />
              <div
                className={`flex flex-col items-center ${activeStep >= 2 ? "text-studyportal-blue" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    activeStep >= 2 ? "bg-studyportal-blue text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  2
                </div>
                <span className="text-xs">Academic Info</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 3 ? "bg-studyportal-blue" : "bg-gray-200"}`} />
              <div
                className={`flex flex-col items-center ${activeStep >= 3 ? "text-studyportal-blue" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    activeStep >= 3 ? "bg-studyportal-blue text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="text-xs">Statement of Purpose</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 4 ? "bg-studyportal-blue" : "bg-gray-200"}`} />
              <div
                className={`flex flex-col items-center ${activeStep >= 4 ? "text-studyportal-blue" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    activeStep >= 4 ? "bg-studyportal-blue text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  4
                </div>
                <span className="text-xs">Documents</span>
              </div>
              <div className={`h-1 flex-1 mx-2 ${activeStep >= 5 ? "bg-studyportal-blue" : "bg-gray-200"}`} />
              <div
                className={`flex flex-col items-center ${activeStep >= 5 ? "text-studyportal-blue" : "text-gray-400"}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                    activeStep >= 5 ? "bg-studyportal-blue text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  5
                </div>
                <span className="text-xs">Payment</span>
              </div>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Step 1: Personal Information */}
              {activeStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Personal Information</h2>
                    <p className="text-gray-600 mb-6">Please provide your personal details for this application</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name*</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={personalInfo.firstName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name*</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={personalInfo.lastName}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={handlePersonalInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={personalInfo.address}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={personalInfo.country}
                      onChange={handlePersonalInfoChange}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Academic Information */}
              {activeStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Academic Information</h2>
                    <p className="text-gray-600 mb-6">Please provide details about your educational background</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="degree">Highest Degree Earned*</Label>
                      <Input
                        id="degree"
                        name="degree"
                        placeholder="e.g. Bachelor of Science"
                        value={academicInfo.degree}
                        onChange={handleAcademicInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution*</Label>
                      <Input
                        id="institution"
                        name="institution"
                        placeholder="e.g. University of California"
                        value={academicInfo.institution}
                        onChange={handleAcademicInfoChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year*</Label>
                      <Input
                        id="graduationYear"
                        name="graduationYear"
                        placeholder="e.g. 2022"
                        value={academicInfo.graduationYear}
                        onChange={handleAcademicInfoChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gpa">GPA</Label>
                      <Input
                        id="gpa"
                        name="gpa"
                        placeholder="e.g. 3.8/4.0"
                        value={academicInfo.gpa}
                        onChange={handleAcademicInfoChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="relevantCourses">Relevant Courses</Label>
                    <Textarea
                      id="relevantCourses"
                      name="relevantCourses"
                      placeholder="List relevant courses you've taken"
                      value={academicInfo.relevantCourses}
                      onChange={handleAcademicInfoChange}
                      rows={4}
                    />
                    <p className="text-xs text-gray-500">Separate courses with commas</p>
                  </div>
                </div>
              )}

              {/* Step 3: Statement of Purpose */}
              {activeStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Statement of Purpose</h2>
                    <p className="text-gray-600 mb-6">
                      Write a statement explaining why you're applying to this program
                    </p>
                  </div>

                  <Tabs defaultValue="write">
                    <TabsList className="mb-4">
                      <TabsTrigger value="write">Write Your Own</TabsTrigger>
                      <TabsTrigger value="template">Use Template</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write">
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Write your statement of purpose here..."
                          value={sopInfo.sop}
                          onChange={handleSopChange}
                          rows={12}
                          className="font-mono"
                        />
                        <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                          <div className="flex items-start">
                            <HelpCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-yellow-800">Tips for a Strong Statement</h4>
                              <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-yellow-700">
                                <li>Be specific about why you're interested in this program</li>
                                <li>Connect your past experiences to your future goals</li>
                                <li>Highlight unique qualities that set you apart</li>
                                <li>Keep it concise and focused (500-800 words)</li>
                                <li>Proofread carefully for grammar and spelling errors</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="template">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {sopTemplates.map((template) => (
                            <Card
                              key={template.id}
                              className={`cursor-pointer transition-all ${
                                sopInfo.selectedTemplateId === template.id
                                  ? "ring-2 ring-studyportal-blue"
                                  : "hover:shadow-md"
                              }`}
                              onClick={() => handleTemplateSelect(template.id)}
                            >
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{template.title}</CardTitle>
                                <CardDescription>
                                  {template.programType && template.discipline
                                    ? `For ${template.programType} in ${template.discipline}`
                                    : "General template"}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                  {template.content.substring(0, 150)}...
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {sopInfo.selectedTemplateId && (
                          <div className="mt-6">
                            <Label htmlFor="sop-template">Edit Template</Label>
                            <Textarea
                              id="sop-template"
                              value={sopInfo.sop}
                              onChange={handleSopChange}
                              rows={12}
                              className="font-mono mt-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Customize this template to fit your personal experience and goals
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {/* Step 4: Documents */}
              {activeStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Upload Documents</h2>
                    <p className="text-gray-600 mb-6">Please upload the required documents for your application</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="transcript">
                        Academic Transcript* <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="transcript"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, "transcript")}
                          required
                        />
                        {documentState.transcript && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Uploaded</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">PDF, JPG or PNG format (max 5MB)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="certificate">Degree Certificate</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="certificate"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, "certificate")}
                        />
                        {documentState.certificate && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Uploaded</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">PDF, JPG or PNG format (max 5MB)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="identification">
                        Identification Document <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="identification"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, "identification")}
                          required
                        />
                        {documentState.identification && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">Uploaded</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">Passport or national ID (PDF, JPG or PNG format, max 5MB)</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalDocs">Additional Documents</Label>
                      <div className="flex items-center gap-4">
                        <Input
                          id="additionalDocs"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, "additionalDocs")}
                        />
                        {documentState.additionalDocs.length > 0 && (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="text-sm">{documentState.additionalDocs.length} file(s) uploaded</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Any additional documents to support your application (max 5MB each)
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <div className="flex items-start">
                      <FileText className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">Document Requirements</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-blue-700">
                          <li>All documents must be in PDF, JPG, or PNG format</li>
                          <li>Maximum file size is 5MB per document</li>
                          <li>Documents in languages other than English must include certified translations</li>
                          <li>Ensure all documents are clear, legible, and complete (all pages included)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {activeStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Application Fee Payment</h2>
                    <p className="text-gray-600 mb-6">
                      Please pay the application fee of{" "}
                      <span className="font-medium">{program.applicationFee || "$50"}</span> to complete your
                      application
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Application Fee</h3>
                        <p className="text-sm text-gray-600">
                          {program.title} - {program.university}
                        </p>
                      </div>
                      <div className="text-xl font-bold">{program.applicationFee || "$50"}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentInfoChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder Name</Label>
                      <Input
                        id="cardName"
                        name="cardName"
                        placeholder="John Doe"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentInfoChange}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentInfoChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentInfoChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 pt-4">
                      <Checkbox
                        id="terms"
                        checked={paymentInfo.agreeToTerms}
                        onCheckedChange={handlePaymentCheckboxChange}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-sm text-gray-500">
                          By checking this box, you agree to our{" "}
                          <a href="#" className="text-studyportal-blue hover:underline">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="#" className="text-studyportal-blue hover:underline">
                            Privacy Policy
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                    <div className="flex items-start">
                      <CreditCard className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Payment Information</h4>
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-yellow-700">
                          <li>Your payment information is securely processed</li>
                          <li>Application fees are non-refundable</li>
                          <li>You will receive a payment confirmation by email</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {activeStep > 1 ? (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}

                {activeStep < 5 ? (
                  <Button className="bg-studyportal-blue hover:bg-blue-700" onClick={handleNextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    className="bg-studyportal-blue hover:bg-blue-700"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default ApplicationForm
