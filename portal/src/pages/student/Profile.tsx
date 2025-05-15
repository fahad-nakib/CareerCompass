"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Layout from "../../components/Layout"
import Sidebar from "../../components/Sidebar"
import type { Student, Education } from "../../models/types"
import axios from "axios"


const Profile: React.FC = () => {
  const { user } = useAuth()
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })
  const [educations, setEducations] = useState<Education[]>([])
  const [newEducation, setNewEducation] = useState<Partial<Education>>({
      institution: "",
      degree: "",
      field: "",
      field_of_study: "",
      startDate: "",
      endDate: "",
      gpa: "",
    })
  const [addingEducation, setAddingEducation] = useState(false)

  useEffect(() => {
    //const studentService = async (): Promise<Student> => getStudentInfo((user?.id ).toString())
    //console.log("featchStudentData", fetchStudentData);
    // In a real app, fetch student data from API studentService
    const fetchStudentData = async () => {
      try {
        // Mock data for demonstration
        const response = await fetch(`http://localhost:8081/student/students/${(user?.id).toString()}`);
        const mockStudent: Student = await response.json();
        console.log("mockStudent", mockStudent);
        //----  mockStudent
        const mokUser: Student = {
          id: "1",
          userId: (user?.id).toString() || "",
          name: user?.name || "John Doe",
          email: user?.email || "john@example.com",
          phone: "+1 (555) 123-4567",
          address: "123 Student Lane, College Town, CT 12345",
          education: [
            {
              id: "1",
              studentId: "1",
              institution: "State University",
              degree: "Bachelor of Science",
              field_of_study: "Computer Science",
              startDate: "2018-09-01",
              endDate: "2022-05-15",
              gpa: "3.8",
              field: ""
            },
          ],
          documents: [],
          applications: [],
          notifications: [],
          role: "student"
        }

        setStudent(mockStudent[0])
        setFormData({
          name: mockStudent[0].name,
          email: mockStudent[0].email,
          phone: mockStudent[0].phone,
          address: mockStudent[0].address,
        })

        const eduRes = await fetch(`http://localhost:8081/student/education/${(mockStudent[0].id)}`);
        const educationRes: Education[] = await eduRes.json();
        console.log("educationResTyp", typeof(educationRes));
        console.log("educationRes", educationRes);

        setEducations(educationRes)
        //setEducations(mockStudent.education)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching student data:", error)
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEducationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewEducation((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEducation = () => {
    if (!newEducation.institution || !newEducation.degree || !newEducation.field_of_study) {
      alert("Please fill in all required education fields")
      return
    }

    const education: Education = {
      id: Date.now().toString(),
      studentId: (user?.id).toString() || "",
      institution: newEducation.institution || "",
      degree: newEducation.degree || "",
      field_of_study: newEducation.field_of_study || "",
      startDate: newEducation.startDate || "",
      endDate: newEducation.endDate || "",
      gpa: newEducation.gpa || "",
      field: ""
    }

    
    setEducations([...educations, education])
    
    setNewEducation({
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    })
    setAddingEducation(false)
  }

  const handleRemoveEducation = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, save to API
    try {
      // Mock update
      if (student) {
        const updatedStudent: Student = {
          ...student,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          education: educations,
          
        }
        //console.log("updatedStudent", updatedStudent.education[educations.length - 1]);

        
        async function addEducationToServer(education: Education): Promise<Response> {
          try {
            console.log("this is saveInstitutionUser")
            console.log(education)
            const response = await axios.post<Response>('http://localhost:8081/student/education', education);
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
        addEducationToServer(updatedStudent.education[educations.length - 1]);
        

        setStudent(updatedStudent)
        setIsEditing(false)
        alert("Profile updated successfully!")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex">
          <Sidebar role="student" />
          <div className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-4">Loading profile...</h1>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex">
        <Sidebar role="student" />
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Student Profile</h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Education</h3>
                    {!addingEducation && (
                      <button
                        type="button"
                        onClick={() => setAddingEducation(true)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        + Add Education
                      </button>
                    )}
                  </div>

                  {educations.map((edu) => (
                    <div key={edu.id} className="mb-4 p-4 border rounded bg-gray-50 relative">
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(edu.id)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-medium">{edu.institution}</p>
                          <p>
                            {edu.degree} in {edu.field}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>
                            {new Date(edu.startDate).toLocaleDateString()} -{" "}
                            {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                          </p>
                          <p>GPA: {edu.gpa}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {addingEducation && (
                    <div className="mb-4 p-4 border rounded bg-gray-50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                          <input
                            type="text"
                            name="institution"
                            value={newEducation.institution}
                            onChange={handleEducationChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                          <input
                            type="text"
                            name="degree"
                            value={newEducation.degree}
                            onChange={handleEducationChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                          <input
                            type="text"
                            name="field_of_study"
                            value={String(newEducation.field_of_study)}
                            onChange={handleEducationChange}
                            className="w-full p-2 border rounded"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                          <input
                            type="text"
                            name="gpa"
                            value={newEducation.gpa}
                            onChange={handleEducationChange}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                          <input
                            type="date"
                            name="startDate"
                            value={newEducation.startDate}
                            onChange={handleEducationChange}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                          <input
                            type="date"
                            name="endDate"
                            value={newEducation.endDate}
                            onChange={handleEducationChange}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={() => setAddingEducation(false)}
                          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddEducation}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                    <p className="mt-1">{student?.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{student?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{student?.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Address</h3>
                    <p className="mt-1">{student?.address}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Education</h3>
                  {educations.length > 0 ? (
                    <div className="space-y-4">
                      {educations.map((edu) => (
                        <div key={edu.id} className="p-4 border rounded bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="font-medium">{edu.institution}</p>
                              <p>
                                {edu.degree} in {edu.field_of_study}
                              </p>
                            </div>
                            <div className="text-right">
                              <p>
                                {new Date(edu.startDate).toLocaleDateString()} -{" "}
                                {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : "Present"}
                              </p>
                              <p>GPA: {edu.gpa}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No education history added yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile


