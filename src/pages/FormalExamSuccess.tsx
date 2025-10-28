import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, RotateCcw } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

const FormalExamSuccess = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  const examInfo = location.state?.examInfo || {};

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="p-6">
        <div className="max-w-[600px] mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">

            {/* 成功动画和信息 */}
            <div className="space-y-6 text-center">
              {/* 成功图标 */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <CheckCircle className="h-24 w-24 text-green-500 relative z-10 animate-bounce" />
                </div>
              </div>

              {/* 成功标题 */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">恭喜提交成功！</h1>
                <p className="text-lg text-muted-foreground">
                  您的答卷已成功提交，系统正在进行判卷
                </p>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3 pt-4">
                <Button
                  onClick={() => navigate('/exam')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 text-lg rounded-lg transition-all"
                >
                  <Home className="h-5 w-5 mr-2" />
                  返回考试中心
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalExamSuccess;

