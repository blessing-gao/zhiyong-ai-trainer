import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Home } from "@/pages/Home";
import { Login } from "@/pages/Login";
import { Courses } from "@/pages/Courses";
import { Training } from "@/pages/Training";
import { Profile } from "@/pages/Profile";
import { Admin } from "@/pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<'student' | 'admin' | null>(null);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType(null);
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
              <Route path="/login/:type" element={<Login />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/training" element={<Training />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
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
