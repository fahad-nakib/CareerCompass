"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { getStudentDocuments, uploadDocument, deleteDocument } from "@/services/documentService"
import { FileText, Upload, CheckCircle, Clock, Trash2, Download, Eye } from "lucide-react"
import type { Document } from "@/models/types"
import Sidebar from "../../components/Sidebar"

const StudentDocuments = () => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  // New document form state
  const [newDocument, setNewDocument] = useState({
    name: "",
    type: "transcript",
    file: null as File | null,
  })

  useEffect(() => {
    if (user) {
      // Fetch student documents
      const fetchDocuments = async () => {
        try {
          const docs = await getStudentDocuments(String(user.id))
          setDocuments(docs)
        } catch (error) {
          console.error("Error fetching documents:", error)
          toast({
            title: "Error",
            description: "Failed to load your documents. Please try again later.",
            variant: "destructive",
          })
        }
      }

      fetchDocuments()
    }
  }, [user, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewDocument((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewDocument((prev) => ({ ...prev, file: e.target.files![0] }))
    }
  }

  const handleTypeChange = (value: string) => {
    setNewDocument((prev) => ({ ...prev, type: value }))
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newDocument.name || !newDocument.file) {
      toast({
        title: "Missing information",
        description: "Please provide a document name and select a file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // In a real app, this would upload to a server
      const uploadedDoc = await uploadDocument({
        studentId: String(user!.id),
        name: newDocument.name,
        type: newDocument.type as Document["type"],
        file: newDocument.file,
      })

      setDocuments((prev) => [...prev, uploadedDoc])

      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      })

      // Reset form
      setNewDocument({
        name: "",
        type: "transcript",
        file: null,
      })
    } catch (error) {
      console.error("Error uploading document:", error)
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteDocument = async (documentId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(documentId)
        setDocuments((prev) => prev.filter((doc) => doc.id !== documentId))

        toast({
          title: "Document deleted",
          description: "The document has been successfully deleted.",
        })
      } catch (error) {
        console.error("Error deleting document:", error)
        toast({
          title: "Delete failed",
          description: "There was a problem deleting your document. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === "all") return true
    if (activeTab === "verified") return doc.verified || doc.isVerified
    if (activeTab === "pending") return !doc.verified && !doc.isVerified
    return doc.type === activeTab
  })

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      transcript: "Academic Transcript",
      certificate: "Certificate",
      identification: "ID Document",
      recommendation: "Recommendation Letter",
      sop: "Statement of Purpose",
      other: "Other Document",
    }
    return types[type] || "Document"
  }

  const getVerificationStatusIcon = (doc: Document) => {
    const isVerified = doc.verified || doc.isVerified

    if (isVerified) {
      return <CheckCircle className="h-5 w-5 text-green-500" />
    } else {
      return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  return (
    <Layout>
      <div className="flex">
      <Sidebar role="student" />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-studyportal-blue">My Documents</h1>
              <p className="text-gray-600 mt-2">Manage your academic and personal documents</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload New Document */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Upload
                  <br />New Document
                </CardTitle>
                <CardDescription>Add a new document to your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Document Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newDocument.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Bachelor's Degree Certificate"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Document Type</Label>
                    <Select value={newDocument.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transcript">Academic Transcript</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="identification">ID Document</SelectItem>
                        <SelectItem value="recommendation">Recommendation Letter</SelectItem>
                        <SelectItem value="sop">Statement of Purpose</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">Upload File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      required
                    />
                    <p className="text-xs text-gray-500">Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 5MB)</p>
                  </div>

                  <Button type="submit" className="w-full bg-studyportal-blue hover:bg-blue-700" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Document"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Documents List */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Documents</TabsTrigger>
                  <TabsTrigger value="transcript">Transcripts</TabsTrigger>
                  <TabsTrigger value="certificate">Certificates</TabsTrigger>
                  <TabsTrigger value="identification">ID Documents</TabsTrigger>
                  <TabsTrigger value="verified">Verified</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                  {filteredDocuments.length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-700 mb-2">No Documents Found</h3>
                        <p className="text-gray-500 text-center max-w-md">
                          {activeTab === "all"
                            ? "You haven't uploaded any documents yet. Upload your first document to get started."
                            : `You don't have any ${activeTab === "verified" ? "verified" : activeTab === "pending" ? "pending" : activeTab} documents.`}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {filteredDocuments.map((doc) => (
                        <Card key={doc.id} className="overflow-hidden">
                          <div className="flex items-center p-4 border-b">
                            <div className="mr-4">
                              <FileText className="h-10 w-10 text-studyportal-blue" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{doc.name}</h3>
                              <div className="flex items-center text-sm text-gray-500">
                                <span>{getDocumentTypeLabel(doc.type)}</span>
                                <span className="mx-2">•</span>
                                <span>Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div
                                className="flex items-center mr-4"
                                title={doc.verified || doc.isVerified ? "Verified" : "Pending Verification"}
                              >
                                {getVerificationStatusIcon(doc)}
                                <span className="ml-1 text-sm">
                                  {doc.verified || doc.isVerified ? "Verified" : "Pending"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Eye className="mr-1 h-4 w-4" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex items-center">
                              <Download className="mr-1 h-4 w-4" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex items-center text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteDocument(doc.id)}
                            >
                              <Trash2 className="mr-1 h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StudentDocuments
