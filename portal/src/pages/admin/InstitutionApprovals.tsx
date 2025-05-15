"use client"
import { useState, useEffect } from "react"
import Layout from "../../components/Layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Building, CheckCircle, XCircle, Search, ExternalLink, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import getUsers, { saveUsers } from "@/services/authService"
import type { User } from "@/models/types"
import axios from 'axios';

const InstitutionApprovals = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const [institutions, setInstitutions] = useState<{
    pending: User[]
    approved: User[]
    rejected: User[]
  }>({
    pending: [],
    approved: [],
    rejected: [],
  })
  const { toast } = useToast()

  // Load institutions from storage
  useEffect(() => {
    loadInstitutions()
  }, [])

  const loadInstitutions = async () => {
    const allUsers = getUsers()
    const institutionUsers = (await allUsers).filter((user) => user.role === "institution")

    const pending = institutionUsers.filter((user) => !user.isApproved && !user.isRejected)
    const approved = institutionUsers.filter((user) => user.isApproved)
    const rejected = institutionUsers.filter((user) => user.isRejected)

    setInstitutions({
      pending,
      approved,
      rejected,
    })
  }

  // Filter institutions based on search term
  const filteredPending = institutions.pending.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredApproved = institutions.approved.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRejected = institutions.rejected.filter(
    (inst) =>
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )


  async function updatePending(users: User): Promise<Response> {
    try {
      console.log("this is updateInstitutionUser")
      console.log(users)
      const response = await axios.put<Response>('http://localhost:8081/institution/institutionregister/updatePending', users);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Updation failed');
      } else {
        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred');
      }
    }
  }

  const handleApprove = async (id: number) => {
    const userData: User = {
      isRejected: false,
      role: "institution",
      isRegistered: true,
      isApproved: true,
      approvedDate: new Date().toISOString(),
      id: id,
      email: "",
      password: "",
      name: ""
    }
    // const allUsers = getUsers()
    // const updatedUsers = (await allUsers).map((user) => {
    //   if (user.id === id) {
    //     return {
    //       ...user,
    //       isApproved: true,
    //       isRegistered: true,
    //       isRejected: false,
    //       approvedDate: new Date().toISOString(),
    //     }
    //   }
    //   updatePending(user)
    //   return user
    // })

    // updatedUsers.forEach((user) => updatePending(user))
    // loadInstitutions()

    updatePending(userData);
    loadInstitutions()
    
    toast({
      title: "Institution approved",
      description: "The institution has been approved successfully",
    })
  }

  const handleReject = async (id: number, reason = "Did not meet our requirements") => {
    //const allUsers = getUsers()
    // const updatedUsers = (await allUsers).map((user) => {
    //   if (user.id === id) {
    //     return {
    //       ...user,
    //       isApproved: false,
    //       isRejected: true,
    //       rejectedDate: new Date().toISOString(),
    //       rejectionReason: reason,
    //     }
    //   }
    //   saveUsers(user)
    //   return user
    // })

    //saveUsers(updatedUsers)
    const userData: User = {
      isRejected: true,
      role: "institution",
      isRegistered: false,
      isApproved: false,
      rejectedDate: new Date().toISOString(),
      id: id,
      email: "",
      password: "",
      name: ""
    }
    updatePending(userData);
    loadInstitutions()

    toast({
      title: "Institution rejected",
      description: "The institution has been rejected",
      variant: "destructive",
    })
  }

  const handleReconsider = async (id: number) => {
    // const allUsers = getUsers()
    // const updatedUsers = (await allUsers).map((user) => {
    //   if (user.id === id) {
    //     return {
    //       ...user,
    //       isApproved: false,
    //       isRejected: false,
    //       rejectedDate: undefined,
    //       rejectionReason: undefined,
    //     }
    //   }
    //   saveUsers(user)
    //   return user
    // })

    // //saveUsers(updatedUsers)
    // loadInstitutions()

    const userData: User = {
      isRejected: false,
      role: "institution",
      isRegistered: false,
      isApproved: false,
      rejectedDate: null,
      id: id,
      email: "",
      password: "",
      name: ""
    }
    updatePending(userData);
    loadInstitutions()
    
    toast({
      title: "Institution reconsidered",
      description: "The institution has been moved back to pending",
    })
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Institution Approvals</h1>
            <p className="text-gray-600 mt-2">Manage institution registration requests</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search institutions..."
                className="pl-10 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="pending" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Pending
              <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {institutions.pending.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="approved" className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approved
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {institutions.approved.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="flex items-center">
              <XCircle className="mr-2 h-4 w-4" />
              Rejected
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {institutions.rejected.length}
              </span>
            </TabsTrigger>
            </TabsList>

          <TabsContent value="pending">
            <div className="space-y-6">
              {filteredPending.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Building className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Pending Institutions</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchTerm
                        ? "No institutions match your search criteria."
                        : "There are no institutions waiting for approval."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredPending.map((institution) => (
                  <Card key={institution.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-xl font-bold">{institution.name}</h3>
                          <p className="text-gray-600">{institution.email}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Location:</span> {institution.location || "Not specified"}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Website:</span>{" "}
                              {institution.website ? (
                                <a
                                  href={institution.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-studyportal-blue hover:underline flex items-center inline-flex"
                                >
                                  {institution.website.replace("https://www.", "")}
                                  <ExternalLink size={12} className="ml-1" />
                                </a>
                              ) : (
                                "Not specified"
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Registered:</span>{" "}
                              {new Date(institution.registrationDate || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-3 text-gray-700">{institution.description || "No description provided."}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => handleApprove(institution.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle size={16} className="mr-2" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleReject(institution.id)}
                          >
                            <XCircle size={16} className="mr-2" />
                            Reject
                          </Button>
                          <Button variant="outline">View Details</Button>
                          
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="approved">
            <div className="space-y-6">
              {filteredApproved.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Approved Institutions</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchTerm
                        ? "No institutions match your search criteria."
                        : "There are no approved institutions yet."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredApproved.map((institution) => (
                  <Card key={institution.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <h3 className="text-xl font-bold">{institution.name}</h3>
                            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                              <CheckCircle size={12} className="mr-1" />
                              Approved
                            </span>
                          </div>
                          <p className="text-gray-600">{institution.email}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Location:</span> {institution.location || "Not specified"}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Website:</span>{" "}
                              {institution.website ? (
                                <a
                                  href={institution.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-studyportal-blue hover:underline flex items-center inline-flex"
                                >
                                  {institution.website.replace("https://www.", "")}
                                  <ExternalLink size={12} className="ml-1" />
                                </a>
                              ) : (
                                "Not specified"
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Approved on:</span>{" "}
                              {new Date(institution.approvedDate || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <p className="mt-3 text-gray-700">{institution.description || "No description provided."}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline">View Details</Button>
                          <Button 
                            variant="outline" 
                            className="border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleReject(institution.id, "Approval revoked by administrator")}
                          >
                            Revoke Approval
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="rejected">
            <div className="space-y-6">
              {filteredRejected.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <XCircle className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No Rejected Institutions</h3>
                    <p className="text-gray-500 text-center max-w-md">
                      {searchTerm
                        ? "No institutions match your search criteria."
                        : "There are no rejected institutions."}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredRejected.map((institution) => (
                  <Card key={institution.id}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                          <div className="flex items-center">
                            <h3 className="text-xl font-bold">{institution.name}</h3>
                            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                              <XCircle size={12} className="mr-1" />
                              Rejected
                            </span>
                          </div>
                          <p className="text-gray-600">{institution.email}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Location:</span> {institution.location || "Not specified"}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Website:</span>{" "}
                              {institution.website ? (
                                <a
                                  href={institution.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-studyportal-blue hover:underline flex items-center inline-flex"
                                >
                                  {institution.website.replace("https://www.", "")}
                                  <ExternalLink size={12} className="ml-1" />
                                </a>
                              ) : (
                                "Not specified"
                              )}
                            </p>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium">Rejected on:</span>{" "}
                              {new Date(institution.rejectedDate || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-3 p-3 bg-red-50 rounded-md">
                            <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                            <p className="text-sm text-red-700">
                              {institution.rejectionReason || "No reason provided."}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline">View Details</Button>
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleReconsider(institution.id)}
                          >
                            <AlertCircle size={16} className="mr-2" />
                            Reconsider
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default InstitutionApprovals;
