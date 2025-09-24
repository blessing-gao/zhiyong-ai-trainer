import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Courses } from "@/pages/Courses";
import { Training } from "@/pages/Training";
import { Profile } from "@/pages/Profile";
import { Admin } from "@/pages/Admin";
import { Exam } from "@/pages/Exam";
import { TheoryExam } from "@/pages/TheoryExam";
import { PracticalExam } from "@/pages/PracticalExam";
import { PracticeDetail } from "@/pages/PracticeDetail";
import { SimulationDetail } from "@/pages/SimulationDetail";
import { TrainingHistory } from "@/pages/TrainingHistory";
import { KnowledgeAnalysis } from "@/pages/KnowledgeAnalysis";
import NotFound from "./pages/NotFound";
import { CourseLearning } from "@/pages/CourseLearning";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);

  // 从localStorage恢复登录状态
  useEffect(() => {
    const savedLoginState = localStorage.getItem('loginState');
    if (savedLoginState) {
      const { isLoggedIn: savedIsLoggedIn, userType: savedUserType } = JSON.parse(savedLoginState);
      setIsLoggedIn(savedIsLoggedIn);
      setUserType(savedUserType);
    }
  }, []);

  const handleLogin = (type: 'student' | 'admin') => {
    setIsLoggedIn(true);
    setUserType(type);
    localStorage.setItem('loginState', JSON.stringify({ isLoggedIn: true, userType: type }));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
    localStorage.removeItem('loginState');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen w-full">
            <Header 
              isLoggedIn={isLoggedIn} 
              userType={userType} 
              onLogout={handleLogout} 
            />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login/:type" element={<Login onLogin={handleLogin} />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:courseId/learn" element={<CourseLearning />} />
              <Route path="/training" element={<Training />} />
              <Route path="/training/chapter/:chapterName" element={<PracticeDetail />} />
              <Route path="/training/simulation/:examId" element={<SimulationDetail />} />
              <Route path="/training/history" element={<TrainingHistory />} />
              <Route path="/training/analysis" element={<KnowledgeAnalysis />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/exam/theory" element={<TheoryExam />} />
              <Route path="/exam/practical" element={<PracticalExam />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
