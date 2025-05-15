"use client"

import React, { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Search, Globe, Filter, Check } from "lucide-react"
import { getPrograms } from "@/services/programService"
import type { Program } from "@/models/types"

const GigsPage = () => {
  const allPrograms = getPrograms()
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(allPrograms)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter states
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([])
  const [selectedDegrees, setSelectedDegrees] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  // Get unique disciplines, degrees, and countries
  const disciplines = [...new Set(allPrograms.map((program) => program.discipline))]
  const degrees = [...new Set(allPrograms.map((program) => program.degree))]
  const countries = [...new Set(allPrograms.map((program) => program.location.split(",")[0].trim()))]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    filterPrograms()
  }

  const toggleDiscipline = (discipline: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(discipline) ? prev.filter((d) => d !== discipline) : [...prev, discipline],
    )
  }

  const toggleDegree = (degree: string) => {
    setSelectedDegrees((prev) => (prev.includes(degree) ? prev.filter((d) => d !== degree) : [...prev, degree]))
  }

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) => (prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]))
  }

  const filterPrograms = () => {
    let results = allPrograms

    // Apply search term filter
    if (searchTerm) {
      results = results.filter(
        (program) =>
          program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.university.toLowerCase().includes(searchTerm.toLowerCase()) ||
          program.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply discipline filter
    if (selectedDisciplines.length > 0) {
      results = results.filter((program) => selectedDisciplines.includes(program.discipline))
    }

    // Apply degree filter
    if (selectedDegrees.length > 0) {
      results = results.filter((program) => selectedDegrees.includes(program.degree))
    }

    // Apply country filter
    if (selectedCountries.length > 0) {
      results = results.filter((program) => {
        const programCountry = program.location.split(",")[0].trim()
        return selectedCountries.includes(programCountry)
      })
    }

    setFilteredPrograms(results)
  }

  // Apply filters when they change
  React.useEffect(() => {
    filterPrograms()
  }, [selectedDisciplines, selectedDegrees, selectedCountries])

  return (
    <Layout>
      {/* Header */}
      <section className="bg-studyportal-lightBlue py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-studyportal-blue mb-6">Find Your Ideal Study Program</h1>
            <p className="text-lg text-gray-700 mb-8">
              Browse through {allPrograms.length}+ programs from top universities worldwide
            </p>

            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search for programs, universities or keywords..."
                className="flex-grow p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-studyportal-blue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" className="bg-studyportal-blue hover:bg-blue-700 text-white p-3 rounded-md">
                <Search size={20} className="mr-2" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-gray-50 p-6 rounded-lg sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">
                    <Filter size={20} className="inline mr-2" />
                    Filters
                  </h3>
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-500"
                    onClick={() => {
                      setSelectedDisciplines([])
                      setSelectedDegrees([])
                      setSelectedCountries([])
                      setSearchTerm("")
                      setFilteredPrograms(allPrograms)
                    }}
                  >
                    Clear All
                  </Button>
                </div>

                {/* Discipline Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Discipline</h4>
                  <div className="space-y-2">
                    {disciplines.map((discipline) => (
                      <label key={discipline} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-studyportal-blue focus:ring-studyportal-blue"
                          checked={selectedDisciplines.includes(discipline)}
                          onChange={() => toggleDiscipline(discipline)}
                        />
                        <span className="text-gray-700">{discipline}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Degree Level Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Degree Level</h4>
                  <div className="space-y-2">
                    {degrees.map((degree) => (
                      <label key={degree} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-studyportal-blue focus:ring-studyportal-blue"
                          checked={selectedDegrees.includes(degree)}
                          onChange={() => toggleDegree(degree)}
                        />
                        <span className="text-gray-700">{degree}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Country Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Country</h4>
                  <div className="space-y-2">
                    {countries.map((country) => (
                      <label key={country} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2 h-4 w-4 text-studyportal-blue focus:ring-studyportal-blue"
                          checked={selectedCountries.includes(country)}
                          onChange={() => toggleCountry(country)}
                        />
                        <span className="text-gray-700">{country}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Program Listings */}
            <div className="lg:w-3/4">
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600">Showing {filteredPrograms.length} programs</p>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">Sort by:</span>
                  <select className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-studyportal-blue">
                    <option>Relevance</option>
                    <option>Ranking: High to Low</option>
                    <option>Tuition: Low to High</option>
                    <option>Duration: Short to Long</option>
                  </select>
                </div>
              </div>

              {filteredPrograms.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No programs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
                  <Button
                    onClick={() => {
                      setSelectedDisciplines([])
                      setSelectedDegrees([])
                      setSelectedCountries([])
                      setSearchTerm("")
                      setFilteredPrograms(allPrograms)
                    }}
                    className="bg-studyportal-blue hover:bg-blue-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredPrograms.map((program) => (
                    <Card
                      key={program.id}
                      className="overflow-hidden transition-transform duration-300 hover:shadow-lg"
                    >
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3">
                          <img
                            src={program.imageUrl || "/placeholder.svg"}
                            alt={program.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="md:w-2/3">
                          <CardContent className="p-6">
                            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-2 gap-2">
                              <span className="bg-studyportal-lightBlue text-studyportal-blue px-2 py-1 rounded-md">
                                {program.degree}
                              </span>
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                                {program.discipline}
                              </span>
                              {program.scholarships && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center">
                                  <Check size={14} className="mr-1" /> Scholarships
                                </span>
                              )}
                            </div>

                            <h3 className="text-xl font-bold mb-1 text-studyportal-blue">{program.title}</h3>
                            <p className="text-gray-700 mb-2 font-medium">{program.university}</p>

                            <div className="flex items-center text-sm text-gray-500 mb-3">
                              <Globe size={16} className="mr-1" />
                              <span>{program.location}</span>
                            </div>

                            <p className="text-gray-600 mb-4 line-clamp-2">{program.description}</p>

                            <div className="flex flex-wrap gap-4 mb-4 text-sm">
                              <div>
                                <span className="text-gray-500">Duration:</span>
                                <span className="ml-1 font-medium">{program.duration}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Tuition:</span>
                                <span className="ml-1 font-medium">{program.tuitionFee}</span>
                              </div>
                              {program.deadline && (
                                <div>
                                  <span className="text-gray-500">Deadline:</span>
                                  <span className="ml-1 font-medium">{program.deadline}</span>
                                </div>
                              )}
                            </div>

                            <Link to={`/gig/${program.id}`}>
                              <Button className="w-full md:w-auto bg-studyportal-blue hover:bg-blue-700">
                                View Program Details
                              </Button>
                            </Link>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default GigsPage
