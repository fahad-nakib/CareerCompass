// Mock scholarship data
const scholarships = [
  {
    id: 1,
    title: "Merit Scholarship Program",
    name: "Merit Scholarship Program",
    institutionName: "University of Technology",
    amount: "$5,000",
    deadline: "2025-06-30",
    description:
      "Scholarship for outstanding academic achievements in STEM fields. Open to all undergraduate students with a GPA of 3.5 or higher.",
    eligibility: "Undergraduate students with GPA 3.5+",
    requirements: ["Academic transcript", "Letter of recommendation", "Personal statement"],
  },
  {
    id: 2,
    title: "Global Leaders Fellowship",
    name: "Global Leaders Fellowship",
    institutionName: "International University",
    amount: "$10,000",
    deadline: "2025-05-15",
    description:
      "Supporting future global leaders with full tuition coverage for Master's programs in Business, International Relations, and Public Policy.",
    eligibility: "Master's applicants with leadership experience",
    requirements: ["CV/Resume", "Leadership essay", "Two recommendation letters"],
  },
  {
    id: 3,
    title: "Research Excellence Grant",
    name: "Research Excellence Grant",
    institutionName: "National Science Academy",
    amount: "$15,000",
    deadline: "2025-07-20",
    description:
      "Funding for PhD candidates conducting innovative research in emerging technologies, sustainability, or healthcare innovations.",
    eligibility: "PhD candidates with research proposal",
    requirements: ["Research proposal", "Academic CV", "Publication list"],
  },
  {
    id: 4,
    title: "Diversity in Education Scholarship",
    name: "Diversity in Education Scholarship",
    institutionName: "Community College Foundation",
    amount: "$3,000",
    deadline: "2025-08-10",
    description: "Supporting students from underrepresented backgrounds pursuing degrees in education and teaching.",
    eligibility: "Students from underrepresented groups",
    requirements: ["Personal statement", "Financial information", "Community involvement proof"],
  },
  {
    id: 5,
    title: "Future Engineers Fund",
    name: "Future Engineers Fund",
    institutionName: "Engineering Institute",
    amount: "$7,500",
    deadline: "2025-09-01",
    description:
      "Financial support for promising engineering students with demonstrated technical aptitude and project experience.",
    eligibility: "Engineering students with project portfolio",
    requirements: ["Project portfolio", "Technical assessment", "Academic transcript"],
  },
]

/**
 * Get all available scholarships
 * @returns Array of scholarship objects
 */
export const getScholarships = () => {
  return scholarships
}

/**
 * Get a specific scholarship by ID
 * @param id Scholarship ID
 * @returns Scholarship object or undefined if not found
 */
export const getScholarshipById = (id: number) => {
  return scholarships.find((scholarship) => scholarship.id === id)
}

/**
 * Get scholarships by institution
 * @param institutionName Name of the institution
 * @returns Array of scholarships from the specified institution
 */
export const getScholarshipsByInstitution = (institutionName: string) => {
  return scholarships.filter(
    (scholarship) => scholarship.institutionName.toLowerCase() === institutionName.toLowerCase(),
  )
}
