import { get } from "http"
import type { Program, Application, Professor } from "../models/types"
import { getPrograms } from "./programService"
import axios from "axios"
import {v4 as uuidv4} from "uuid"
import exp from "constants"
import { add } from "date-fns"

// Mock storage keys
const PROGRAMS_STORAGE_KEY = "studyportal_programs"
const APPLICATIONS_STORAGE_KEY = "studyportal_applications"
const SAVED_PROGRAMS_STORAGE_KEY = "studyportal_saved_programs"

// Cache to store data while API calls are in progress
const dataCache: Record<string, any> = {
  [PROGRAMS_STORAGE_KEY]: null,
  [APPLICATIONS_STORAGE_KEY]: null,
  [SAVED_PROGRAMS_STORAGE_KEY]: null,
}

// API functions for real-time data
async function getInfo(id: string): Promise<any> {
  try {
    const response = await fetch(`http://localhost:8081/client_storage/getinfo/${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    //console.log("Received data:", data)
    return data
  } catch (error) {
    console.error("Error fetching info:", error)
    // Fallback to localStorage if API fails
    const localData = localStorage.getItem(id)
    return localData ? JSON.parse(localData) : null
  }
}

async function postInfo(id: string, value: string): Promise<any> {
  try {
    const response = await fetch(`http://localhost:8081/client_storage/postinfo/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ storage_value: value }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    //console.log("Update result:", data)
    return data
  } catch (error) {
    console.error("Error posting info:", error)
    // Fallback to localStorage if API fails
    localStorage.setItem(id, value)
    return { success: true, message: "Saved to localStorage as fallback" }
  }
}

// Initialize programs from programService
export const initializePrograms = (): void => {
  const programsData = JSON.stringify(getPrograms())

  // Update cache immediately
  dataCache[PROGRAMS_STORAGE_KEY] = getPrograms()

  // Store in localStorage as fallback
  localStorage.setItem(PROGRAMS_STORAGE_KEY, programsData)

  // Send to API asynchronously
  postInfo(PROGRAMS_STORAGE_KEY, programsData).catch((error) => {
    console.error("Failed to initialize programs in API:", error)
  })
}

// Programs CRUD operations
export const getAllPrograms = (): Program[] => {
  initializePrograms()
  const programsJson = localStorage.getItem(PROGRAMS_STORAGE_KEY)
  const programs = programsJson ? JSON.parse(programsJson) : []

  return programs
}

export const savePrograms = (programs: Program[]): void => {
  const programsData = JSON.stringify(programs)

  // Update cache immediately
  //dataCache[PROGRAMS_STORAGE_KEY] = programs

  // Send to API asynchronously
  postInfo(PROGRAMS_STORAGE_KEY, programsData).catch((error) => {
    console.error("Failed to save programs to API:", error)
  })

  // Store in localStorage as fallback
  localStorage.setItem(PROGRAMS_STORAGE_KEY, programsData)
}

export const getProgramById = (id: string): Program | undefined => {
  return getAllPrograms().find((program) => program.id === id)
}

export const getProgramsByDegree = (degree: string): Program[] => {
  return getAllPrograms().filter((program) => program.degree?.toLowerCase() === degree.toLowerCase())
}


export async function addProgram(program: Program): Promise<Response> {
  try {
    //console.log("this is saveApplication")
    //console.log(application)
    const response = await axios.post<Response>('http://localhost:8081/institution/programs', program);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export async function addRequirments(requirements: string[], TprogramId: string): Promise<Response> {
  try {
    //console.log("this is saveApplication")
    //console.log(application)
    const programId = TprogramId;


      console.log("Requirements: ", requirements);
      const response = await axios.post<Response>(`http://localhost:8081/institution/programs/requirements/${programId}`, requirements);
      console.log("Response: ", response.data);
    
    //const response = await axios.post<Response>('http://localhost:8081/institution/programs', program);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

export const addProgramM = (program: Omit<Program, "id">): Program => {
  const newProgram: Program = {
    ...program,
    id: `program_${Date.now()}`,
  }

  const programs = getAllPrograms()
  programs.push(newProgram)
  savePrograms(programs)

  return newProgram
}

// Applications CRUD operations
export const getApplicationsM = (): Application[] => {
  // If we have cached data, return it immediately
  // if (dataCache[APPLICATIONS_STORAGE_KEY]) {
  //   return dataCache[APPLICATIONS_STORAGE_KEY]
  // }

  
  // Update cache
  //dataCache[APPLICATIONS_STORAGE_KEY] = applications

  // Fetch from API in background and update cache
  getInfo(APPLICATIONS_STORAGE_KEY)
    .then((apiApplications) => {
      if (apiApplications) {
        const parsedApplications = typeof apiApplications === "string" ? JSON.parse(apiApplications) : apiApplications
        //dataCache[APPLICATIONS_STORAGE_KEY] = parsedApplications
        localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(parsedApplications))
      }
    })
    .catch((error) => {
      console.error("Failed to get applications from API:", error)
    })

    // Otherwise, get from localStorage as fallback
  const applicationsJson = localStorage.getItem(APPLICATIONS_STORAGE_KEY)
  const applications = applicationsJson ? JSON.parse(applicationsJson) : []

  return applications
}

export const saveApplicationsM = (applications: Application[]): void => {
  const applicationsData = JSON.stringify(applications)

  // Update cache immediately
  //dataCache[APPLICATIONS_STORAGE_KEY] = applications

  // Send to API asynchronously
  postInfo(APPLICATIONS_STORAGE_KEY, applicationsData).catch((error) => {
    console.error("Failed to save applications to API:", error)
  })

  // Store in localStorage as fallback
  localStorage.setItem(APPLICATIONS_STORAGE_KEY, applicationsData)

}


//-------------->>>>------------------
async function saveApplication(application: Application): Promise<Response> {
  try {
    //console.log("this is saveApplication")
    //console.log(application)
    const response = await axios.post<Response>('http://localhost:8081/student/submitapplication', application);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}
export async function getApplications(): Promise<Application[]> {
  try {
    const response = await fetch('http://localhost:8081/student/getapplicatioins');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json() as Application[]; // Type assertion
    //console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to let the caller handle it
  }
}

export async function getStudentID(userId : String): Promise<Application[]> {
  try {
    const response = await fetch(`http://localhost:8081/student/students/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json() as Application[]; // Type assertion
    //console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to let the caller handle it
  }
}


export const addApplication = async (programId: string, studentId: string, studentName: string, sop: string): Promise<Application> => {
  let appuuid = uuidv4();
  
  try {
    // Await the Promise to get the actual value
    const studentData = await getStudentID(studentId);
    const myuuid = studentData[0].id;
    
    //console.log("Student UUID: ", myuuid);
    
    const newApplication: Application = {
      id: appuuid,
      studentId: myuuid, // Now this will have the correct value
      studentName,
      status: "pending",
      applicationDate: new Date().toISOString(),
      sop:sop,
      comments: [],
      student_id: myuuid,
      program_id: programId,
      programId: programId,
    };
    saveApplication(newApplication);
    return newApplication;
  } catch (error) {
    console.error("Error getting student ID:", error);
    throw error; // Or handle it appropriately
  }
}




//-------------------// Update application status
async function applicationStatusUpdate(application: Application): Promise<Response> {
  try {
    //console.log("this is saveApplication")
    //console.log(application)
    const response = await axios.put<Response>('http://localhost:8081/student/updateapplication/status', application);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    } else {
      console.error('Unexpected error:', error);
      throw new Error('An unexpected error occurred');
    }
  }
}
export const updateApplicationStatus = async (applicationId: string, status: string): Promise<Application> => {
  const newApplication: Application = {
    id: applicationId,
    status: status as "pending" | "under_review" | "approved" | "rejected" | "waitlisted",
    program_id: "",
    student_id: undefined,
    programId: "",
    studentId: "",
    applicationDate: "",
    comments: []
  };

 applicationStatusUpdate(newApplication);
  //saveApplications(applications)

  const updatedApplication: Application = {
    ...newApplication,
    // Add any additional fields from the response if necessary
  };
  return updatedApplication;
}

export const getApplicationsByStudentId = async (studentIdgiven: string): Promise<Array<Application & { program: Program} >> => {
  //console.log("Get applications function : ", getApplications())
  // const allApplications = getApplications();
  // console.log('Raw applications data:', allApplications);
  // console.log('Complete raw data:', JSON.stringify(allApplications, null, 2));
  // const applications = (await allApplications).filter((app) => {
  //   if (!app.studentId) {
  //     console.warn(`Application ${app.id} has no studentId`);
  //     return false;
  //   }
  //   const isMatch = String(app.studentId) === String(studentId);
  //   console.log(`Comparing ${app.studentId} (${typeof app.studentId}) with ${studentId} (${typeof studentId}): ${isMatch}`);
  //   return isMatch;
  // });

  // console.log('Filtered applications:', applications)
  const allapplications = await getApplications();
  console.log('Raw applications data:', allapplications);
  const studentData = await getStudentID(studentIdgiven);
  const myuuid = studentData[0].id;

  const applications = allapplications.filter((app) => {
    console.log('Full application object:', app);
    console.log(`Comparing ${app.student_id} with ${myuuid}`);
    return app.student_id === myuuid})
  console.log("Applications for studentId:", studentIdgiven, applications)
  const programs = getAllPrograms()

  return applications.map((app) => {
    const program = programs.find((p) => p.id === app.program_id)
    return {
      ...app,
      program: program || {
        id: "unknown",
        title: "Unknown Program",
        description: "Program details not available",
        university: "Unknown University",
        degree: "Unknown",
        discipline: "Unknown",
        duration: "Unknown",
        tuitionFee: "0",
        applicationFee: "0",
        deadline: new Date().toISOString(),
        startDate: new Date().toISOString(),
        requirements: [],
        department: "Unknown",
        scholarshipsAvailable: false,
        institutionId: "unknown",
        level: "Bachelors",
        imageUrl: "",
        ranking: "0",
        scholarships: [],
        location: "Unknown",
      },
    }
  })
}



export const getApplicationsByInstitution = async (institutionId: string): Promise<Array<Application & { program: Program} >> => {
  const programs = getAllPrograms().filter((p) => p.institutionId === institutionId || p.university === institutionId)
  console.log("Programs for institutionId:", institutionId, programs);
  const programIds = programs.map((p) => p.id)
  console.log("Program IDs for institutionId:", institutionId, programIds);
  const applications = (await getApplications()).filter((app) => programIds.includes(app.program_id))

  return applications.map((app) => {
    const program = programs.find((p) => p.id === app.program_id)
    return {
      ...app,
      program: program || {
        id: "unknown",
        title: "Unknown Program",
        description: "Program details not available",
        university: "Unknown University",
        degree: "Unknown",
        discipline: "Unknown",
        duration: "Unknown",
        tuitionFee: "0",
        applicationFee: " ",
        deadline: new Date().toISOString(),
        startDate: new Date().toISOString(),
        requirements: [],
        department: "Unknown",
        scholarshipsAvailable: false,
        institutionId: "unknown",
        level: "Bachelors",
        scholarships: "Unknown",
        imageUrl: "",
        ranking: "0",
        location: "Unknown",
      },
    }
  })
}

// Saved Programs operations
interface SavedProgram {
  program_id: string
  id: string
  studentId: string
  programId: string
  savedDate: string
}

export const getSavedProgramsData = (): SavedProgram[] => {
  // If we have cached data, return it immediately
  if (dataCache[SAVED_PROGRAMS_STORAGE_KEY]) {
    return dataCache[SAVED_PROGRAMS_STORAGE_KEY]
  }

  // Otherwise, get from localStorage as fallback
  const savedProgramsJson = localStorage.getItem(SAVED_PROGRAMS_STORAGE_KEY)
  const savedPrograms = savedProgramsJson ? JSON.parse(savedProgramsJson) : []

  // Update cache
  dataCache[SAVED_PROGRAMS_STORAGE_KEY] = savedPrograms

  // Fetch from API in background and update cache
  getInfo(SAVED_PROGRAMS_STORAGE_KEY)
    .then((apiSavedPrograms) => {
      if (apiSavedPrograms) {
        const parsedSavedPrograms =
          typeof apiSavedPrograms === "string" ? JSON.parse(apiSavedPrograms) : apiSavedPrograms
        dataCache[SAVED_PROGRAMS_STORAGE_KEY] = parsedSavedPrograms
        localStorage.setItem(SAVED_PROGRAMS_STORAGE_KEY, JSON.stringify(parsedSavedPrograms))
      }
    })
    .catch((error) => {
      console.error("Failed to get saved programs from API:", error)
    })

  return savedPrograms
}

export const saveSavedProgramsData = (savedPrograms: SavedProgram[]): void => {
  const savedProgramsData = JSON.stringify(savedPrograms)

  // Update cache immediately
  //dataCache[SAVED_PROGRAMS_STORAGE_KEY] = savedPrograms

  // Send to API asynchronously
  postInfo(SAVED_PROGRAMS_STORAGE_KEY, savedProgramsData).catch((error) => {
    console.error("Failed to save saved programs to API:", error)
  })

  // Store in localStorage as fallback
  localStorage.setItem(SAVED_PROGRAMS_STORAGE_KEY, savedProgramsData)

}

export const saveProgram = (programId: string, studentId: string): SavedProgram => {
  const newSavedProgram: SavedProgram = {
    id: `saved_${Date.now()}`,
    programId,
    studentId,
    savedDate: new Date().toISOString(),
    program_id: ""
  }

  const savedPrograms = getSavedProgramsData()
  savedPrograms.push(newSavedProgram)
  saveSavedProgramsData(savedPrograms)

  return newSavedProgram
}

export const removeSavedProgram = (programId: string, studentId: string): void => {
  const savedPrograms = getSavedProgramsData()
  const filteredPrograms = savedPrograms.filter((sp) => !(sp.programId === programId && sp.studentId === studentId))
  saveSavedProgramsData(filteredPrograms)
}

export const getSavedPrograms = (studentId: string): Program[] => {
  const savedPrograms = getSavedProgramsData().filter((sp) => sp.studentId === studentId)
  const programs = getAllPrograms()

  return savedPrograms
    .map((sp) => {
      const program = programs.find((p) => p.id === sp.programId)
      return program
    })
    .filter(Boolean) as Program[]
}

export const isProgramSaved = (programId: string, studentId: string): boolean => {
  const savedPrograms = getSavedProgramsData()
  return savedPrograms.some((sp) => sp.programId === programId && sp.studentId === studentId)
}


async function getApplicationProgramNameByPid(pid: string): Promise<any> {
  try {
      const response = await fetch(`http://localhost:8081/student/getApplicatioinsProgramNameByPid/${pid}`);
      
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      //const demo = JSON.parse(response);
      const data = await response.text(); // Since the API returns a string
      return data;
  } catch (error) {
      console.error('Error fetching program name:', error);
      throw error; // Re-throw the error so the caller can handle it
  }
}

export const programeNameByPid = async (pid: string): Promise<string> => {
  try {
      const programName = await getApplicationProgramNameByPid(pid);
      return programName;
  } catch (error) {
      console.error('Error getting program name:', error);
      throw error; // Or handle it appropriately
  }
}

export async function fetchSavedProgramsId(userId: string): Promise<SavedProgram[]> {
  const response = await fetch(`http://localhost:8081/student/savedprogram/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch saved programs: ${response.statusText}`);
  }
  return await response.json();
}

export async function postSavedProgramsId(saveProgram: SavedProgram): Promise<SavedProgram> {
  try {
    const response =  axios.post<SavedProgram>('http://localhost:8081/student/savedprogram/', saveProgram, );
    return (await response).data;
    
  } catch (error: any) {
    throw new Error(`Failed to save program: ${error.response?.data?.message || error.message}`);
  }
}


//-----------------------------Professor Management-----------------------------------//

export async function fetchProfessor(userId: string): Promise<Professor[]> {
  const response = await fetch(`http://localhost:8081/professor/professorinfo/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch saved programs: ${response.statusText}`);
  }
  return await response.json();
}

export async function postProfessro(person: Professor): Promise<Professor> {
  try {
    const response =  axios.post<Professor>('http://localhost:8081/professor/professorinfo', person, );
    return (await response).data;
    
  } catch (error: any) {
    throw new Error(`Failed to save program: ${error.response?.data?.message || error.message}`);
  }
}
export async function updateProfessor(userId: string, person: Professor): Promise<Professor> {
  try {
    const response =  axios.put<Professor>(`http://localhost:8081//professorinfo/update/${userId}`, person, );
    return (await response).data;
    
  } catch (error: any) {
    throw new Error(`Failed to save program: ${error.response?.data?.message || error.message}`);
  }
}