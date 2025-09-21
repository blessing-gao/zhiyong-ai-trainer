import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import newLogo from "@/assets/new-logo.png";
import oilanText from "@/assets/oilan-text.png";

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: 'student' | 'admin' | null;
  onLogout?: () => void;
}

export const Header = ({ isLoggedIn = false, userType = null, onLogout }: HeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavClick = (path: string, requiresAuth = true) => {
    if (requiresAuth && !isLoggedIn) {
      toast({
        title: "需要登录",
        description: "请先登录后再访问此功能",
        variant: "destructive"
      });
      // 传递当前想访问的页面信息
      navigate('/login/student', { state: { from: { pathname: path } } });
      return;
    }
    navigate(path);
  };

  const handleExamCenter = () => {
    navigate('/login/exam');
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <img src={newLogo} alt="AI Logo" className="h-8 w-auto" />
            <span className="text-lg font-bold text-gray-800">iMedio.by</span>
          </Link>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">О компании</Link>
            <Link to="/courses" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Услуги</Link>
            <Link to="/training" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Проекты</Link>
            <Link to="/login/exam" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Контакты</Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="text-blue-600 border-blue-600 hover:bg-blue-50 rounded-full px-6"
            >
              Консультация
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};