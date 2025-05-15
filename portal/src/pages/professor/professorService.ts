// Define types
interface Professor {
  institution_id: string
  institutionId: string
  expertise: string
  bio: string
  id?: string
  userId?: string
  name: string
  email: string
  office?: string
  contactTime?: string
  experiences?: string
  description?: string
  profilePicture?: string | null
  institution?: string
  department?: string
  specialization?: string[]
}

interface RecommendationRequest {
  updated_at: string
  program_id: string
  student_name: string
  id: string
  studentName: string
  program: string
  university: string
  requestDate: string
}

interface Message {
  id: string
  studentName: string
  subject: string
  date: string
  preview: string
}

interface Course {
  id: string
  name: string
  code: string
  institution: string
  studentCount: number
}

// Fetch professor information
export async function fetchProfessor(userId: string): Promise<Professor[]> {
  try {
    const response = await fetch(`http://localhost:8081/professor/professorinfo/${userId}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    console.log("Fetched professor data:", data)
    return data
  } catch (error) {
    console.error("Error fetching professor:", error)
    // For demo purposes, return mock data if API fails
    return [
      // {
      //   id: "prof-1",
      //   userId: userId,
      //   name: "Dr. John Smith",
      //   email: "john.smith@university.edu",
      //   office: "Science Building, Room 305",
      //   contactTime: "Monday, Wednesday 2-4pm",
      //   experiences: "10+ years of research in Computer Science, specializing in AI and Machine Learning.",
      //   description: "I am passionate about teaching and research in artificial intelligence and machine learning.",
      //   profilePicture: null,
      //   institution: "Stanford University",
      //   department: "Computer Science",
      //   specialization: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
      // },
    ]
  }
}

// Post new professor information
export async function postProfessor(person: Professor): Promise<Professor> {
  try {
    const response = await fetch(`http://localhost:8081/professor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error posting professor:", error)
    // Return the input data for demo purposes
    return person
  }
}

// Update professor information
export async function updateProfessor(userId: string, person: Professor): Promise<Professor> {
  try {
    const response = await fetch(`http://localhost:8081/professor/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating professor:", error)
    // Return the input data for demo purposes
    return person
  }
}

// Fetch recommendation requests
export async function fetchRecommendationRequests(professorId: string): Promise<RecommendationRequest[]> {
  try {
    const response = await fetch(`http://localhost:8081/professor/pendingapplications`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching recommendation requests:", error)
    // Return mock data for demo purposes
    return [
      //{
      //   id: "rec-1",
      //   studentName: "John Smith",
      //   program: "MSc in Computer Science",
      //   university: "Stanford University",
      //   requestDate: "2023-05-15",
      // },
      // {
      //   id: "rec-2",
      //   studentName: "Emily Johnson",
      //   program: "PhD in Artificial Intelligence",
      //   university: "MIT",
      //   requestDate: "2023-05-16",
      // },
    ]
  }
}

// Fetch messages
export async function fetchMessages(professorId: string): Promise<Message[]> {
  try {
    const response = await fetch(`http://localhost:8081/professor/${professorId}/messages`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching messages:", error)
    // Return mock data for demo purposes
    return [
      {
        id: "msg-1",
        studentName: "Michael Brown",
        subject: "Question about research opportunities",
        date: "2023-05-17",
        preview: "Hello Professor, I'm interested in your research on machine learning...",
      },
      {
        id: "msg-2",
        studentName: "Sarah Wilson",
        subject: "Recommendation letter follow-up",
        date: "2023-05-16",
        preview: "Thank you for agreeing to write a recommendation letter for my application...",
      },
      {
        id: "msg-3",
        studentName: "David Lee",
        subject: "Meeting request",
        date: "2023-05-15",
        preview: "I would like to schedule a meeting to discuss potential thesis topics...",
      },
    ]
  }
}

// Fetch courses
export async function fetchCourses(professorId: string): Promise<Course[]> {
  try {
    const response = await fetch(`http://localhost:8081/professor/${professorId}/courses`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching courses:", error)
    // Return mock data for demo purposes
    return [
      {
        id: "course-1",
        name: "Advanced Machine Learning",
        code: "CS 229",
        institution: "Stanford University",
        studentCount: 42,
      },
      {
        id: "course-2",
        name: "Computer Vision",
        code: "CS 231n",
        institution: "Stanford University",
        studentCount: 38,
      },
      {
        id: "course-3",
        name: "Deep Learning",
        code: "CS 230",
        institution: "Stanford University",
        studentCount: 56,
      },
    ]
  }
}

export async function getInstitutionNameById(id:string): Promise<string> {
  try {
    const response = await fetch(`http://localhost:8081/professor/institutionname/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const data = await response.json()
    //console.log("Fetched institution name:", data[0].name)
    return data[0].name
  } catch (error) {
    console.error("Error fetching institution name:", error)
    return "Unknown Institution"
  }
  
}