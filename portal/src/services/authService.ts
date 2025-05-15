import type { User, UserRole, StudentRegistration } from "../models/types"
import { useState, useEffect } from 'react';
import axios from 'axios';
import { get } from "http";

// Mock users database - in a real app, this would be a backend service
const USERS_STORAGE_KEY = "studyportal_users"

// Fixed admin credentials
const ADMIN_EMAIL = "admin@studyportal.com"
const ADMIN_PASSWORD = "Admin123!"

// Initialize default admin user if not exists

const initializeAdmin = async () => {
  const users = getUsers()
  const adminExists = (await users).some((user) => user.email === ADMIN_EMAIL)

  if (!adminExists) {
    const adminUser: User = {
      id: 1,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: "System Administrator",
      role: "admin",
      isRegistered: true,
      isApproved: true,
      imageUrl: null
    }
    //users.push(adminUser)
    //saveUsers(await users)
    console.log("Admin user initialized")
  }
}

// Mock authentication functions

// export const getUsers = (): User[] => {
//   const usersJson = localStorage.getItem(USERS_STORAGE_KEY)
//   return usersJson ? JSON.parse(usersJson) : []
// } 
export default async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('http://localhost:8081/institution/institutionregister');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json() as User[]; // Type assertion
    console.log("Fetched data:", data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error; // Re-throw to let the caller handle it
  }
}

// export const saveUsers = (users: User[]): void => {
//   localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
// }
export async function registerUsers(users: User): Promise<Response> {
  try {
    console.log("this is saveInstitutionUser")
    console.log(users)
    const response = await axios.post<Response>('http://localhost:8081/institution/institutionregister', users);
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

export async function saveUsers(users: User): Promise<Response> {
  try {
    //console.log("this is saveInstitutionUser")
    //console.log(users)
    const response = await axios.post<Response>('http://localhost:8081/institution/institutionregister', users);
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

export async function updateRole(role: string,email: string): Promise<Response> {
  try {
    //console.log("this is saveInstitutionUser")
    //console.log(users)
    const response = await axios.put<Response>(`http://localhost:8081/institution//institutionregister/update/${role}`, email);
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
// // Store student registration data in local state

// // Fetch users from the API
// export const fetchStudentUsers = async (): Promise<StudentRegistration[]> => {
//   try {
//     console.log("this is fetchStudentUsers")
//     const res = await fetch('http://localhost:8081/studentregister');
//     return await res.json();
//   } catch (err) {
//     console.error(err);
//     return []; // Return empty array on error
//   }
// };
// function StudentList() {
//   const [students, setStudents] = useState<StudentRegistration[]>([]);

//   useEffect(() => {
//    // fetchStudentUsers().then(data => setStudents(data));
//   }, []);
//   console.log("this is studentList")

//   return [];
// }


// export const getStudentUsers = (): StudentRegistration[] => {
//   let [data, setData] = useState<StudentRegistration[]>([])
//   useEffect(() => {
//     fetch('http://localhost:8081/studentregister')
//     .then(res => res.json())
//     .then(data => {setData(data)})
//     .catch(err => console.log(err))
//   }, [])
//   return data 
// } 


// Function to register a student
async function saveStudentUser(studentData: StudentRegistration): Promise<Response> {
  try {
    console.log("this is saveStudentUser")
    console.log(studentData)
    const response = await axios.post<Response>('http://localhost:8081/student/studentregister', studentData);
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

async function getData(): Promise<any> {
  try {
    const response = await fetch('http://localhost:8081/student/studentregister');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log("this is getData")
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}

export const getStudentByEmail = async (email: string): Promise<StudentRegistration | undefined> => {
  
  try {
    const users = await getData();
    //console.log("this is getStudentByEmail ->");
    console.log(users.find(user => user.email ===email))
    return users.find(user => user.email === email);
  } catch (error) {
    console.error("Error in getStudentByEmail:", error);
    return undefined;
  }
}

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  console.log("finding user by email",await getUsers())
  console.log("What found:", (await getUsers()).find((user) => user.email === email))
  return (await getUsers()).find((user) => user.email === email)
}


// // Institution registration
// const newUser: User = {
//   id: `user_${Date.now()}`,
//   email,
//   password, // In a real app, this would be hashed  
//   name,
//   role: "student",
//   isRegistered: true,
//   isApproved: true,
//   registrationDate: new Date().toISOString(),
// }

export const registerStudent = (email: string, password: string, name: string): User => {
  // Initialize admin if needed
  let flag;
  const existingUser = getStudentByEmail(email)
  existingUser.then(function(result) {

    console.log("controller unmatched: ", result);
    flag = result;
    //console.log("typeof result",typeof(result))
    //console.log("flag inside",typeof(flag))
  }).catch(function(error) {
    console.error("Error resolving existingUser promise: ", error);
  });
  
  //const condtion = String(typeof(flag));
  // console.log("condition type",typeof(condtion))
  // console.log("flag type",flag)
  // console.log("condition value",condtion)
  if (flag.email === email) { 
    throw new Error("User with this email already exists")
  }
  const newUser: User = {
    name,
    email,
    password,
    role: "student",
    isRegistered: false,
    isApproved: false,
    id: 0,
    imageUrl: null
  }
  //const users = getStudentUsers()
  saveStudentUser(newUser)
  return newUser    
}

export const registerUser = async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
  // Initialize admin if needed
  //initializeAdmin()

  const existingUser = getUserByEmail(email)

  if (existingUser) {
    throw new Error("User with this email already exists")
  }

  const newUser: User = {
    email,
    password, // In a real app, this would be hashed
    name,
    role,
    isRegistered: true,
    isApproved: role !== "institution", // Institutions need approval, others are approved by default
    registrationDate: new Date().toISOString(),
    id: 0,
    imageUrl: null
  }

  //const users = getUsers();
  //(await users).push(newUser);
  saveUsers(newUser);

  return newUser
}
//export const getUsersDetails = getUsers();

export const loginUser = async (email: string, password: string, role?: string): Promise<User> => {
  // Initialize admin if this is the first login attempt
  //initializeAdmin()
  if(role === "student") {
    const student = await getStudentByEmail(email);
    //console.log("get student by email", student);
    if (!student || (await student).password !== password) {
      throw new Error("Invalid email or password")
    }
    return {
      id: student.id,
      email: student.email,
      password: student.password,
      name: student.name,
      role: "student",
      isRegistered: true,
      isApproved: true,
      imageUrl: student.imageUrl || null, // Include imageUrl with a fallback to null
    }
  }else{

  
  const user = getUserByEmail(email);
  //console.log("get usre by email", user);

  if (!user || (await user).password !== password) {
    throw new Error("Invalid email or password")
  }

  console.log("user role", (await user).role)
  console.log("provided role", role)
  // If role is specified, check if the user has that role
  if (role && (await user).role !== role) {
    throw new Error(`You are not registered as a ${role.replace("_", " ")}`)
  }

  // Check if institution is approved
  if ((await user).role === "institution" && !(await user).isApproved) {
    throw new Error("Your institution account is pending approval by an administrator")
  }

  return user
}
}

// Current user session management
const CURRENT_USER_KEY = "studyportal_current_user"

export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY)
  return userJson ? JSON.parse(userJson) : null
}

export const logoutUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null
}

export const isStudent = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "student"
}

export const isInstitution = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "institution"
}

export const isProfessor = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "professor"
}

export const isAdmissionOfficer = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "admission_officer"
}

export const isAdmin = (): boolean => {
  const user = getCurrentUser()
  return user?.role === "admin"
}

// Initialize admin on module load
initializeAdmin()
