// 导入Button组件，用于创建按钮元素
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
// 导入Logo图片资源
import webLogo from "@/assets/web_logo.svg";
import oilanText from "@/assets/new_text.svg";

// 定义Header组件为函数组件
const Header = () => {
  const { user, logout } = useAuth();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // 向下滚动时隐藏导航栏
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setVisible(false);
      } 
      // 向上滚动时显示导航栏
      else if (currentScrollY < lastScrollY) {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
  };

  // 导航链接数据
  const navLinks = [
    { to: "/", label: "首页" },
    { to: "/courses", label: "课程" },
    { to: "/training", label: "训练" },
    { to: "/exam", label: "考试" },
    { to: "/profile", label: "个人中心" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200/50 shadow-sm transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full px-[5%] py-4">
        <div className="flex items-center justify-between">
          {/* Logo区域 */}
          <Link to="/admin-login" className="flex items-center space-x-3 group">
            <img 
              src={webLogo} 
              alt="Web Logo" 
              className="h-9 w-auto transition-transform group-hover:scale-105 cursor-pointer" 
              title="点击进入管理员登录"
            />
            <img src={oilanText} alt="Oilan" className="h-[18px] w-auto" />
          </Link>

          {/* 导航链接区域 - 居中 */}
          <nav className="hidden md:flex flex-row items-center gap-[8vw]">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative text-lg text-gray-700 hover:text-black hover:font-bold transition-all duration-100 font-medium group"
              >
                {link.label}
                <span className="absolute left-0 right-0 bottom-[-20px] w-0 h-[8px] bg-[#67B3FF] rounded-full transition-all duration-100 group-hover:w-full mx-auto"></span>
              </Link>
            ))}
          </nav>

          {/* 右侧按钮区域 */}
          <div className="flex items-center space-x-3">
            {user && user.userType === "user" ? (
              <>
                <div className="h-8 w-px bg-gray-300 mr-6"></div>
                <div className="relative group">
                  <button className="relative text-lg text-gray-700 hover:text-black hover:font-bold transition-all duration-100 font-medium pb-1">
                    {user.realName || "用户"}
                    <span className="absolute left-0 right-0 bottom-[-20px] w-0 h-[8px] bg-[#67B3FF] rounded-full transition-all duration-100 group-hover:w-full mx-auto"></span>
                  </button>
                  <div className="absolute top-[calc(100%+24px)] left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 bg-white shadow-lg rounded-xl border border-gray-100 py-3 px-4 min-w-[140px]">
                    <button
                      className="w-full text-lg text-gray-700 hover:font-bold transition-all duration-100 text-center py-2"
                      onClick={handleLogout}
                    >
                      退出登录
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="h-8 w-px bg-gray-300 mr-6"></div>
                <Button
                  size="sm"
                  className="bg-[#67B3FF] hover:bg-[#5AA3EF] text-white text-lg rounded-full px-6"
                  asChild
                >
                  <Link to="/student-login">登录</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// 导出Header组件为默认导出
export default Header;