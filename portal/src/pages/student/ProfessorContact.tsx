"use client"

import type React from "react"
import { useState } from "react"
import Layout from "../../components/Layout"
import { useAuth } from "../../contexts/AuthContext"

interface Professor {
  id: string
  name: string
  email: string
  institution: string
  department: string
  profileImage: string
  researchInterests: string[]
}

// Mock data for professors
const mockProfessors: Professor[] = [
  {
    id: "prof1",
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@mit.edu",
    institution: "MIT",
    department: "Computer Science",
    profileImage: "/placeholder.svg?height=150&width=150",
    researchInterests: ["Artificial Intelligence", "Machine Learning", "Computer Vision"],
  },
  {
    id: "prof2",
    name: "Dr. Michael Chen",
    email: "michael.chen@stanford.edu",
    institution: "Stanford University",
    department: "Electrical Engineering",
    profileImage: "/placeholder.svg?height=150&width=150",
    researchInterests: ["Robotics", "Control Systems", "Embedded Systems"],
  },
  {
    id: "prof3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@berkeley.edu",
    institution: "UC Berkeley",
    department: "Data Science",
    profileImage: "/placeholder.svg?height=150&width=150",
    researchInterests: ["Big Data Analytics", "Statistical Learning", "Data Visualization"],
  },
]

const ProfessorContactPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const filteredProfessors = mockProfessors.filter(
    prof => 
      prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prof.researchInterests.some(interest => 
        interest.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setAttachments([...attachments, ...fileArray]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfessor) return;
    
    setSending(true);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Reset form and show success message
    setSubject('');
    setMessage('');
    setAttachments([]);
    setSending(false);
    setSentSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setSentSuccess(false);
    }, 3000);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Professors</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Professor List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search professors..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="overflow-y-auto max-h-[600px]">
              {filteredProfessors.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No professors found matching your search.
                </div>
              ) : (
                filteredProfessors.map(professor => (
                  <div 
                    key={professor.id}
                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${selectedProfessor?.id === professor.id ? 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedProfessor(professor)}
                  >
                    <div className="flex items-center">
                      <img 
                        src={professor.profileImage || "/placeholder.svg"} 
                        alt={professor.name} 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{professor.name}</h3>
                        <p className="text-sm text-gray-600">{professor.department}, {professor.institution}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* Email Composer */}
          <div className="lg:col-span-2">
            {selectedProfessor ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center">
                    <img 
                      src={selectedProfessor.profileImage || "/placeholder.svg"} 
                      alt={selectedProfessor.name} 
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-gray-900">{selectedProfessor.name}</h2>
                      <p className="text-gray-600">{selectedProfessor.email}</p>
                      <p className="text-sm text-gray-500">{selectedProfessor.department}, {selectedProfessor.institution}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">Research Interests:</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {selectedProfessor.researchInterests.map((interest, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <form onSubmit={handleSendEmail} className="p-6">
                  {sentSuccess && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                      Email sent successfully to {selectedProfessor.name}!
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={8}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Attachments
                    </label>
                    <div className="flex items-center">
                      <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <span className="text-blue-600">Add files</span>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className="ml-2 text-sm text-gray-500">
                        {attachments.length} {attachments.length === 1 ? 'file' : 'files'} selected
                      </span>
                    </div>
                    
                    {attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeAttachment(index)}
                              className="text-red-600 hover:text-red-\
