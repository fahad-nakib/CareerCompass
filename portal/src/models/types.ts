// Update the User type to include all properties we're using
export type UserRole = "student" | "institution" | "admin" | "professor" | "admission_officer"

export interface StudentRegistration {
  imageUrl: null
  id: number //extra added for login
  name: string
  email: string
  password: string
}
export interface UserLogin{
  id: number
  name: string
  password: string
  date: string
  email: string
  role: UserRole
}
export interface User {
  imageUrl: null
  id: number
  email: string
  password: string // In a real app, this wouldn't be stored in the client
  name: string
  role: UserRole
  isRegistered: boolean
  isApproved: boolean
  isRejected?: boolean
  registrationDate?: string
  approvedDate?: string
  rejectedDate?: string
  rejectionReason?: string
  location?: string
  website?: string
  description?: string
  document?: File
  institutionId?: string // For professors and admission officers
}

export interface Student {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  address: string
  role: "student"
  education: Education[]
  documents: Document[]
  applications: Application[]
  notifications: Notification[]
}

export interface Institution {
  id: number
  userId: string
  name: string
  email: string
  phone: string
  address: string
  website: string
  description: string
  logo: string
  approved: boolean
  programs: Program[]
  scholarships: Scholarship[]
  professors: Professor[]
  admissionOfficers: AdmissionOfficer[]
}

export interface Professor {
  institution: string 
  id: string
  name: string
  email: string
  institutionId: string
  department: string
  expertise: string[]
  bio: string
  imageUrl?: string
  officeHours?: string
  contactInfo?: string
  recommendationRequests?: RecommendationRequest[]
  specialization?: string[]
}

export interface AdmissionOfficer {
  id: string
  userId: string
  name: string
  email: string
  institutionId: string
  institutionName: string
}

export interface Requirement{
  requirements: string[]
}



      

      
      
      
      
      
      
      
      
      


export interface Program {
  imageUrl: string
  //tuition: ReactNode
  ranking: string
  scholarships: any
  location: any
  id: string
  institutionId: string
  //institutionName?: string
  university?: string // For backward compatibility
  title: string
  description: string
  level: "Bachelors" | "Masters" | "PhD" | "Certificate" | "Diploma"
  degree?: string // For backward compatibility 
  duration: string
  tuitionFee: string
  discipline: string
  applicationFee: string
  deadline: string
  startDate: string
  requirements: string[]
  department: string
  scholarshipsAvailable: boolean
}

export interface Application {
  program_id: string
  student_id: any
  id: string
  programId: string
  studentId: string
  studentName?: string
  student_name?: string // For backward compatibility
  status: "pending" | "under_review" | "approved" | "rejected" | "waitlisted"
  applicationDate: string
  application_date?: string // For backward compatibility
  feedback?: string
  documents?: string[] | Document[]
  sop?: string
  paymentStatus?: string
  paymentAmount?: string
  paymentDate?: string
  comments: ApplicationComment[]
  program?: Program

}

export interface SavedProgram {
  program_id: string
  student_id: string
}

export interface ApplicationComment {
  id: string
  applicationId: string
  userId: string
  userRole: string
  comment: string
  timestamp: string
  userName?: string
}

export interface Document {
  createElement(arg0: string): unknown
  body: any
  id: string
  studentId: string
  name: string
  type: "transcript" | "certificate" | "identification" | "recommendation" | "sop" | "other"
  fileUrl?: string
  file?: string // For backward compatibility
  uploadDate: string
  isVerified?: boolean
  verified?: boolean // For backward compatibility
  verificationStatus?: "valid" | "fake" | "pending"
  verifiedBy?: string
  verificationDate?: string
}

export interface Education {
  field_of_study: String
  id: string
  studentId: string
  institution: string
  degree: string
  field: string
  startDate: string
  start_date: string
  end_date: string
  endDate: string
  gpa: string
}

export interface Payment {
  id: string
  applicationId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  paymentDate?: string
  paymentMethod?: string
  transactionId?: string
}

export interface Scholarship {
  id: string
  institutionId: string
  title?: string
  name?: string // For backward compatibility
  description: string
  amount: string | number
  deadline: string
  eligibilityCriteria?: string[]
  eligibility?: string[] // For backward compatibility
  programIds: string[]
  isActive?: boolean
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error" | "application" | "document"
  read: boolean
  createdAt: string
  relatedTo?: {
    type: "application" | "document" | "message" | "system"
    id: string
  }
}

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: string
  receiverId: string
  receiverName: string
  receiverRole: string
  subject: string
  content: string
  read: boolean
  createdAt: string
  attachments?: Document[]
}

export interface RecommendationRequest {
  id: string
  studentId: string
  studentName: string
  student_name?: string // For backward compatibility
  professorId: string
  applicationId: string
  programTitle: string
  institutionName: string
  status: "pending" | "accepted" | "rejected" | "completed"
  requestDate: string
  completionDate?: string
  letter?: Document
}
