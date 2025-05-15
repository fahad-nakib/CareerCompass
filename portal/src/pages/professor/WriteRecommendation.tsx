"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Loader2, ArrowLeft, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { v4 as uuidv4 } from 'uuid';

interface RecommendationRequest {
  id: string
  student_name: string
  program_id: string
  university: string
  updated_at: string
}

const WriteRecommendation = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [letter, setLetter] = useState("")
  const [studentInfo, setStudentInfo] = useState<RecommendationRequest | null>(null)
  const [characterCount, setCharacterCount] = useState(0)

  // Get student info from location state or fetch it
  useEffect(() => {
    const fetchStudentInfo = async () => {
      if (location.state?.studentInfo) {
        setStudentInfo(location.state.studentInfo)
        return
      }

      if (!id) {
        toast({
          title: "Error",
          description: "No recommendation request ID provided.",
          variant: "destructive",
        })
        navigate("/professor/dashboard")
        return
      }

      setLoading(true)
      try {
        // In a real app, you would fetch the specific recommendation request
        // For now, we'll use mock data
        const mockStudentInfo: RecommendationRequest = {
          id: id,
          student_name: "Md. Fahad Nakib",
          program_id: "Bsc in Computer Science",
          university: "Green University of Bangladesh",
          updated_at: new Date().toISOString(),
        }
        setStudentInfo(mockStudentInfo)
      } catch (error) {
        console.error("Error fetching student info:", error)
        toast({
          title: "Error",
          description: "Failed to load student information. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStudentInfo()
  }, [id, location.state, navigate, toast])

  // Update character count when letter changes
  useEffect(() => {
    setCharacterCount(letter.length)
  }, [letter])

  const handleLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLetter(e.target.value)
  }

  const handleSubmit = async () => {
    if (!letter.trim()) {
      toast({
        title: "Error",
        description: "Please write a recommendation letter before submitting.",
        variant: "destructive",
      })
      return
    }

    if (!studentInfo) {
      toast({
        title: "Error",
        description: "Student information is missing.",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      // Prepare the data to be sent
      const recommendationData = {
        id: uuidv4(),
        author_id: (user?.id).toString(),
        application_id: studentInfo.id,
        //student_id: studentInfo.id,
        comment: letter,
      }
      console.log("Recommendation Data:", JSON.stringify(recommendationData));
      

      // Make the API call
      const response = await fetch("http://localhost:8081/student/addcomment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recommendationData),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      toast({
        title: "Success",
        description: "Recommendation letter submitted successfully.",
      })

      // Navigate back to dashboard
      navigate("/professor/dashboard")
    } catch (error) {
      console.error("Error submitting recommendation:", error)
      toast({
        title: "Error",
        description: "Failed to submit recommendation letter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-studyportal-blue" />
            <p className="text-gray-600">Loading student information...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
          onClick={() => navigate("/professor/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Write Recommendation Letter</CardTitle>
            <CardDescription>Provide a recommendation letter for the student's application</CardDescription>
          </CardHeader>
          <CardContent>
            {studentInfo && (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{studentInfo.student_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium">{studentInfo.student_name}</h3>
                  <p className="text-sm text-gray-600">{studentInfo.program_id}</p>
                  <p className="text-sm text-gray-600">{studentInfo.university}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Requested on {new Date(studentInfo.updated_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Textarea
                  placeholder="Write your recommendation letter here..."
                  className="min-h-[300px] p-4"
                  value={letter}
                  onChange={handleLetterChange}
                />
                <p className="text-xs text-gray-500 mt-2 text-right">{characterCount} characters</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Tips for writing an effective recommendation:
                </h4>
                <ul className="text-xs text-blue-700 list-disc pl-5 space-y-1">
                  <li>Be specific about the student's strengths and achievements</li>
                  <li>Provide concrete examples of their work and capabilities</li>
                  <li>Relate their skills to the program they're applying for</li>
                  <li>Mention how long and in what capacity you've known the student</li>
                  <li>Be honest but supportive in your assessment</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => navigate("/professor/dashboard")}>
              Cancel
            </Button>
            <Button
              className="bg-studyportal-blue hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={submitting || !letter.trim()}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Submit Recommendation
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  )
}

export default WriteRecommendation
