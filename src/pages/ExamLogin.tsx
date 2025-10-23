import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Lock, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { examApi } from "@/services/api";

const ExamLogin = () => {
  const navigate = useNavigate();
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 验证输入
    if (!admissionNumber.trim()) {
      setError("请输入准考证号");
      return;
    }

    if (!password.trim()) {
      setError("请输入密码");
      return;
    }

    setIsLoading(true);

    try {
      // 调用后端API验证准考证号和密码
      const response: any = await examApi.examLogin({
        admissionNumber: admissionNumber.trim(),
        password: password.trim(),
      });

      if (response.code === 0 && response.data) {
        console.log("登录成功，考生信息:", response.data);

        // 保存登录信息到 sessionStorage（仅在当前窗口有效）
        sessionStorage.setItem("examLoginInfo", JSON.stringify(response.data));
        sessionStorage.setItem("examLoginTime", new Date().toISOString());

        // 跳转到考试系统（试卷列表）
        navigate("/exam/system");
      } else {
        setError(response.msg || "登录失败，请检查准考证号和密码");
      }
    } catch (err: any) {
      setError(err.message || "登录失败，请检查准考证号和密码");
      console.error("登录错误:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* 登录卡片 */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              考试登录
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              请输入您的准考证号和密码进入考试系统
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* 错误提示 */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* 准考证号输入 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  准考证号
                </label>
                <Input
                  type="text"
                  placeholder="请输入准考证号"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  disabled={isLoading}
                  className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500">
                  准考证号由考试管理员分配
                </p>
              </div>

              {/* 密码输入 */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  密码
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="请输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="h-12 text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? "隐藏" : "显示"}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  密码由考试管理员分配
                </p>
              </div>

              {/* 登录按钮 */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    登录中...
                  </>
                ) : (
                  "进入考试"
                )}
              </Button>

              {/* 提示信息 */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-700 leading-relaxed">
                  <span className="font-semibold">💡 提示：</span>
                  <br />
                  • 请确保您已收到准考证号和密码
                  <br />
                  • 登录后请勿关闭此窗口
                  <br />
                  • 考试期间请保持网络连接稳定
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* 底部信息 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>如遇问题，请联系考试管理员</p>
          <p className="mt-1">技术支持：support@example.com</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ExamLogin;

