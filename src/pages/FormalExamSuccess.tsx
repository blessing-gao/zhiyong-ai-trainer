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
    <div className="min-h-screen bg-gradient-hero">
      <div className="p-6">
        <div className="max-w-[600px] mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 成功动画和信息 */}
            <div className="space-y-8 text-center">
              {/* 成功图标 */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse"></div>
                  <CheckCircle className="h-24 w-24 text-green-500 relative z-10 animate-bounce" />
                </div>
              </div>

              {/* 成功标题 */}
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-foreground">交卷成功！</h1>
                <p className="text-lg text-muted-foreground">
                  您的答卷已成功提交，系统正在进行判卷
                </p>
              </div>

              {/* 考试信息 */}
              <Card className="bg-white/5 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-muted-foreground">考试名称</span>
                    <span className="font-semibold text-foreground">
                      {examInfo.examName || "AI训练师AI证照职考试"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-4 border-b border-white/10">
                    <span className="text-muted-foreground">试卷ID</span>
                    <span className="font-semibold text-foreground">
                      {examInfo.paperId || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">提交时间</span>
                    <span className="font-semibold text-foreground">
                      {new Date().toLocaleString('zh-CN')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* 提示信息 */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-600">
                  💡 系统将在判卷完成后发送成绩通知，请耐心等待
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
                
                <Button
                  onClick={() => navigate('/exams')}
                  variant="outline"
                  className="w-full border-border text-foreground hover:bg-muted/50 py-6 text-lg rounded-lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  查看我的考试
                </Button>
              </div>

              {/* 底部提示 */}
              <div className="text-xs text-muted-foreground pt-4 border-t border-white/10">
                <p>如有任何问题，请联系客服支持</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormalExamSuccess;

