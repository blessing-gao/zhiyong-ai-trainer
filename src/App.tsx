import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StudentLogin from "./pages/StudentLogin";
import CourseCenter from "./pages/CourseCenter";
import CourseLearning from "./pages/CourseLearning";
import TrainingCenter from "./pages/TrainingCenter";
import ChapterPractice from "./pages/ChapterPractice";
import SimulationExam from "./pages/SimulationExam";
import WrongQuestionsPractice from "./pages/WrongQuestionsPractice";
import ExamCenter from "./pages/ExamCenter";
import PersonalCenter from "./pages/PersonalCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/student-login" element={<StudentLogin />} />
              <Route path="/courses" element={<ProtectedRoute><CourseCenter /></ProtectedRoute>} />
              <Route path="/courses/:courseId/learn" element={<ProtectedRoute><CourseLearning /></ProtectedRoute>} />
              <Route path="/training" element={<ProtectedRoute><TrainingCenter /></ProtectedRoute>} />
              <Route path="/training/chapter/:chapterName" element={<ProtectedRoute><ChapterPractice /></ProtectedRoute>} />
              <Route path="/training/simulation/:examId" element={<ProtectedRoute><SimulationExam /></ProtectedRoute>} />
              <Route path="/training/wrong-questions" element={<ProtectedRoute><WrongQuestionsPractice /></ProtectedRoute>} />
              <Route path="/exam" element={<ProtectedRoute><ExamCenter /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><PersonalCenter /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
