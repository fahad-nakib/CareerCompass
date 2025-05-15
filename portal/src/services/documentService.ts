import type { Document } from "@/models/types"

// Mock data for documents
const mockDocuments: Document[] = [
  {
    id: "1",
    studentId: "student_1",
    name: "Academic Transcript",
    type: "transcript",
    fileUrl: "/documents/transcript.pdf",
    uploadDate: "2023-05-15T10:30:00Z",
    isVerified: true,
    verified: true,
  },
  {
    id: "2",
    studentId: "student_1",
    name: "Certificate of English Proficiency",
    type: "certificate",
    fileUrl: "/documents/english_cert.pdf",
    uploadDate: "2023-05-16T14:20:00Z",
    isVerified: true,
    verified: true,
  },
  {
    id: "3",
    studentId: "student_1",
    name: "Passport",
    type: "identification",
    fileUrl: "/documents/passport.pdf",
    uploadDate: "2023-05-17T09:15:00Z",
    isVerified: false,
    verified: false,
  },
]

// In-memory storage for documents
let documents = [...mockDocuments]

/**
 * Get all documents for a specific student
 */
export const getStudentDocuments = async (studentId: string): Promise<Document[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Return documents for the specified student
  return documents.filter((doc) => doc.studentId === studentId)
}

/**
 * Upload a new document
 */
export const uploadDocument = async (documentData: {
  studentId: string
  name: string
  type: Document["type"]
  file: File
}): Promise<Document> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Create a new document object
  const newDocument: Document = {
    id: `doc_${Date.now()}`,
    studentId: documentData.studentId,
    name: documentData.name,
    type: documentData.type,
    fileUrl: URL.createObjectURL(documentData.file), // Create a local URL for the file
    uploadDate: new Date().toISOString(),
    isVerified: false,
    verified: false,
  }

  // Add to our in-memory documents array
  documents.push(newDocument)

  return newDocument
}

/**
 * Delete a document
 */
export const deleteDocument = async (documentId: string): Promise<void> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Remove the document from our in-memory array
  documents = documents.filter((doc) => doc.id !== documentId)
}

/**
 * Verify a document
 */
export const verifyDocument = async (documentId: string): Promise<Document> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // Find and update the document
  const docIndex = documents.findIndex((doc) => doc.id === documentId)

  if (docIndex === -1) {
    throw new Error("Document not found")
  }

  // Update the document's verification status
  documents[docIndex] = {
    ...documents[docIndex],
    isVerified: true,
    verified: true,
  }

  return documents[docIndex]
}
