"use client"
import Layout from "@/components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Search, Globe, BookOpen, GraduationCap, Award, User, Building } from "lucide-react"
import { getPrograms } from "@/services/programService"
import { useAuth } from "@/contexts/AuthContext"
import React from "react"

const Index = () => {
  const { isAuthenticated, isStudent, isInstitution } = useAuth()
  const featuredPrograms = getPrograms().slice(0, 4)
  const [programCount, setProgramCount] = React.useState<number | null>(null)
  const [institutionCount, setInstitutionCount] = React.useState<number | null>(null)
  const [countryCount, setCountryCount] = React.useState<number | null>(null)
  const [studentCount, setStudentCount] = React.useState<number | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const count = await fetchCountPrograms()
        const institutionCount = await fetchCountInstitutions()
        const studentCount = await fetchCountStudents()
        //console.log("count:", count);
        setProgramCount(count)
        setInstitutionCount(institutionCount)
        setCountryCount(count)
        setStudentCount(studentCount)
      } catch (error) {
        console.error("Failed to fetch program count:", error)
      }
    }
    fetchData()
  }, [])

  const fetchCountPrograms = async (): Promise<any> => {
    const response = await fetch("http://localhost:8081/commoninfo/programcount");
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    //console.log("Program count:", data[0].program_count);
    return data[0].program_count
  }

  const fetchCountInstitutions = async (): Promise<any> => {
    const response = await fetch("http://localhost:8081/commoninfo/institutioncount")
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data[0].institution_count; 
  }
  
  const fetchCountCountries = async (): Promise<any> => {
    const response = await fetch("http:localhost:8081//commoninfo/countrycount");
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data[0].unique_location_count 
  }


  const fetchCountStudents = async (): Promise<any> => {
    const response = await fetch("http://localhost:8081/commoninfo/studentcount")
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const data = await response.json()
    return data[0].student_count 
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-studyportal-lightBlue py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-studyportal-blue mb-6">
              Find Your Perfect Study Program Abroad
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Compare thousands of programs and courses from universities worldwide
            </p>

            {/* Registration/Login Options */}
            {!isAuthenticated && (
              <div className="flex flex-col md:flex-row gap-6 justify-center mb-12">
                <Link to="/login">
                  <Button size="lg" className="w-full md:w-auto bg-studyportal-blue hover:bg-blue-700">
                    <User className="mr-2" />
                    I'm a Student
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" className="w-full md:w-auto bg-studyportal-orange hover:bg-orange-600">
                    <Building className="mr-2" />
                    I'm an Institution
                  </Button>
                </Link>
              </div>
            )}

            {/* Go to Dashboard */}
            {isAuthenticated && (
              <div className="mb-12">
                <Link to={isStudent ? "/student/dashboard" : "/institution/dashboard"}>
                  <Button size="lg" className="bg-studyportal-blue hover:bg-blue-700">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="What do you want to study?"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyportal-blue"
                  />
                </div>
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Where? (country or city)"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyportal-blue"
                  />
                </div>
                <Button className="bg-studyportal-blue hover:bg-blue-700 text-white p-3 rounded-md whitespace-nowrap">
                  <Search size={20} className="mr-2" />
                  Search Programs
                </Button>
              </div>
              
          </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="mb-4 flex justify-center">
                <BookOpen size={40} className="text-studyportal-blue" />
              </div>
              <h3 className="text-3xl font-bold text-studyportal-blue mb-2">{programCount}+</h3>
              <p className="text-gray-600">Programs Available</p>
            </div>

            <div className="p-6">
              <div className="mb-4 flex justify-center">
                <GraduationCap size={40} className="text-studyportal-blue" />
              </div>
              <h3 className="text-3xl font-bold text-studyportal-blue mb-2">{institutionCount}+</h3>
              <p className="text-gray-600">Educational Institutions</p>
            </div>

            <div className="p-6">
              <div className="mb-4 flex justify-center">
                <Globe size={40} className="text-studyportal-blue" />
              </div>
              <h3 className="text-3xl font-bold text-studyportal-blue mb-2">{countryCount}+</h3>
              <p className="text-gray-600">Countries Represented</p>
            </div>

            <div className="p-6">
              <div className="mb-4 flex justify-center">
                <Award size={40} className="text-studyportal-blue" />
              </div>
              <h3 className="text-3xl font-bold text-studyportal-blue mb-2">{studentCount}+</h3>
              <p className="text-gray-600">Students Helped Annually</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-studyportal-blue mb-4">Featured Programs</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked selection of top educational programs from leading universities around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredPrograms.map((program) => (
              <Card
                key={program.id}
                className="overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <img src={program.imageUrl} alt={program.title} className="h-48 w-full object-cover" />
                <CardContent className="p-5">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="mr-2">{program.degree}</span>
                    <span className="mx-2">•</span>
                    <span>{program.discipline}</span>
                  </div>
                  <h3 className="text-lg font-bold mb-1 text-studyportal-blue">{program.title}</h3>
                  <p className="text-gray-700 mb-3">{program.university}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Globe size={16} className="mr-1" />
                    <span>{program.location}</span>
                  </div>
                  <Link to={`/gig/${program.id}`}>
                    <Button className="w-full bg-studyportal-blue hover:bg-blue-700">View Program</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/gigs">
              <Button size="lg" className="bg-studyportal-blue hover:bg-blue-700">
                View All Programs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Study Destinations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-studyportal-blue mb-4">Popular Study Destinations</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top countries for international education with world-class universities and diverse cultural
              experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1500313830540-7b6650a74fd0"
                alt="United States"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">United States</h3>
                  <p className="text-white/80 mb-3">5,000+ programs at 1,200+ universities</p>
                  <Button
                    variant="outline"
                    className="text-black border-white hover:bg-white hover:text-studyportal-blue"
                  >
                    Explore Programs
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1500313830540-7b6650a74fd0"
                alt="United Kingdom"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">United Kingdom</h3>
                  <p className="text-white/80 mb-3">3,800+ programs at 450+ universities</p>
                  <Button
                    variant="outline"
                    className="text-black border-white hover:bg-white hover:text-studyportal-blue"
                  >
                    Explore Programs
                  </Button>
                </div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1500313830540-7b6650a74fd0"
                alt="Australia"
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-6 w-full">
                  <h3 className="text-xl font-bold text-white mb-2">Australia</h3>
                  <p className="text-white/80 mb-3">2,500+ programs at 190+ universities</p>
                  <Link to={`/gigs/`}>
                  <Button
                    variant="outline"
                    className="text-black border-white hover:bg-white hover:text-studyportal-blue"
                  >
                    Explore Programs
                  </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-studyportal-lightBlue">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-studyportal-blue mb-6">What Our Students Say</h2>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <p className="text-xl text-gray-700 italic mb-6">
                "CareerCompass helped me find my dream program in Canada. The detailed information about the courses,
                admission requirements, and scholarship opportunities made my decision so much easier. I'm now
                completing my Master's degree at the University of Toronto!"
              </p>
              <div className="flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1619946794135-5bc917a27793"
                  alt="Student Testimonial"
                  className="w-16 h-16 rounded-full mr-4 object-cover"
                />
                <div className="text-left">
                  <h4 className="font-semibold text-gray-900">Maria Rodriguez</h4>
                  <p className="text-gray-600">MSc in Computer Science, University of Toronto</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Index
