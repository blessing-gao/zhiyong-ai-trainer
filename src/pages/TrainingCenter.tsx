import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  ArrowRight,
  Lightbulb,
  ClipboardList
} from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const TrainingCenter = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [isGenerating, setIsGenerating] = useState(false);

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

  // 知识探索模式
  const handleKnowledgeExplore = () => {
    navigate('/training/knowledge-explore');
  };

  // 试题训练模式 - 直接进入答题卡
  const handleQuestionTraining = async () => {
    setIsGenerating(true);
    // 模拟组卷过程（2-3秒）
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsGenerating(false);
    // 直接进入答题卡
    navigate('/exam/start');
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
      </div>

      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">训练中心</h1>
            <p className="text-xl text-muted-foreground">
              选择学习模式，提升您的AI技能水平
            </p>
          </div>

          {/* 左右布局 - 两个功能模块 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左侧：知识探索 */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">知识探索</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      系统化学习
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                {/* 功能介绍 */}
                <div className="space-y-3">
                  <p className="text-foreground leading-relaxed">
                    按照知识点系统学习，左侧展示知识体系，右侧进行题目练习和查看解析。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        知识点导航 - 清晰的知识体系结构
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ClipboardList className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        题目练习 - 针对性的知识点练习
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        详细解析 - 深入理解每道题目
                      </span>
                    </div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">68</div>
                    <div className="text-xs text-muted-foreground">知识点</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-500">450</div>
                    <div className="text-xs text-muted-foreground">练习题</div>
                  </div>
                </div>

                {/* 按钮 */}
                <Button
                  onClick={handleKnowledgeExplore}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-base py-6 group/btn"
                >
                  开始探索
                  <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            {/* 右侧：试题训练 */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-foreground">试题训练</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      自动组卷练习
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 space-y-6">
                {/* 功能介绍 */}
                <div className="space-y-3">
                  <p className="text-foreground leading-relaxed">
                    系统自动组卷，进入答题卡做题模式。支持多种题型，实时反馈答题情况。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <Brain className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        智能组卷 - 根据难度自动生成试卷
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ClipboardList className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        答题卡模式 - 真实考试体验
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">
                        实时反馈 - 即时查看答题结果
                      </span>
                    </div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-2 gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">100</div>
                    <div className="text-xs text-muted-foreground">题目/卷</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-500">120</div>
                    <div className="text-xs text-muted-foreground">分钟</div>
                  </div>
                </div>

                {/* 按钮 */}
                {!isGenerating && (
                  <Button
                    onClick={handleQuestionTraining}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-base py-6 group/btn"
                  >
                    开始训练
                    <ArrowRight className="h-5 w-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                )}

                {/* Loading 提示 */}
                {isGenerating && (
                  <div className="p-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-center">
                    <div className="flex justify-center mb-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                    <p className="text-base font-medium">系统正在智能组卷，生成最适合您的试卷...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* 底部提示 */}
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">学习建议</h3>
                <p className="text-sm text-muted-foreground">
                  建议先通过"知识探索"系统学习知识点，再通过"试题训练"进行综合练习，这样能更有效地提升学习效果。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCenter;