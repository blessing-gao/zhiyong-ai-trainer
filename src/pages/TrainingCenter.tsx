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
import trainingCenterBg from "@/assets/training-center-bg.png";
import { questionApi, tagApi, paperApi, examAnswerApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

const TrainingCenter = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [knowledgePointsCount, setKnowledgePointsCount] = useState<number>(0);
  const [questionsCount, setQuestionsCount] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [inProgressAnswer, setInProgressAnswer] = useState<any>(null);

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

  // 加载训练中心统计数据
  useEffect(() => {
    const loadTrainingCenterStats = async () => {
      try {
        setStatsLoading(true);
        const response: any = await questionApi.getTrainingCenterStats();
        if (response.code === 0 && response.data) {
          setKnowledgePointsCount(parseInt(response.data.knowledge_points_count));
          setQuestionsCount(parseInt(response.data.questions_count));
        }
      } catch (error) {
        console.error("Failed to load training center stats:", error);
        // 如果加载失败，使用默认值
        setKnowledgePointsCount(0);
        setQuestionsCount(0);
      } finally {
        setStatsLoading(false);
      }
    };

    loadTrainingCenterStats();
  }, []);

  // 知识探索模式
  const handleKnowledgeExplore = () => {
    navigate('/training/knowledge-explore');
  };

  // 恢复答题进度
  const handleResumeAnswering = async () => {
    if (!inProgressAnswer || !user) return;

    try {
      console.log("🔄 恢复答题进度...");
      setShowResumeDialog(false);

      // 获取答题记录
      const answerRecord: any = await examAnswerApi.getAnswerRecord(user.id, inProgressAnswer.paperId);
      console.log("📦 答题记录:", answerRecord);

      if (answerRecord.code === 0 && answerRecord.data) {
        const examAnswer = answerRecord.data;

        // 解析答题内容
        let answers = {};
        if (examAnswer.answer) {
          try {
            answers = JSON.parse(examAnswer.answer);
          } catch (e) {
            console.warn("解析答题内容失败，使用空对象");
          }
        }

        // 直接从数据库获取试卷的题目列表（不需要重新组卷）
        console.log("🔄 从数据库获取试卷题目...");
        const paperResponse: any = await paperApi.getPaper(inProgressAnswer.paperId);

        if (paperResponse.code === 0 && paperResponse.data) {
          const paper = paperResponse.data;

          // 获取试卷的题目列表
          const questionsResponse: any = await paperApi.getPaperQuestions(inProgressAnswer.paperId);

          if (questionsResponse.code === 0 && questionsResponse.data && questionsResponse.data.questions) {
            console.log("✅ 成功获取题目，恢复答题进度");

            // 存储到 localStorage
            localStorage.setItem('exam_questions', JSON.stringify(questionsResponse.data.questions));
            localStorage.setItem('exam_info', JSON.stringify({
              paperId: inProgressAnswer.paperId,
              name: questionsResponse.data.paperName,
              duration: questionsResponse.data.duration,
              totalScore: questionsResponse.data.totalScore,
              passScore: questionsResponse.data.passScore,
              questionCount: questionsResponse.data.questionCount
            }));
            localStorage.setItem('exam_answers', JSON.stringify(answers));
            localStorage.setItem('exam_start_time', inProgressAnswer.startTime);

            console.log("💾 答题进度已恢复到localStorage");

            // 导航到答题卡页面
            navigate('/exam/start', {
              state: {
                paperId: inProgressAnswer.paperId,
                questions: questionsResponse.data.questions,
                examInfo: {
                  paperId: inProgressAnswer.paperId,
                  name: questionsResponse.data.paperName,
                  duration: questionsResponse.data.duration,
                  totalScore: questionsResponse.data.totalScore,
                  passScore: questionsResponse.data.passScore,
                  questionCount: questionsResponse.data.questionCount
                },
                resumeAnswers: answers,
                resumeStartTime: inProgressAnswer.startTime
              }
            });
          } else {
            alert("获取题目详情失败，请稍后重试");
          }
        } else {
          alert("获取试卷信息失败，请稍后重试");
        }
      } else {
        alert("获取答题记录失败，请稍后重试");
      }
    } catch (error) {
      console.error("❌ 恢复答题进度出错:", error);
      alert("恢复答题进度出错，请稍后重试");
    }
  };

  // 放弃恢复，开始新答题
  const handleStartNewAnswering = async () => {
    if (!user) return;

    try {
      console.log("🚀 放弃恢复，开始新答题...");
      setShowResumeDialog(false);
      setInProgressAnswer(null);
      setIsGenerating(true);

      // 第一步：放弃当前的答题记录（如果有的话）
      console.log("🔄 放弃当前的答题记录...");
      const abandonResponse: any = await examAnswerApi.abandonAnswering(user.id);
      if (abandonResponse.code === 0) {
        console.log("✅ 已放弃当前答题记录");
      } else {
        console.warn("⚠️ 放弃答题记录失败或没有进行中的记录");
      }

      // 第二步：获取所有一级标签
      console.log("📚 获取一级标签...");
      const tagsResponse: any = await tagApi.getFirstLevelTags();

      if (!tagsResponse.data || tagsResponse.data.length === 0) {
        console.error("❌ 未找到一级标签");
        alert("获取知识点失败，请稍后重试");
        setIsGenerating(false);
        return;
      }

      // 构建知识点比例（均匀分配）
      const knowledgeRatio: { [key: string]: number } = {};
      const ratio = Math.floor(100 / tagsResponse.data.length);
      let totalRatio = 0;

      tagsResponse.data.forEach((tag: any, index: number) => {
        if (index === tagsResponse.data.length - 1) {
          knowledgeRatio[tag.id.toString()] = 100 - totalRatio;
        } else {
          knowledgeRatio[tag.id.toString()] = ratio;
          totalRatio += ratio;
        }
      });

      // 构建组卷请求
      const paperRequest = {
        name: "AI训练师认证考试",
        description: "自动组卷试题训练",
        type: "practice",
        totalScore: 100,
        passScore: 60,
        duration: 120,
        questionCount: 100,
        typeRatio: {
          judge: 20,
          single: 70,
          multiple: 10
        },
        knowledgeRatio: knowledgeRatio
      };

      // 第三步：生成新试卷
      console.log("🔄 生成新试卷...");
      const paperResponse: any = await paperApi.generateTrainingPaper(paperRequest);

      if (paperResponse.code === 0 && paperResponse.data) {
        const paperId = paperResponse.data.id;
        console.log("✅ 新试卷已生成，试卷ID:", paperId);

        // 第四步：为新试卷创建答题记录
        console.log("🔄 为新试卷创建答题记录...");
        const newAnswerResponse: any = await examAnswerApi.startAnswering(user.id, paperId);

        if (newAnswerResponse.code === 0 && newAnswerResponse.data) {
          console.log("✅ 新建答题记录，开始答题");
          await proceedToAnswering(paperId, paperRequest);
        } else {
          console.error("❌ 创建答题记录失败:", newAnswerResponse);
          alert("创建答题记录失败，请稍后重试");
        }
      } else {
        console.error("❌ 生成试卷失败:", paperResponse);
        alert("生成试卷失败，请稍后重试");
      }
    } catch (error) {
      console.error("❌ 开始新答题出错:", error);
      alert("开始新答题出错，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  // 试题训练模式 - 先检查是否有进行中的答题记录
  const handleQuestionTraining = async () => {
    try {
      setIsGenerating(true);
      console.log("🚀 开始试题训练...");

      if (!user) {
        alert("请先登录");
        setIsGenerating(false);
        return;
      }

      // 第一步：先调用开始答题接口检查是否有进行中的答题记录
      console.log("🔄 检查是否有进行中的答题记录...");
      const startAnswerResponse: any = await examAnswerApi.startAnswering(user.id, 0);
      console.log("📦 开始答题响应:", startAnswerResponse);

      if (startAnswerResponse.code === 0 && startAnswerResponse.data) {
        const examAnswer = startAnswerResponse.data;

        // 检查是否有进行中的答题记录（status=1表示进行中）
        // 注意：只要status=1，就应该询问用户是否恢复，不需要检查answer字段是否有内容
        // 因为即使answer为空，用户也消耗了时间，应该恢复该试卷
        if (examAnswer.status === 1) {
          // 有进行中的答题记录，询问用户是否恢复
          console.log("⚠️ 发现进行中的答题记录，询问用户是否恢复");
          console.log("📋 答题记录详情:", {
            id: examAnswer.id,
            paperId: examAnswer.paperId,
            status: examAnswer.status,
            answer: examAnswer.answer,
            startTime: examAnswer.startTime
          });
          setInProgressAnswer(examAnswer);
          setShowResumeDialog(true);
          setIsGenerating(false);
          return;
        }
      }

      // 第二步：没有进行中的答题记录，生成新试卷
      console.log("📚 获取一级标签...");
      const tagsResponse: any = await tagApi.getFirstLevelTags();
      console.log("📚 标签响应:", tagsResponse);

      if (!tagsResponse.data || tagsResponse.data.length === 0) {
        console.error("❌ 未找到一级标签");
        alert("获取知识点失败，请稍后重试");
        setIsGenerating(false);
        return;
      }

      console.log("✅ 找到", tagsResponse.data.length, "个一级标签");

      // 构建知识点比例（均匀分配）
      const knowledgeRatio: { [key: string]: number } = {};
      const ratio = Math.floor(100 / tagsResponse.data.length);
      let totalRatio = 0;

      tagsResponse.data.forEach((tag: any, index: number) => {
        if (index === tagsResponse.data.length - 1) {
          // 最后一个标签补齐剩余比例
          knowledgeRatio[tag.id.toString()] = 100 - totalRatio;
        } else {
          knowledgeRatio[tag.id.toString()] = ratio;
          totalRatio += ratio;
        }
      });

      console.log("📊 知识点比例:", knowledgeRatio);

      // 构建组卷请求
      const paperRequest = {
        name: "AI训练师认证考试",
        description: "自动组卷试题训练",
        type: "practice",
        totalScore: 100,
        passScore: 60,
        duration: 120,
        questionCount: 100,
        typeRatio: {
          judge: 20,
          single: 70,
          multiple: 10
        },
        knowledgeRatio: knowledgeRatio
      };

      console.log("📝 组卷请求:", paperRequest);

      // 调用后端API生成试卷并保存到数据库
      console.log("🔄 调用后端API生成试卷并保存到数据库...");
      const paperResponse: any = await paperApi.generateTrainingPaper(paperRequest);

      console.log("📦 后端响应:", paperResponse);

      if (paperResponse.code === 0 && paperResponse.data) {
        const paperId = paperResponse.data.id;
        console.log("✅ 试卷已保存到数据库，试卷ID:", paperId);

        // 第三步：生成新试卷后，创建新的答题记录
        console.log("🔄 为新试卷创建答题记录...");
        const newAnswerResponse: any = await examAnswerApi.startAnswering(user.id, paperId);
        console.log("📦 新答题记录响应:", newAnswerResponse);

        if (newAnswerResponse.code === 0 && newAnswerResponse.data) {
          console.log("✅ 新建答题记录，开始答题");
          await proceedToAnswering(paperId, paperRequest);
        } else {
          console.error("❌ 创建答题记录失败:", newAnswerResponse);
          alert("创建答题记录失败，请稍后重试");
        }
      } else {
        console.error("❌ 生成试卷失败:", paperResponse);
        alert("生成试卷失败，请稍后重试");
      }
    } catch (error) {
      console.error("❌ 试题训练出错:", error);
      alert("试题训练出错，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  // 继续答题的辅助函数
  const proceedToAnswering = async (paperId: number, paperRequest: any) => {
    try {
      // 再次调用API获取题目详情
      console.log("🔄 获取试卷题目详情...");
      const questionsResponse: any = await paperApi.generatePaperForTraining(paperRequest);

      if (questionsResponse.code === 0 && questionsResponse.data && questionsResponse.data.questions) {
        console.log("✅ 成功获取", questionsResponse.data.questions.length, "道题目");

        // 存储到 localStorage
        localStorage.setItem('exam_questions', JSON.stringify(questionsResponse.data.questions));
        localStorage.setItem('exam_info', JSON.stringify({
          paperId: paperId,
          name: questionsResponse.data.paperName,
          duration: questionsResponse.data.duration,
          totalScore: questionsResponse.data.totalScore,
          passScore: questionsResponse.data.passScore,
          questionCount: questionsResponse.data.questionCount
        }));

        console.log("💾 题目已保存到localStorage");

        // 导航到答题卡页面
        console.log("🚀 导航到答题卡页面...");
        navigate('/exam/start', {
          state: {
            paperId: paperId,
            questions: questionsResponse.data.questions,
            examInfo: {
              paperId: paperId,
              name: questionsResponse.data.paperName,
              duration: questionsResponse.data.duration,
              totalScore: questionsResponse.data.totalScore,
              passScore: questionsResponse.data.passScore,
              questionCount: questionsResponse.data.questionCount
            }
          }
        });
      } else {
        console.error("❌ 获取题目详情失败:", questionsResponse);
        alert("获取题目详情失败，请稍后重试");
      }
    } catch (error) {
      console.error("❌ 获取题目详情出错:", error);
      alert("获取题目详情出错，请稍后重试");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Header />

      {/* 恢复答题进度对话框 */}
      {showResumeDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">恢复答题进度</h2>
            <p className="text-gray-600 mb-6">
              检测到您有一份进行中的答题记录。是否恢复上一次的答题进度？
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowResumeDialog(false);
                  setInProgressAnswer(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                取消
              </button>
              <button
                onClick={handleStartNewAnswering}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                开始新答题
              </button>
              <button
                onClick={handleResumeAnswering}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                恢复答题
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 蓝色渐变圆形背景元素 - 模仿首页设计 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[1536px] h-[1536px] rounded-full animate-float -z-10" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-20 -right-50 w-[1280px] h-[1280px] rounded-full animate-float-slow -z-10" style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-60 -right-40 w-[1000px] h-[1000px] rounded-full animate-float -z-10" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
          animationDelay: '1s'
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
            <div className="relative group cursor-pointer" onClick={handleKnowledgeExplore}>
              {/* 使用图片作为容器 */}
              <div 
                className="relative w-full aspect-square rounded-3xl overflow-visible shadow-2xl hover:scale-105 transition-all duration-500"
                style={{
                  backgroundImage: `url(${trainingCenterBg})`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* 内容区域 - 使用相对单位确保文字随图片缩放 */}
                <div className="absolute inset-0 flex flex-col" style={{ padding: '8%' }}>
                  {/* 顶部标题区域 */}
                  <div className="flex flex-col" style={{ gap: '7%', paddingTop: '2%' }}>
                    <div>
                      <h3 className="font-bold text-gray-800" style={{ fontSize: '2.496vw' }}>知识探索</h3>
                      <p className="text-gray-600" style={{ fontSize: '1.373vw' }}>系统化学习</p>
                    </div>
                    
                    {/* 功能介绍 */}
                    <div className="flex flex-col" style={{ gap: '3vw', paddingLeft: '1%', marginTop: '6%' }}>
                      <div className="flex items-center" style={{ gap: '2%' }}>
                        <BookOpen className="text-[#67B3FF]" style={{ fontSize: '1.6vw' }} />
                        <span className="text-gray-600" style={{ fontSize: '1.373vw' }}>知识点导航 - 清晰的知识体系结构</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '2%' }}>
                        <ClipboardList className="text-[#67B3FF]" style={{ fontSize: '1.6vw' }} />
                        <span className="text-gray-600" style={{ fontSize: '1.373vw' }}>题目练习 - 针对性的知识点练习</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '2%' }}>
                        <Lightbulb className="text-[#67B3FF]" style={{ fontSize: '1.6vw' }} />
                        <span className="text-gray-600" style={{ fontSize: '1.373vw' }}>详细解析 - 深入理解每道题目</span>
                      </div>
                    </div>
                  </div>

                  {/* 底部统计信息和按钮区域 */}
                  <div className="flex justify-between items-end" style={{ marginTop: 'auto', paddingBottom: '6%' }}>
                    <div className="flex" style={{ gap: '24%', marginLeft: '8%' }}>
                      <div className="text-center">
                        <div className="font-bold text-[#97CAFF]" style={{ fontSize: '3.5vw' }}>
                          {statsLoading ? '-' : knowledgePointsCount}
                        </div>
                        <div className="text-gray-700" style={{ fontSize: '1.2vw', marginTop: '0.5%' }}>知识点</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[#A2EBFF]" style={{ fontSize: '3.5vw' }}>
                          {statsLoading ? '-' : questionsCount}
                        </div>
                        <div className="text-gray-700" style={{ fontSize: '1.2vw', marginTop: '0.5%' }}>练习题</div>
                      </div>
                    </div>
                    
                    {/* 右下角箭头 - 删除背景色，放大3倍 */}
                    <div className="flex items-center justify-center" style={{ 
                      width: '40%',
                      height: '40%',
                      marginRight: '-10%', 
                      marginBottom: '-5%' 
                    }}>
                      <ArrowRight className="text-[#3B82F6]" style={{ width: '100%', height: '100%', strokeWidth: 2 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：试题训练 */}
            <div className="relative group cursor-pointer" onClick={handleQuestionTraining}>
              {/* 使用图片作为容器 */}
              <div 
                className="relative w-full aspect-square rounded-3xl overflow-visible shadow-2xl hover:scale-105 transition-all duration-500"
                style={{
                  backgroundImage: `url(${trainingCenterBg})`,
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                {/* 内容区域 - 使用相对单位确保文字随图片缩放 */}
                <div className="absolute inset-0 flex flex-col" style={{ padding: '8%' }}>
                  {/* 顶部标题区域 */}
                  <div className="flex flex-col" style={{ gap: '7%', paddingTop: '2%' }}>
                    <div>
                      <h3 className="font-bold text-gray-800" style={{ fontSize: '2.496vw' }}>试题训练</h3>
                      <p className="text-gray-600" style={{ fontSize: '1.373vw' }}>自动组卷练习</p>
                    </div>
                    
                    {/* 功能介绍 */}
                    <div className="flex flex-col" style={{ gap: '3vw', paddingLeft: '1%', marginTop: '6%' }}>
                      <div className="flex items-center" style={{ gap: '2%' }}>
                        <Brain className="text-[#79E3DA]" style={{ fontSize: '1.6vw' }} />
                        <span className="text-gray-600" style={{ fontSize: '1.373vw' }}>智能组卷 - 根据难度自动生成试卷</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '2%' }}>
                        <ClipboardList className="text-[#79E3DA]" style={{ fontSize: '1.6vw' }} />
                        <span className="text-gray-600" style={{ fontSize: '1.373vw' }}>答题卡模式 - 真实考试体验</span>
                      </div>
                      <div className="flex items-center" style={{ gap: '2%' }}>
                        <Lightbulb className="text-[#79E3DA]" style={{ fontSize: '1.6vw' }} />
                        <span className="text-gray-600" style={{ fontSize: '1.373vw' }}>实时反馈 - 即时查看答题结果</span>
                      </div>
                    </div>
                  </div>

                  {/* 底部统计信息和按钮区域 */}
                  <div className="flex justify-between items-end" style={{ marginTop: 'auto', paddingBottom: '6%' }}>
                    <div className="flex" style={{ gap: '24%', marginLeft: '8%' }}>
                      <div className="text-center">
                        <div className="font-bold text-[#79E3DA]" style={{ fontSize: '3.5vw' }}>100</div>
                        <div className="text-gray-700" style={{ fontSize: '1.2vw', marginTop: '0.5%' }}>题目/卷</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-[#97CAFF]" style={{ fontSize: '3.5vw' }}>120</div>
                        <div className="text-gray-700" style={{ fontSize: '1.2vw', marginTop: '0.5%' }}>分钟</div>
                      </div>
                    </div>
                    
                    {/* 右下角箭头 - 删除背景色，放大3倍 */}
                    <div className="flex items-center justify-center" style={{ 
                      width: '40%',
                      height: '40%',
                      marginRight: '-10%', 
                      marginBottom: '-5%' 
                    }}>
                      <ArrowRight className="text-[#3B82F6]" style={{ width: '100%', height: '100%', strokeWidth: 2 }} />
                    </div>
                  </div>
                </div>

                {/* Loading 状态覆盖层 */}
                {isGenerating && (
                  <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center">
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
          </div>

          {/* 底部提示 */}
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
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