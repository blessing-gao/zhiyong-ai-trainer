// 导入Button组件，用于创建按钮元素
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { GripVertical, MoreHorizontal } from "lucide-react";
// 导入Logo图片资源
import webLogo from "@/assets/web_logo.svg";
import oilanText from "@/assets/oilan-text.svg";

type NavPosition = "horizontal" | "vertical";

// 定义Header组件为函数组件
const Header = () => {
  const { user, userRole, logout } = useAuth();
  const [position, setPosition] = useState<NavPosition>(() => {
    const saved = localStorage.getItem("navPosition");
    return (saved as NavPosition) || "horizontal";
  });

  useEffect(() => {
    localStorage.setItem("navPosition", position);
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new CustomEvent("navPositionChange", { detail: position }));
  }, [position]);

  const togglePosition = () => {
    setPosition(position === "horizontal" ? "vertical" : "horizontal");
  };

  const handleLogout = () => {
    logout();
  };

  // 导航链接数据
  const navLinks = [
    { to: "/", label: "首页" },
    { to: "/courses", label: "课程中心" },
    { to: "/training", label: "训练中心" },
    { to: "/exam", label: "考试中心" },
    { to: "/profile", label: "个人中心" },
  ];

  // 横版布局
  if (position === "horizontal") {
    return (
      <header className="fixed top-4 left-4 right-4 z-50 transition-all duration-300">
        <div className="bg-card/70 backdrop-blur-lg rounded-2xl border border-border/20 px-6 py-3 shadow-soft">
          <div className="flex items-center justify-between">
            <Link to="/admin-login" className="flex items-center space-x-3 group">
              <img 
                src={webLogo} 
                alt="Web Logo" 
                className="h-8 w-auto transition-transform group-hover:scale-110 cursor-pointer" 
                title="点击进入管理员登录"
              />
              <img src={oilanText} alt="Oilan" className="h-6 w-auto" />
            </Link>

            <nav className="hidden md:flex items-center space-x-12">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-foreground/70 hover:text-primary transition-smooth"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              {user && user.userType === "user" ? (
                <>
                  <span className="text-sm text-foreground/70">
                    欢迎，{user.realName || "用户"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-sm text-foreground/70 hover:text-primary"
                    onClick={handleLogout}
                  >
                    退出登录
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm text-foreground/70 hover:text-foreground animate-pulse hover:animate-none"
                  asChild
                >
                  <Link to="/student-login">用户登录</Link>
                </Button>
              )}

              {/* 切换手柄 */}
              <div
                onClick={togglePosition}
                className="cursor-pointer ml-2 text-muted-foreground hover:text-foreground transition-colors"
                title="点击切换布局"
              >
                <GripVertical className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // 竖版布局
  return (
    <aside className="fixed top-4 left-4 bottom-4 z-50 w-40 transition-all duration-300">
      <div className="h-full bg-card/70 backdrop-blur-lg rounded-2xl border border-border/20 p-3 shadow-soft flex flex-col">
        {/* 切换手柄 */}
        <div
          onClick={togglePosition}
          className="cursor-pointer mb-4 text-muted-foreground hover:text-foreground transition-colors self-center"
          title="点击切换布局"
        >
          <MoreHorizontal className="h-5 w-5" />
        </div>

        {/* Logo */}
        <Link to="/admin-login" className="flex flex-col items-center space-y-2 mb-6 pb-4 border-b border-border/20 group">
          <img 
            src={webLogo} 
            alt="Web Logo" 
            className="h-10 w-auto transition-transform group-hover:scale-110 cursor-pointer" 
            title="点击进入管理员登录"
          />
          <img src={oilanText} alt="Oilan" className="h-6 w-auto" />
        </Link>

        {/* 导航链接 */}
        <nav className="flex flex-col justify-around flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-xs text-foreground/70 hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-all text-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 用户操作 */}
        <div className="mt-auto pt-4 border-t border-border/20">
          {user && user.userType === "user" ? (
            <div className="space-y-2">
              <p className="text-xs text-foreground/70 text-center truncate">
                {user.realName || "用户"}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs text-foreground/70 hover:text-primary px-2 py-1"
                onClick={handleLogout}
              >
                退出
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-foreground/70 hover:text-foreground animate-pulse hover:animate-none px-2 py-1"
              asChild
            >
              <Link to="/student-login">登录</Link>
            </Button>
          )}
        </div>
      </div>
    </aside>
  );
};

// 导出Header组件为默认导出
export default Header;