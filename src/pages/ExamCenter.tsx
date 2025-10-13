import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink, FileText, FlaskConical, Clock, User, Calendar, Shield, CircleAlert as AlertCircle, Award, BookOpen, Trophy, Target } from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";

const ExamCenter = () => {
  const { applyRoleTheme } = useTheme();
  const { toast } = useToast();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  useEffect(() => {
    const handleNavChange = (e: CustomEvent) => {
      setIsVertical(e.detail === "vertical");
    };

    window.addEventListener("navPositionChange", handleNavChange as EventListener);
    return () => {
      window.removeEventListener("navPositionChange", handleNavChange as EventListener);
    };
  }, []);

  // 跳转到独立考试系统
  const handleExamSystem = () => {
    toast({
      title: "正在跳转考试系统",
      description: "请在新窗口中完成考试，考试期间请勿关闭窗口"
    });
    // 在实际项目中，这里应该是独立的考试系统域名
    window.open('https://exam.example.com', '_blank');
  };

  // 考试信息数据
  const examInfo = {
    title: "AI训练师认证考试",
    description: "通过权威认证，证明您的AI技能水平",
    examTypes: [
      {
        id: "theory",
        name: "理论考试",
        description: "AI基础理论知识测试",
        duration: "120分钟",
        questions: "100题",
        icon: FileText,
        color: "blue"
      },
      {
        id: "practical", 
        name: "实践考试",
        description: "AI实际操作技能测试",
        duration: "90分钟",
        questions: "5个项目",
        icon: FlaskConical,
        color: "green"
      }
    ],
    requirements: [
      "完成所有课程学习",
      "通过模拟考试练习",
      "具备基础编程能力",
      "了解AI基本概念"
    ],
    benefits: [
      "获得权威认证证书",
      "提升职业竞争力",
      "证明专业技能水平",
      "拓展职业发展机会"
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Header />
      
      {/* 蓝色渐变圆形背景元素 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-20 -right-50 w-[640px] h-[640px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-60 -right-40 w-[500px] h-[500px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
          animationDelay: '1s'
        }}></div>
      </div>
      
      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 页面标题 */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">
                  {examInfo.title}
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {examInfo.description}
              </p>
            </div>

            <div className="max-w-6xl mx-auto space-y-8">
              {/* 考试类型介绍 */}
              <div className="grid md:grid-cols-2 gap-6">
                {examInfo.examTypes.map((examType) => {
                  const IconComponent = examType.icon;
                  return (
                    <Card key={examType.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 shadow-soft">
                      <CardHeader className="text-center">
                        <div className={`mx-auto mb-4 p-4 bg-${examType.color}-100 rounded-full w-20 h-20 flex items-center justify-center`}>
                          <IconComponent className={`h-10 w-10 text-${examType.color}-600`} />
                        </div>
                        <CardTitle className="text-2xl text-foreground">{examType.name}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">
                          {examType.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="p-3 bg-white/5 rounded-lg">
                            <Clock className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                            <div className="text-sm font-medium text-foreground">{examType.duration}</div>
                            <div className="text-xs text-muted-foreground">考试时长</div>
                          </div>
                          <div className="p-3 bg-white/5 rounded-lg">
                            <Target className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                            <div className="text-sm font-medium text-foreground">{examType.questions}</div>
                            <div className="text-xs text-muted-foreground">题目数量</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* 考试要求和收益 */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* 考试要求 */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <BookOpen className="h-5 w-5 text-primary" />
                      考试要求
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {examInfo.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* 认证收益 */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Trophy className="h-5 w-5 text-secondary" />
                      认证收益
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {examInfo.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* 安全提示 */}
              <Card className="border-orange-200 bg-orange-50/50 bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-orange-700 flex items-center gap-2 text-foreground">
                    <Shield className="h-5 w-5" />
                    考试安全说明
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-orange-800 text-foreground">为什么使用独立考试系统？</h4>
                      <ul className="space-y-2 text-sm text-orange-700 text-muted-foreground">
                        <li>• 防止考试期间查看课程资料</li>
                        <li>• 避免访问训练记录作弊</li>
                        <li>• 确保考试环境纯净安全</li>
                        <li>• 保障考试结果公平公正</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 text-orange-800 text-foreground">考试注意事项</h4>
                      <ul className="space-y-2 text-sm text-orange-700 text-muted-foreground">
                        <li>• 考试将在新窗口中进行</li>
                        <li>• 考试期间请勿关闭窗口</li>
                        <li>• 确保网络连接稳定</li>
                        <li>• 严格遵守考试纪律</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator className="my-8 bg-white/20" />

              {/* 考试系统入口 */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-elegant border-2 border-primary/20">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-primary mb-2 text-foreground">
                    准备开始考试？
                  </CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    点击下方按钮进入独立的考试系统
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <Button 
                    onClick={handleExamSystem}
                    size="lg"
                    className="text-lg px-8 py-6 bg-primary hover:bg-primary-dark text-white"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    进入考试系统
                  </Button>
                  <p className="text-sm text-muted-foreground mt-4">
                    系统将在新窗口中打开，请确保浏览器允许弹出窗口
                  </p>
                </CardContent>
              </Card>

              {/* 联系信息 */}
              <div className="text-center text-sm text-muted-foreground bg-white/5 p-6 rounded-lg">
                <p className="font-medium mb-2 text-foreground">技术支持</p>
                <p>如遇技术问题，请联系：support@example.com 或拨打 400-123-4567</p>
                <p className="mt-2">考试时间：周一至周五 9:00-17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCenter;