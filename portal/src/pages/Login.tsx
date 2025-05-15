"use client"

import type React from "react"
import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { loginUser, setCurrentUser } from "@/services/authService"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { User, Building, GraduationCap, UserCog, School } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [university, setUniversity] = useState("")
  const [userType, setUserType] = useState("student")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // For professor, institution admin, and admission officer, university is required
      if (
        (userType === "professor" || userType === "institution_admin" || userType === "admission_officer") &&
        !university
      ) {
        toast({
          title: "University required",
          description: "Please select your university",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // For admin, check if using the fixed credentials
      if (userType === "admin") {
        const adminEmail = "admin@studyportal.com"
        const adminPassword = "Admin123!"

        if (email === adminEmail && password === adminPassword) {
          toast({
            title: "Admin credentials",
            description: "Using system administrator credentials",
          })
        }
      }

      //console.log("get user data");
      console.log("login attempt user type", userType);
      const user = loginUser(email, password, userType)
      console.log("get user data", user);
      //setCurrentUser(await user);
      login(await user);
      // Redirect will happen in login function
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const universityOptions = "";

  // Mock universities list
  const universities = [
    "Stanford University",
    "Harvard University",
    "MIT",
    "Oxford University",
    "Cambridge University",
    "ETH Zurich",
    "University of Amsterdam",
    "Green University of Bangladesh",
    "State University"
  ]

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Login to Study Portal</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <Tabs defaultValue="student" onValueChange={(value) => setUserType(value)}>
              <TabsList className="grid grid-cols-5 mb-4">
                <TabsTrigger value="student" className="flex items-center justify-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Student
                </TabsTrigger>
                <TabsTrigger value="institution" className="flex items-center justify-center">
                  <School className="mr-2 h-4 w-4" />
                  Institution
                </TabsTrigger>
                <TabsTrigger value="professor" className="flex items-center justify-center">
                  <User className="mr-2 h-4 w-4" />
                  Professor
                </TabsTrigger>
                <TabsTrigger value="admission_officer" className="flex items-center justify-center">
                  <Building className="mr-2 h-4 w-4" />
                  Admission
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center justify-center">
                  <UserCog className="mr-2 h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>
              <TabsContent value="student">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-studyportal-blue hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    <div className="text-center text-sm">
                      <span className="text-gray-600">Don't have an account?</span>
                      <div className="mt-2">
                        <Link to="/student/register" className="flex items-center justify-center">
                          <Button variant="outline" className="flex items-center">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Register as Student
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>

              <TabsContent value="institution">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Institution Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-studyportal-blue hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                    <div className="text-center text-sm">
                      <span className="text-gray-600">Don't have an account?</span>
                      <div className="mt-2">
                        <Link to="/institution/register" className="flex items-center justify-center">
                          <Button variant="outline" className="flex items-center">
                            <School className="mr-2 h-4 w-4" />
                            Register Institution
                          </Button>
                        </Link>
                      </div>
                    </div>
                    <div className="text-center text-xs text-gray-500 mt-2">
                      <p>Institutions require approval from system administrators before full access is granted.</p>
                    </div>
                  </CardFooter>
                </form>
              </TabsContent>

              <TabsContent value="professor">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="professor@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Select value={university} onValueChange={setUniversity} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni} value={uni}>
                              {uni}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-studyportal-blue hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="admission_officer">
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admission@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="university">University</Label>
                      <Select value={university} onValueChange={setUniversity} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your university" />
                        </SelectTrigger>
                        <SelectContent>
                          {universities.map((uni) => (
                            <SelectItem key={uni} value={uni}>
                              {uni}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-studyportal-blue hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              <TabsContent value="admin">
                <form onSubmit={ handleSubmit}{...(value:"admin") => setUserType(value)}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Admin Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@studyportal.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>System Admin Credentials:</strong>
                        <br />
                        Email: admin@studyportal.com
                        <br />
                        Password: Admin123!
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-studyportal-blue hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
            <div className="px-6 pb-6 text-center">
              <Link to="/" className="text-sm text-gray-600 hover:text-studyportal-blue">
                Back to Home
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default Login
