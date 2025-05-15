import type { Program, Requirement } from "../models/types"


async function getRequirementList(id: string): Promise<string[]> {
  try {
    const response = await fetch(`http://localhost:8081/institution/programs/requirments/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    //console.log("API response:", data);

    // Validate the response is an array
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array');
    }

    // Extract just the requirement strings from each object
    const requirements = data.map(item => {
      // Validate each item has the expected structure
      if (typeof item !== 'object' || item === null || !('requirement' in item)) {
        throw new Error('Invalid item format: expected object with requirement property');
      }
      return String(item.requirement); // Convert to string explicitly
    });
    //console.log("Extracted requirements:", requirements);
    return requirements;

  } catch (error) {
    console.error('Error fetching requirements:', error);
    throw error; // Re-throw to let caller handle the error
  }
}


async function getProgramsList(): Promise<Program[]> {
  try {
    const response = await fetch('http://localhost:8081/institution/programs');
    console.log("this is response",response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected an array');
    }


    const programs: Program[] = await Promise.all(data.map(async (item: any) => ({
      imageUrl: item.imageUrl || '',
      ranking: item.ranking || '',
      scholarships: item.scholarshipsAvailable ? true : undefined,
      location: item.location || '',
      id: item.id,
      institutionId: item.institutionId,
      university: item.university || '',
      title: item.title || '',
      description: item.description || '',
      level: ['Bachelors', 'Masters', 'PhD', 'Certificate', 'Diploma'].includes(item.level) 
        ? item.level as Program['level'] 
        : 'Bachelors', // Default value
      degree: item.degree || '',
      duration: item.duration || '',
      tuitionFee: item.tuitionFee || "0",
      discipline: item.discipline || '',
      applicationFee: item.applicationFee || "0",
      deadline: item.deadline || '',
      startDate: item.startDate || '',
      requirements: await getRequirementList(item.id) || [],
      department: item.department || '',
      scholarshipsAvailable: Boolean(item.scholarshipsAvailable),
    })));
    
    //console.log("this is json data",data)
    return programs;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
// getPrograms
const temp = await getProgramsList();
export const getPrograms=(): Program[] =>temp;
//console.log("this is program service",programService);

// // Mock data for programs
// export const programService = (): Program[] => {
//   return [
//     {
//       id: "program_1",
//       title: "Computer Science",
//       description: "A comprehensive program covering algorithms, data structures, software engineering, artificial intelligence, and more.",
//       university: "Stanford University",
//       degree: "Bachelor",
//       discipline: "Computer Science",
//       duration: "4 years",
//       tuitionFee: 50000,
//       applicationFee: 100,
//       deadline: "2023-12-31",
//       startDate: "2024-09-01",
//       requirements: ["High School Diploma", "SAT/ACT Scores", "Letters of Recommendation"],
//       department: "School of Engineering",
//       scholarshipsAvailable: true,
//       institutionId: "institution_1",
//       level: "Bachelors",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: true,
//       location: "USA"
//     },
//     {
//       id: "program_2",
//       title: "Data Science",
//       description: "Learn to analyze and interpret complex data using statistical methods, machine learning, and visualization techniques.",
//       university: "MIT",
//       degree: "Master",
//       discipline: "Data Science",
//       duration: "2 years",
//       tuitionFee: 60000,
//       applicationFee: 150,
//       deadline: "2023-11-30",
//       startDate: "2024-09-01",
//       requirements: ["Bachelor's Degree", "GRE Scores", "Statement of Purpose"],
//       department: "School of Computing",
//       scholarshipsAvailable: true,
//       institutionId: "institution_2",
//       level: "Masters",
//       ranking: "12",
//       imageUrl: "https://media.istockphoto.com/id/2186780950/photo/software-engineers-collaborating-on-a-project-analyzing-code-on-computer-monitors-in-office.jpg?s=1024x1024&w=is&k=20&c=Q87wEHkCfeUfJywu7umqCCDx469iwXsV35i9f3N2NpE=?height=192&width=384",
//       scholarships: undefined,
//       location: "Australia"
//     },
//     {
//       id: "program_3",
//       title: "Artificial Intelligence",
//       description: "Research-focused program exploring advanced AI concepts, neural networks, natural language processing, and robotics.",
//       university: "Carnegie Mellon University",
//       degree: "PhD",
//       discipline: "Artificial Intelligence",
//       duration: "5 years",
//       tuitionFee: 70000,
//       applicationFee: 200,
//       deadline: "2023-10-31",
//       startDate: "2024-09-01",
//       requirements: ["Master's Degree", "Research Proposal", "Letters of Recommendation"],
//       department: "School of Computer Science",
//       scholarshipsAvailable: true,
//       institutionId: "institution_3",
//       level: "PhD",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: undefined,
//       location: "Germany"
//     },
//     {
//       id: "program_4",
//       title: "Business Administration",
//       description: "Develop essential business skills in management, marketing, finance, and entrepreneurship for a successful career in business.",
//       university: "Harvard University",
//       degree: "Bachelor",
//       discipline: "Business",
//       duration: "4 years",
//       tuitionFee: 55000,
//       applicationFee: 100,
//       deadline: "2023-12-15",
//       startDate: "2024-09-01",
//       requirements: ["High School Diploma", "SAT/ACT Scores", "Personal Statement"],
//       department: "Business School",
//       scholarshipsAvailable: true,
//       institutionId: "institution_4",
//       level: "Bachelors",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: undefined,
//       location: "USA"
//     },
//     {
//       id: "program_5",
//       title: "Mechanical Engineering",
//       description: "Study the principles of mechanics, thermodynamics, and materials science to design and analyze mechanical systems.",
//       university: "California Institute of Technology",
//       degree: "Master",
//       discipline: "Engineering",
//       duration: "2 years",
//       tuitionFee: 58000,
//       applicationFee: 150,
//       deadline: "2023-11-15",
//       startDate: "2024-09-01",
//       requirements: ["Bachelor's Degree in Engineering", "GRE Scores", "Letters of Recommendation"],
//       department: "School of Engineering",
//       scholarshipsAvailable: true,
//       institutionId: "institution_5",
//       level: "Masters",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: undefined,
//       location: "USA"
//     },
//     {
//       id: "program_6",
//       title: "Quantum Physics",
//       description: "Advanced research program exploring quantum mechanics, quantum field theory, and their applications in technology.",
//       university: "Princeton University",
//       degree: "PhD",
//       discipline: "Physics",
//       duration: "6 years",
//       tuitionFee: 65000,
//       applicationFee: 200,
//       deadline: "2023-10-15",
//       startDate: "2024-09-01",
//       requirements: ["Master's Degree in Physics", "Research Proposal", "Letters of Recommendation"],
//       department: "Department of Physics",
//       scholarshipsAvailable: true,
//       institutionId: "institution_6",
//       level: "PhD",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: undefined,
//       location: "Australia"
//     },
//     {
//       id: "program_7",
//       title: "Psychology",
//       description: "Explore human behavior, cognition, and mental processes through scientific research and clinical practice.",
//       university: "University of California, Berkeley",
//       degree: "Bachelor",
//       discipline: "Psychology",
//       duration: "4 years",
//       tuitionFee: 48000,
//       applicationFee: 100,
//       deadline: "2023-12-20",
//       startDate: "2024-09-01",
//       requirements: ["High School Diploma", "SAT/ACT Scores", "Personal Statement"],
//       department: "Department of Psychology",
//       scholarshipsAvailable: true,
//       institutionId: "institution_7",
//       level: "Bachelors",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: undefined,
//       location: "Italy"
//     },
//     {
//       id: "program_8",
//       title: "Environmental Science",
//       description: "Interdisciplinary program studying the environment and solutions to environmental problems through scientific inquiry.",
//       university: "Yale University",
//       degree: "Master",
//       discipline: "Environmental Science",
//       duration: "2 years",
//       tuitionFee: 52000,
//       applicationFee: 150,
//       deadline: "2023-11-20",
//       startDate: "2024-09-01",
//       requirements: ["Bachelor's Degree", "GRE Scores", "Statement of Purpose"],
//       department: "School of the Environment",
//       scholarshipsAvailable: true,
//       institutionId: "institution_8",
//       level: "Masters",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: undefined,
//       location: "Japan"
//     },
//     {
//       id: "program_9",
//       title: "Biomedical Engineering",
//       description: "Research-oriented program at the intersection of engineering, biology, and medicine to advance healthcare technologies.",
//       university: "Johns Hopkins University",
//       degree: "PhD",
//       discipline: "Biomedical Engineering",
//       duration: "5 years",
//       tuitionFee: 68000,
//       applicationFee: 200,
//       deadline: "2023-10-20",
//       startDate: "2024-09-01",
//       requirements: ["Bachelor's Degree in Engineering or Life Sciences", "GRE Scores", "Research Experience"],
//       department: "Department of Biomedical Engineering",
//       scholarshipsAvailable: true,
//       institutionId: "institution_9",
//       level: "PhD",
//       ranking: "12",
//       imageUrl: "/placeholder.svg?height=192&width=384",
//       scholarships: undefined,
//       location: "Canada"
//     },
//   ]
// }

//console.log("This is prev prog list",getPrograms());
//console.log(getProgramsList());



//npm install mysql2

//npm install --save-dev @types/mysql2
