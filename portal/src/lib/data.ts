// Professor data model
export interface Professor {
  id: string
  name: string
  email: string
  institutionId: string
  department: string
  expertise: string[]
  bio: string
  imageUrl: string
  officeHours: string
  contactInfo: string
}

// Applicant data model
export interface Applicant {
  id: string
  name: string
  email: string
  program: string
  gpa: number
  applicationDate: string
  status: "pending" | "approved" | "rejected"
  professorComment?: string
}

// Sample professor data
export const professorData: Professor = {
  id: "1",
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@stanford.edu",
  institutionId: "stanford",
  department: "Computer Science",
  expertise: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
  bio: "Dr. Johnson is a leading researcher in AI with over 15 years of experience. She has published numerous papers in top-tier conferences and journals.",
  imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
  officeHours: "Monday and Wednesday, 2-4 PM",
  contactInfo: "Office: CS Building, Room 305",
}

// Sample applicants data
export const applicantsData: Applicant[] = [
  {
    id: "a1",
    name: "Michael Chen",
    email: "michael.chen@gmail.com",
    program: "Ph.D. in Computer Science",
    gpa: 3.92,
    applicationDate: "2023-11-15",
    status: "pending",
  },
  {
    id: "a2",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@outlook.com",
    program: "Masters in AI",
    gpa: 3.85,
    applicationDate: "2023-11-10",
    status: "pending",
    professorComment: "Strong background in mathematics. Potential for research in neural networks.",
  },
  {
    id: "a3",
    name: "David Kim",
    email: "david.kim@yahoo.com",
    program: "Masters in Computer Science",
    gpa: 3.78,
    applicationDate: "2023-11-05",
    status: "pending",
  },
  {
    id: "a4",
    name: "Sophia Patel",
    email: "sophia.patel@gmail.com",
    program: "Ph.D. in Machine Learning",
    gpa: 3.95,
    applicationDate: "2023-11-18",
    status: "pending",
  },
]
