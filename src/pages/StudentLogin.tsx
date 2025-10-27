import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";

// 简单的验证函数
const validateUsername = (username: string): string | null => {
  if (!username || username.length < 3) {
    return "用户名至少需要3个字符";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password || password.length < 8) {
    return "密码至少需要8个字符";
  }
  // 检查是否包含大写字母、小写字母和数字
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return "密码必须包含大小写字母和数字";
  }
  return null;
};

const validateFullName = (fullName: string): string | null => {
  if (!fullName || fullName.length < 2) {
    return "姓名至少需要2个字符";
  }
  return null;
};

const StudentLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isSignup) {
        // 注册流程 - 验证输入
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

        if (password !== confirmPassword) {
          toast.error("两次输入的密码不一致");
          return;
        }

        if (!email || !email.includes('@')) {
          toast.error("请输入有效的邮箱地址");
          return;
        }

        const fullNameError = validateFullName(fullName);
        if (fullNameError) {
          toast.error(fullNameError);
          return;
        }

        setIsLoading(true);
        // 调用后端注册接口
        const { error } = await signup(username, password, email, fullName, phone);

        if (error) {
          toast.error(error.message || "注册失败，请重试");
          setIsLoading(false);
          return;
        }

        toast.success("注册成功！", {
          description: `正在为您登录...`,
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // 登录流程 - 验证输入
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
        const { error } = await login(username, password);

        if (error) {
          toast.error(error.message || "登录失败，请重试");
          setIsLoading(false);
          return;
        }

        toast.success("登录成功", {
          description: `欢迎回到智涌·人工智能中心`,
        });

        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (error) {
      console.error('Login/Signup error:', error);
      toast.error("操作失败，请重试");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{isSignup ? "用户注册" : "用户登录"}</h1>
              <p className="text-muted-foreground">欢迎{isSignup ? "加入" : "回到"}智涌·人工智能中心</p>
            </div>


            {/* Login/Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignup && (
                <>
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      姓名
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="请输入您的姓名"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="h-12 bg-background/50 border-input/50 focus:border-primary focus:bg-background/80 transition-smooth"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      邮箱
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入您的邮箱"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 bg-background/50 border-input/50 focus:border-primary focus:bg-background/80 transition-smooth"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-foreground">
                      手机号（可选）
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="请输入您的手机号"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12 bg-background/50 border-input/50 focus:border-primary focus:bg-background/80 transition-smooth"
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-foreground">
                  用户名
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
                  {!isSignup && (
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary-dark transition-smooth"
                    >
                      忘记密码？
                    </button>
                  )}
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
                {isSignup && (
                  <p className="text-xs text-muted-foreground">
                    密码至少8位，必须包含大小写字母和数字
                  </p>
                )}
              </div>

              {isSignup && (
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    确认密码
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-background/50 border-input/50 focus:border-primary focus:bg-background/80 transition-smooth"
                    disabled={isLoading}
                  />
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-semibold text-lg transition-smooth disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2"></div>
                    {isSignup ? "注册中..." : "登录中..."}
                  </div>
                ) : (
                  isSignup ? "注册" : "登录"
                )}
              </Button>
            </form>

            {/* Toggle between login/signup */}
            <div className="text-center mt-6">
              <span className="text-muted-foreground text-sm">
                {isSignup ? "已有账户？" : "还没有账户？"}{" "}
                <button 
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-primary hover:text-primary-dark font-medium transition-smooth"
                >
                  {isSignup ? "立即登录" : "立即注册"}
                </button>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLogin;