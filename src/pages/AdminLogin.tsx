import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// 简单的验证函数
const validateUsername = (username: string): string | null => {
  if (!username || username.length < 3) {
    return "用户名至少需要3个字符";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password || password.length < 6) {
    return "密码至少需要6个字符";
  }
  return null;
};

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证输入
    const usernameError = validateUsername(username);
    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await adminLogin(username, password);

      if (error) {
        toast.error(error.message || "登录失败，请检查用户名和密码");
        setIsLoading(false);
        return;
      }

      toast.success("登录成功", {
        description: "欢迎回到管理后台",
      });

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      toast.error("登录失败，请重试");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Back to home button */}
      <div className="fixed top-8 left-8 z-50">
        <Link to="/">
          <Button 
            variant="outline" 
            className="bg-card/80 backdrop-blur-sm border-border/20 hover:bg-card/90 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回首页
          </Button>
        </Link>
      </div>
      
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-primary/30 rounded-full blur-lg animate-float-slow"></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-secondary/40 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-28 h-28 bg-accent/25 rounded-full blur-xl animate-float-slow"></div>
      </div>

      <main className="relative pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-md">
          {/* Login Card */}
          <div className="bg-card/95 backdrop-blur-lg rounded-3xl border border-border/20 p-8 shadow-float animate-fade-in-up">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4 shadow-glow">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">管理员登录</h1>
              <p className="text-muted-foreground">欢迎回到智涌·人工智能中心管理后台</p>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-4 text-muted-foreground">管理员专用</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  管理员用户名
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder="请输入用户名（至少3个字符）"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 bg-background/50 border-input/50 focus:border-primary focus:bg-background/80 transition-smooth"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-foreground">
                    密码
                  </label>
                  <button 
                    type="button"
                    className="text-sm text-primary hover:text-primary-dark transition-smooth"
                  >
                    忘记密码？
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-background/50 border-input/50 focus:border-primary focus:bg-background/80 transition-smooth"
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-semibold text-lg transition-smooth disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2"></div>
                    登录中...
                  </div>
                ) : (
                  "登录"
                )}
              </Button>
            </form>

            {/* Footer note */}
            <div className="text-center mt-6">
              <span className="text-muted-foreground text-sm">
                没有管理员账号？{" "}
                <span className="text-primary font-medium">
                  请联系系统管理员
                </span>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLogin;