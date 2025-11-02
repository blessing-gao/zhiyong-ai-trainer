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
  const [isGenerating, setIsGenerating] = useState(false);

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

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


      <div className="px-[5%] py-[3%] pt-24 transition-all duration-300 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* 页面标题 */}
          <div className="text-left mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-3">训练中心</h1>
            <p className="text-xl text-muted-foreground">
              选择学习模式，提升您的AI技能水平
            </p>
          </div>

          {/* 左右布局 - 两个功能模块 */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* 左侧：知识探索 */}
            <div 
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
              onClick={handleKnowledgeExplore}
            >
              {/* 内容区域 */}
              <div className="px-[5%] py-[3%] flex flex-col min-h-[340px] relative">
                {/* 默认状态：标题和功能介绍 */}
                <div className="opacity-100 group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 px-[5%] py-[3%] flex flex-col">
                  {/* 顶部标题区域 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#67B3FF] to-[#97CAFF] rounded-xl flex items-center justify-center shadow-sm">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800 mb-1">知识探索</h3>
                      <p className="text-lg text-gray-600">系统化学习</p>
                    </div>
                  </div>

                  {/* 功能介绍 */}
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#67B3FF]/20 bg-[#67B3FF]/5 hover:bg-[#67B3FF]/10 hover:border-[#67B3FF]/40 transition-all">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#67B3FF]/30">
                        <BookOpen className="w-4 h-4 text-[#67B3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-semibold text-sm">知识点导航</div>
                        <div className="text-xs text-gray-500">清晰的知识体系结构</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#67B3FF]/20 bg-[#67B3FF]/5 hover:bg-[#67B3FF]/10 hover:border-[#67B3FF]/40 transition-all">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#67B3FF]/30">
                        <ClipboardList className="w-4 h-4 text-[#67B3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-semibold text-sm">题目练习</div>
                        <div className="text-xs text-gray-500">针对性的知识点练习</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#67B3FF]/20 bg-[#67B3FF]/5 hover:bg-[#67B3FF]/10 hover:border-[#67B3FF]/40 transition-all">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#67B3FF]/30">
                        <Lightbulb className="w-4 h-4 text-[#67B3FF]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-semibold text-sm">详细解析</div>
                        <div className="text-xs text-gray-500">深入理解每道题目</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 悬停状态：标题、统计数据和箭头 */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 px-[5%] py-[3%] flex flex-col">
                  {/* 顶部标题区域 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#67B3FF] to-[#97CAFF] rounded-xl flex items-center justify-center shadow-sm">
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800 mb-1">知识探索</h3>
                      <p className="text-lg text-gray-600">系统化学习</p>
                    </div>
                  </div>

                  {/* 统计数据 */}
                  <div className="flex gap-4 mt-auto mb-4">
                    <div className="flex-1 py-6 bg-gradient-to-br from-[#67B3FF]/10 to-[#97CAFF]/10 rounded-xl border border-[#67B3FF]/20 text-center">
                      <div className="text-4xl font-bold text-[#67B3FF]">68</div>
                      <div className="text-sm text-gray-600 mt-1">知识点</div>
                    </div>
                    <div className="flex-1 py-6 bg-gradient-to-br from-[#97CAFF]/10 to-[#A2EBFF]/10 rounded-xl border border-[#97CAFF]/20 text-center">
                      <div className="text-4xl font-bold text-[#67B3FF]">450</div>
                      <div className="text-sm text-gray-600 mt-1">练习题</div>
                    </div>
                  </div>

                  {/* 箭头按钮 */}
                  <div className="py-4 bg-gradient-to-br from-[#67B3FF] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all cursor-pointer">
                    <ArrowRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：试题训练 */}
            <div 
              className="relative group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200"
              onClick={handleQuestionTraining}
            >
              {/* 内容区域 */}
              <div className="px-[5%] py-[3%] flex flex-col min-h-[340px] relative">
                {/* 默认状态：标题和功能介绍 */}
                <div className="opacity-100 group-hover:opacity-0 transition-opacity duration-300 absolute inset-0 px-[5%] py-[3%] flex flex-col">
                  {/* 顶部标题区域 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#79E3DA] to-[#5BC9C0] rounded-xl flex items-center justify-center shadow-sm">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800 mb-1">试题训练</h3>
                      <p className="text-lg text-gray-600">自动组卷练习</p>
                    </div>
                  </div>

                  {/* 功能介绍 */}
                  <div className="space-y-2 flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#79E3DA]/20 bg-[#79E3DA]/5 hover:bg-[#79E3DA]/10 hover:border-[#79E3DA]/40 transition-all">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#79E3DA]/30">
                        <Brain className="w-4 h-4 text-[#79E3DA]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-semibold text-sm">智能组卷</div>
                        <div className="text-xs text-gray-500">根据难度自动生成试卷</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#79E3DA]/20 bg-[#79E3DA]/5 hover:bg-[#79E3DA]/10 hover:border-[#79E3DA]/40 transition-all">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#79E3DA]/30">
                        <ClipboardList className="w-4 h-4 text-[#79E3DA]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-semibold text-sm">答题卡模式</div>
                        <div className="text-xs text-gray-500">真实考试体验</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 p-3 rounded-lg border border-[#79E3DA]/20 bg-[#79E3DA]/5 hover:bg-[#79E3DA]/10 hover:border-[#79E3DA]/40 transition-all">
                      <div className="flex-shrink-0 w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-[#79E3DA]/30">
                        <Lightbulb className="w-4 h-4 text-[#79E3DA]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-800 font-semibold text-sm">实时反馈</div>
                        <div className="text-xs text-gray-500">即时查看答题结果</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 悬停状态：标题、统计数据和箭头 */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-0 px-[5%] py-[3%] flex flex-col">
                  {/* 顶部标题区域 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#79E3DA] to-[#5BC9C0] rounded-xl flex items-center justify-center shadow-sm">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800 mb-1">试题训练</h3>
                      <p className="text-lg text-gray-600">自动组卷练习</p>
                    </div>
                  </div>

                  {/* 统计数据 */}
                  <div className="flex gap-4 mt-auto mb-4">
                    <div className="flex-1 py-6 bg-gradient-to-br from-[#79E3DA]/10 to-[#5BC9C0]/10 rounded-xl border border-[#79E3DA]/20 text-center">
                      <div className="text-4xl font-bold text-[#79E3DA]">100</div>
                      <div className="text-sm text-gray-600 mt-1">题目/卷</div>
                    </div>
                    <div className="flex-1 py-6 bg-gradient-to-br from-[#97CAFF]/10 to-[#79E3DA]/10 rounded-xl border border-[#79E3DA]/20 text-center">
                      <div className="text-4xl font-bold text-[#79E3DA]">120</div>
                      <div className="text-sm text-gray-600 mt-1">分钟</div>
                    </div>
                  </div>

                  {/* 箭头按钮 */}
                  <div className="py-4 bg-gradient-to-br from-[#79E3DA] to-[#5BC9C0] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all cursor-pointer">
                    <ArrowRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              {/* Loading 状态覆盖层 */}
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center z-20">
                  <div className="text-center text-white">
                    <div className="flex justify-center mb-4">
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                    <p className="text-base font-medium">系统正在智能组卷，生成最适合您的试卷...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 底部提示 */}
          <div className="mt-12 py-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-6 w-6 text-[#79E3DA] mt-0.5 flex-shrink-0" />
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