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
    navigate('/exam');
  };

  return (
    <header className="bg-white border-b border-border shadow-soft sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and System Name */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img src={newLogo} alt="智涌·人工智能中心" className="h-12 w-auto" />
            <img src={oilanText} alt="oilan.ai" className="h-8 w-auto" />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {userType === 'admin' ? (
              // 管理员导航
              <Link 
                to="/admin" 
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                管理中心
              </Link>
            ) : (
              // 普通用户导航
              <>
                <Link 
                  to="/" 
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  首页
                </Link>
                <button
                  onClick={() => handleNavClick('/courses')}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  课程中心
                </button>
                <button
                  onClick={() => handleNavClick('/training')}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  训练中心
                </button>
                <button
                  onClick={handleExamCenter}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  考试中心
                </button>
                <button
                  onClick={() => handleNavClick('/profile')}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  个人中心
                </button>
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {!isLoggedIn ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/login/student')}
                  className="hidden sm:inline-flex"
                >
                  学生登录
                </Button>
                <Button 
                  onClick={() => navigate('/login/admin')}
                  className="gradient-primary text-white hover:opacity-90"
                >
                  管理员登录
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground">
                  欢迎，{userType === 'admin' ? '管理员' : '学生'}
                </span>
                <Button variant="outline" onClick={onLogout}>
                  退出登录
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};