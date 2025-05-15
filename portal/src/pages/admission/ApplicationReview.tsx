"use client"

import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import type { Application, Document, ApplicationComment } from "@/models/types"

// Mock data - would come from services in a real implementation
const mockApplication: Application & { studentName: string } = {
  id: "app_123",
  programId: "1,",
  studentId: "student_1",
  program_id: "1",
  student_id: "student_1",
  studentName: "John Smith",
  status: "under_review",
  applicationDate: "2023-05-15T10:30:00Z",
  feedback: "",
  documents: ["doc_1", "doc_2", "doc_3"],
  sop: "I am writing to express my interest in the Computer Science program at Stanford University...",
  paymentStatus: "completed",
  paymentAmount: "$50",
  paymentDate: "2023-05-15T10:35:00Z",
  comments: [
    {
      id: "comment_1",
      applicationId: "app_123",
      userId: "admin_1",
      userRole: "admission_officer",
      comment: "Academic transcript looks good. GPA meets our requirements.",
      timestamp: "2023-05-16T14:20:00Z",
    },
    {
      id: "comment_2",
      applicationId: "app_123",
      userId: "admin_2",
      userRole: "admission_officer",
      comment: "Need to verify the authenticity of the certificate.",
      timestamp: "2023-05-17T09:15:00Z",
    },
  ],
}

const mockDocuments: Document[] = [];
// const mockDocuments: Document[] = [
//   {
//     id: "doc_1",
//     studentId: "student_1",
//     name: "Academic Transcript",
//     type: "transcript",
//     fileUrl: "/documents/transcript.pdf",
//     uploadDate: "2023-05-15T10:30:00Z",
//     isVerified: true,
//     verificationStatus: "valid",
//     verifiedBy: "admin_1",
//     verificationDate: "2023-05-16T14:20:00Z",
//   },
//   {
//     id: "doc_2",
//     studentId: "student_1",
//     name: "Certificate of English Proficiency",
//     type: "certificate",
//     fileUrl: "/documents/english_cert.pdf",
//     uploadDate: "2023-05-15T10:30:00Z",
//     isVerified: false,
//     verificationStatus: "pending",
//   },
//   {
//     id: "doc_3",
//     studentId: "student_1",
//     name: "Passport",
//     type: "identification",
//     fileUrl: "/documents/passport.pdf",
//     uploadDate: "2023-05-15T10:30:00Z",
//     isVerified: false,
//     verificationStatus: "pending",
//   },
// ]

const AdmissionApplicationReview = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  const [application, setApplication] = useState(mockApplication)
  const [documents, setDocuments] = useState(mockDocuments)
  const [newComment, setNewComment] = useState("")
  const [feedback, setFeedback] = useState(application.feedback || "")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting",
        variant: "destructive",
      })
      return
    }

    const comment: ApplicationComment = {
      id: `comment_${Date.now()}`,
      applicationId: application.id,
      userId: (user?.id).toString() || "",
      userRole: user?.role || "admission_officer",
      comment: newComment,
      timestamp: new Date().toISOString(),
    }

    setApplication({
      ...application,
      comments: [...application.comments, comment],
    })

    setNewComment("")

    toast({
      title: "Comment added",
      description: "Your comment has been added to the application",
    })
  }

  const handleVerifyDocument = (docId: string, status: "valid" | "fake") => {
    setDocuments(
      documents.map((doc) =>
        doc.id === docId
          ? {
              ...doc,
              isVerified: true,
              verificationStatus: status,
              verifiedBy: String(user?.id || ""),
              verificationDate: new Date().toISOString(),
            }
          : doc,
      ),
    )

    toast({
      title: "Document verified",
      description: `Document has been marked as ${status}`,
      variant: status === "valid" ? "default" : "destructive",
    })
  }

  const handleUpdateStatus = (status: Application["status"]) => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setApplication({
        ...application,
        status,
      })

      toast({
        title: "Application updated",
        description: `Application status has been updated to ${status.replace("_", " ")}`,
      })

      setIsSubmitting(false)
    }, 1000)
  }

  const handleSaveFeedback = () => {
    setApplication({
      ...application,
      feedback,
    })

    toast({
      title: "Feedback saved",
      description: "Your feedback has been saved",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "under_review":
        return <Badge className="bg-blue-500">Under Review</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      case "waitlisted":
        return <Badge className="bg-purple-500">Waitlisted</Badge>
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Application Review</h1>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Information */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Student Name</p>
              <p className="font-medium">{application.studentName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Application Date</p>
              <p className="font-medium">{new Date(application.applicationDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="mt-1">{getStatusBadge(application.status)}</div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Payment Information</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium capitalize">{application.paymentStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">{application.paymentAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{new Date(application.paymentDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold mb-2">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleUpdateStatus("pending")}
                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
                disabled={isSubmitting}
              >
                Pending
              </button>
              <button
                onClick={() => handleUpdateStatus("under_review")}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                disabled={isSubmitting}
              >
                Under Review
              </button>
              <button
                onClick={() => handleUpdateStatus("approved")}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                disabled={isSubmitting}
              >
                Approve
              </button>
              <button
                onClick={() => handleUpdateStatus("rejected")}
                className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                disabled={isSubmitting}
              >
                Reject
              </button>
              <button
                onClick={() => handleUpdateStatus("waitlisted")}
                className="px-3 py-1 bg-purple-100 text-purple-800 rounded-md text-sm hover:bg-purple-200"
                disabled={isSubmitting}
              >
                Waitlist
              </button>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4">Documents</h2>
          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="border rounded-md p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.type}</p>
                    <p className="text-xs text-gray-400">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    {doc.isVerified ? (
                      <Badge className={doc.verificationStatus === "valid" ? "bg-green-500" : "bg-red-500"}>
                        {doc.verificationStatus === "valid" ? "Valid" : "Fake"}
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500">Pending Verification</Badge>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200"
                  >
                    View
                  </a>
                  {!doc.isVerified && (
                    <>
                      <button
                        onClick={() => handleVerifyDocument(doc.id, "valid")}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                      >
                        Mark Valid
                      </button>
                      <button
                        onClick={() => handleVerifyDocument(doc.id, "fake")}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
                      >
                        Mark Fake
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SOP and Comments */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Statement of Purpose</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm whitespace-pre-wrap">{application.sop}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Feedback</h2>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full p-3 border rounded-md"
              rows={4}
              placeholder="Enter feedback for the student..."
            ></textarea>
            <button
              onClick={handleSaveFeedback}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Feedback
            </button>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {application.comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{comment.userRole.replace("_", " ")}</p>
                    <p className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-sm mt-1">{comment.comment}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 p-2 border rounded-md"
                placeholder="Add a comment..."
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdmissionApplicationReview
