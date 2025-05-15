import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import GigsPage from "./pages/GigsPage"
import GigDetail from "./pages/GigDetail"
import NotFound from "./pages/NotFound"
import { AuthProvider } from "./contexts/AuthContext"
import StudentRegistration from "./pages/student/Registration"
import StudentPayment from "./pages/student/Payment"
import InstitutionRegistration from "./pages/institution/Registration"
import Login from "./pages/Login"
import StudentDashboard from "./pages/student/Dashboard"
import CourseDetail from "./pages/student/CourseDetail"
import MyApplications from "./pages/student/MyApplications"
import SavedPrograms from "./pages/student/SavedPrograms"
import InstitutionDashboard from "./pages/institution/Dashboard"
import AddCourse from "./pages/institution/AddCourse"
import ManageApplications from "./pages/institution/ManageApplications"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminDashboard from "./pages/admin/Dashboard"
import InstitutionApprovals from "./pages/admin/InstitutionApprovals"
import StudentDocuments from "./pages/student/Documents"
import StudentProfessors from "./pages/student/Professors"
import InstitutionScholarships from "./pages/institution/Scholarships"
import StudentProfile from "./pages/student/Profile"
import ApplicationForm from "./pages/student/ApplicationForm"
import StudentNotifications from "./pages/student/Notifications"
import Scholarship from "./pages/student/Scholarships"
import ProfessorDashboard from "./pages/professor/Dashboard"
import AdmissionApplicationReview from "./pages/admission/ApplicationReview"
import ViewApplication from "./pages/institution/ViewApplication"
import AddEmployee from "./pages/institution/AddEmployee"
import ApplicationReview from "./pages/admission/ApplicationReview"
import ManageProfile from "./pages/professor/ManageProfile"
import WriteRecommendation from "./pages/professor/WriteRecommendation"

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gigs" element={<GigsPage />} />
            <Route path="/gig/:id" element={<GigDetail />} />
            <Route path="/login" element={<Login />} />

            {/* Student Routes */}
            <Route path="/student/register" element={<StudentRegistration />} />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/applications"
              element={
                <ProtectedRoute requiredRole="student">
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/course/:degree/:id"
              element={
                <ProtectedRoute requiredRole="student">
                  <CourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/documents"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/professors"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentProfessors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/application-form/:id"
              element={
                <ProtectedRoute requiredRole="student">
                  <ApplicationForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/notifications"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentNotifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/SavedPrograms"
              element={
                <ProtectedRoute requiredRole="student">
                  <SavedPrograms />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/scholarship"
              element={
                <ProtectedRoute requiredRole="student">
                  <Scholarship />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/StudentPayment"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentPayment />
                </ProtectedRoute>
              }
            />



            {/* Institution Routes */}
            <Route path="/institution/register" element={<InstitutionRegistration />} />
            <Route
              path="/institution/dashboard"
              element={
                <ProtectedRoute requiredRole="institution">
                  <InstitutionDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/add-employee"
              element={
                <ProtectedRoute requiredRole="institution">
                  <AddEmployee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/add-course"
              element={
                <ProtectedRoute requiredRole="institution">
                  <AddCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/applications"
              element={
                <ProtectedRoute requiredRole="institution">
                  <ManageApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/application/:id"
              element={
                <ProtectedRoute requiredRole="institution">
                  <ViewApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/institution/scholarships"
              element={
                <ProtectedRoute requiredRole="institution">
                  <InstitutionScholarships />
                </ProtectedRoute>
              }
            />

            {/* Professor Routes */}
            <Route
              path="/professor/dashboard"
              element={
                <ProtectedRoute requiredRole="professor">
                  <ProfessorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/manageprofile"
              element={
                <ProtectedRoute requiredRole="professor">
                  <ManageProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pages/institution/application/:id"
              element={
                <ProtectedRoute requiredRole="professor">
                  <ViewApplication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/professor/writeRecommendation/:id"
              element={
                <ProtectedRoute requiredRole="professor">
                  <WriteRecommendation />
                </ProtectedRoute>
              }
            />
          

            {/* Admission Officer Routes */}
            <Route
              path="/admission/application/:id"
              element={
                <ProtectedRoute requiredRole="admission_officer">
                  <AdmissionApplicationReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admission/dashboard"
              element={
                <ProtectedRoute requiredRole="admission_officer">
                  <ApplicationReview />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/approvals"
              element={
                <ProtectedRoute requiredRole="admin">
                  <InstitutionApprovals />
                </ProtectedRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
