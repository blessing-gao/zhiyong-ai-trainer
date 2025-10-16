import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  Award
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

const CourseLearning = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentChapter, setCurrentChapter] = useState(3); // 默认显示第3章（当前进行中）
  const [currentLesson, setCurrentLesson] = useState(1);
  const [showExperiment, setShowExperiment] = useState(false);

  // Apply theme based on user role
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  // 从路由状态获取章节ID
  useEffect(() => {
    if (location.state?.chapterId) {
      setCurrentChapter(location.state.chapterId);
    }
  }, [location.state]);

  const courseData = {
    id: 'ai-basics',
    title: '生成式人工智能基础与应用',
    description: '全面学习生成式AI的基础理论、核心技术和实际应用，为成为专业AI训练师奠定坚实基础。',
    duration: '50小时',
    students: 1250,
    rating: 4.9,
    progress: 65,
    chapters: [
      {
        id: 1,
        title: '人工智能概述',
        lessonCount: 5,
        duration: '120分钟',
        completed: true,
        lessons: [
          { id: 1, title: '什么是人工智能', duration: '25分钟', completed: true },
          { id: 2, title: 'AI发展历程', duration: '20分钟', completed: true },
          { id: 3, title: 'AI应用领域', duration: '30分钟', completed: true },
          { id: 4, title: 'AI技术分类', duration: '25分钟', completed: true },
          { id: 5, title: 'AI未来趋势', duration: '20分钟', completed: true }
        ]
      },
      {
        id: 2,
        title: '机器学习基础',
        lessonCount: 8,
        duration: '200分钟',
        completed: true,
        lessons: [
          { id: 1, title: '机器学习概念', duration: '30分钟', completed: true },
          { id: 2, title: '监督学习', duration: '35分钟', completed: true },
          { id: 3, title: '无监督学习', duration: '30分钟', completed: true },
          { id: 4, title: '强化学习', duration: '25分钟', completed: true },
          { id: 5, title: '特征工程', duration: '40分钟', completed: true },
          { id: 6, title: '模型评估', duration: '20分钟', completed: true },
          { id: 7, title: '过拟合与欠拟合', duration: '15分钟', completed: true },
          { id: 8, title: '实践案例', duration: '25分钟', completed: true }
        ]
      },
      {
        id: 3,
        title: '深度学习原理',
        lessonCount: 8,
        duration: '300分钟',
        completed: false,
        current: true,
        lessons: [
          { id: 1, title: '神经网络基础', duration: '35分钟', completed: true },
          { id: 2, title: '反向传播算法', duration: '40分钟', completed: true },
          { id: 3, title: '激活函数', duration: '25分钟', completed: true },
          { id: 4, title: '卷积神经网络', duration: '45分钟', completed: true },
          { id: 5, title: '循环神经网络', duration: '40分钟', completed: false, current: true },
          { id: 6, title: '注意力机制', duration: '35分钟', completed: false },
          { id: 7, title: 'Transformer架构', duration: '40分钟', completed: false },
          { id: 8, title: '生成对抗网络', duration: '30分钟', completed: false }
        ]
      },
      {
        id: 4,
        title: '生成式AI技术',
        lessons: 12,
        duration: '360分钟',
        completed: false,
        lessons: [
          { id: 1, title: '生成式模型概述', duration: '30分钟', completed: false },
          { id: 2, title: 'GPT系列模型', duration: '35分钟', completed: false },
          { id: 3, title: 'BERT模型原理', duration: '30分钟', completed: false },
          { id: 4, title: '扩散模型', duration: '40分钟', completed: false },
          { id: 5, title: 'Stable Diffusion', duration: '35分钟', completed: false },
          { id: 6, title: 'DALL-E技术', duration: '30分钟', completed: false },
          { id: 7, title: 'ChatGPT原理', duration: '35分钟', completed: false },
          { id: 8, title: '多模态生成', duration: '40分钟', completed: false },
          { id: 9, title: '提示工程', duration: '25分钟', completed: false },
          { id: 10, title: '微调技术', duration: '30分钟', completed: false },
          { id: 11, title: 'RLHF技术', duration: '35分钟', completed: false },
          { id: 12, title: '实际应用案例', duration: '30分钟', completed: false }
        ]
      },
      {
        id: 5,
        title: '实际应用案例',
        lessons: 8,
        duration: '240分钟',
        completed: false,
        lessons: [
          { id: 1, title: '文本生成应用', duration: '30分钟', completed: false },
          { id: 2, title: '图像生成应用', duration: '35分钟', completed: false },
          { id: 3, title: '代码生成应用', duration: '30分钟', completed: false },
          { id: 4, title: '音乐生成应用', duration: '25分钟', completed: false },
          { id: 5, title: '视频生成应用', duration: '40分钟', completed: false },
          { id: 6, title: '3D模型生成', duration: '35分钟', completed: false },
          { id: 7, title: '游戏内容生成', duration: '30分钟', completed: false },
          { id: 8, title: '商业应用案例', duration: '25分钟', completed: false }
        ]
      },
      {
        id: 6,
        title: '项目实践',
        lessons: 6,
        duration: '180分钟',
        completed: false,
        lessons: [
          { id: 1, title: '项目规划', duration: '30分钟', completed: false },
          { id: 2, title: '数据准备', duration: '35分钟', completed: false },
          { id: 3, title: '模型训练', duration: '40分钟', completed: false },
          { id: 4, title: '模型优化', duration: '30分钟', completed: false },
          { id: 5, title: '应用部署', duration: '25分钟', completed: false },
          { id: 6, title: '项目总结', duration: '20分钟', completed: false }
        ]
      }
    ]
  };

  const currentChapterData = courseData.chapters.find(ch => ch.id === currentChapter);
  const currentLessonData = currentChapterData?.lessons?.find(lesson => lesson.id === currentLesson) || currentChapterData?.lessons?.[0];

  // 实验环境状态
  const [experimentStarted, setExperimentStarted] = useState(false);
  
  // 定义不同课时的实验类型
  const getExperimentType = () => {
    if (currentLesson === 1) return 'knowledge-graph'; // 知识图谱
    if (currentLesson === 2) return 'workflow'; // 工作流
    if (currentLesson === 3) return 'coding'; // 代码编辑器
    if (currentLesson === 4) return 'notebook'; // Jupyter Notebook
    if (currentLesson === 5) return 'interactive'; // 交互式实验
    return 'knowledge-graph'; // 默认使用知识图谱
  };

  const handleBackToCourse = () => {
    navigate('/courses');
  };

  const handleStartExperiment = () => {
    setExperimentStarted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 返回按钮和课程信息 */}
            <div className="mb-6 flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={handleBackToCourse}
                className="border-border text-foreground hover:bg-muted/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回课程中心
              </Button>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-foreground">{courseData.title}</h1>
                <p className="text-muted-foreground">第{currentChapter}章 {currentChapterData?.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 左侧：课程大纲 */}
              <div className="lg:col-span-1">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">
                      第{currentChapterData?.id}章 {currentChapterData?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {currentChapterData?.lessons && currentChapterData.lessons.map((lesson) => (
                      <div 
                        key={lesson.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          lesson.id === currentLesson 
                            ? 'bg-blue-50 border border-blue-200' 
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setCurrentLesson(lesson.id)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm text-foreground font-medium">{lesson.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                          </div>
                          {lesson.completed && (
                            <CheckCircle className="h-4 w-4 text-green-500 fill-green-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* 右侧：Tab页内容区域 */}
              <div className="lg:col-span-3">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <Tabs defaultValue="ppt" className="w-full">
                      {/* Tab 标签栏 - 类似浏览器标签页 */}
                      <div className="border-b-2 border-gray-200 bg-gradient-to-b from-gray-50 to-gray-100">
                        <TabsList className="h-auto bg-transparent border-0 rounded-none w-full justify-start px-2 pt-2 gap-1">
                          <TabsTrigger 
                            value="ppt" 
                            className="relative h-10 rounded-t-md rounded-b-none px-5 py-2 bg-white/60 border border-gray-300 border-b-0 text-gray-700 hover:bg-white/80 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-gray-400 data-[state=active]:border-b-white data-[state=active]:-mb-0.5"
                          >
                            <span className="mr-1">📊</span> PPT
                          </TabsTrigger>
                          <TabsTrigger 
                            value="video" 
                            className="relative h-10 rounded-t-md rounded-b-none px-5 py-2 bg-white/60 border border-gray-300 border-b-0 text-gray-700 hover:bg-white/80 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-gray-400 data-[state=active]:border-b-white data-[state=active]:-mb-0.5"
                          >
                            <span className="mr-1">🎥</span> 视频
                          </TabsTrigger>
                          <TabsTrigger 
                            value="experiment" 
                            className="relative h-10 rounded-t-md rounded-b-none px-5 py-2 bg-white/60 border border-gray-300 border-b-0 text-gray-700 hover:bg-white/80 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-gray-400 data-[state=active]:border-b-white data-[state=active]:-mb-0.5"
                          >
                            <span className="mr-1">🧪</span> 实验
                          </TabsTrigger>
                      </TabsList>
                      </div>
                      
                      {/* PPT Tab */}
                      <TabsContent value="ppt" className="mt-0 p-6">
                        <div className="space-y-6">
                          <div>
                            <h2 className="text-2xl font-bold text-foreground mb-4">
                              实验4：提示工程实战
                            </h2>
                            
                        <div className="space-y-4">
                              <div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">实验目的</h3>
                                <div className="bg-white/5 p-4 rounded-lg">
                                  <ol className="space-y-3 text-muted-foreground">
                                    <li className="flex gap-2">
                                      <span className="font-semibold">1.</span>
                                      <div>
                                        <p className="font-semibold mb-1">掌握提示词 (Prompt) 的核心设计技巧：</p>
                                        <ul className="ml-4 space-y-1 text-sm">
                                          <li>• 理解提示词的基本构成要素（如角色、任务、上下文、格式、示例等）。</li>
                                          <li>• 能够针对不同应用场景（如邮件撰写、代码解释、市场分析、食谱生成等）设计清晰、具体、能够引导 AI 产出初步期望结果的基础提示词。</li>
                                        </ul>
                                      </div>
                                    </li>
                                    <li className="flex gap-2">
                                      <span className="font-semibold">2.</span>
                                      <div>
                                        <p className="font-semibold mb-1">熟练运用提示词的优化策略与高级技巧：</p>
                                        <ul className="ml-4 space-y-1 text-sm">
                                          <li>• 深入理解并实践提示词优化六大原则：清晰 (Clarity)、参考 (Reference/Context)、分解 (Decomposition)、引导 (Guidance/Role-playing)、工具 (Tool use/Constraints)、迭代 (Iteration)。</li>
                                          <li>• 学习并应用高级提示工程技巧，如思维链 (Chain-of-Thought, CoT) 来引导 AI 进行复杂推理。</li>
                                        </ul>
                                      </div>
                                    </li>
                                  </ol>
                                </div>
                              </div>

                              <div>
                                <h3 className="text-xl font-semibold text-foreground mb-3">实验步骤</h3>
                                <div className="bg-white/5 p-4 rounded-lg">
                          <p className="text-muted-foreground">
                                    本实验将通过实际案例，帮助你掌握提示工程的核心技巧...
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* 视频 Tab */}
                      <TabsContent value="video" className="mt-0 p-6">
                        <div className="space-y-4">
                          <h2 className="text-2xl font-bold text-foreground">课程视频</h2>
                          <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                            <div className="text-white text-center">
                              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="h-10 w-10" />
                              </div>
                              <p>视频播放器</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      {/* 实验 Tab */}
                      <TabsContent value="experiment" className="mt-0 p-0">
                        {!showExperiment ? (
                          <div className="p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">实验环境</h2>
                            <div className="bg-white/5 p-6 rounded-lg text-center">
                              <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                              <h3 className="font-semibold text-foreground mb-2">准备开始实验</h3>
                              <p className="text-sm text-muted-foreground mb-4">
                                点击下方按钮启动实验环境
                              </p>
                              <Button 
                                className="bg-primary hover:bg-primary-dark text-white"
                                onClick={() => setShowExperiment(true)}
                              >
                                启动实验环境
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-[600px] flex flex-col">
                            {/* 实验环境头部工具栏 */}
                            <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                </div>
                                <span className="text-sm">
                                  {getExperimentType() === 'knowledge-graph' && '网页创作区'}
                                  {getExperimentType() === 'workflow' && '工作流演示项目'}
                                  {getExperimentType() === 'coding' && 'AI 编程环境'}
                                  {getExperimentType() === 'notebook' && 'Jupyter Notebook'}
                                  {getExperimentType() === 'interactive' && '交互式实验'}
                                </span>
                                <span className="text-xs text-green-400">● deepseek-v3-250324</span>
                        </div>
                              <div className="flex items-center gap-2">
                                <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                                  重置
                                </button>
                                <button className="p-1 hover:bg-gray-700 rounded">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </button>
              </div>
                            </div>

                            {/* 实验内容区域 */}
                            <div className="flex-1 bg-white overflow-hidden">
                              {getExperimentType() === 'knowledge-graph' && (
                                <div className="h-full flex flex-col p-6">
                                  <div className="text-center mb-6">
                                    <h1 className="text-3xl font-bold text-blue-700 mb-2">人工智能知识图谱</h1>
                                    <p className="text-gray-600">可视化展示人工智能领域的核心概念、技术、应用和关键人物之间的关系网络</p>
                                  </div>
                                  
                                  <div className="flex gap-4 mb-4">
                                    <div>
                                      <label className="text-sm text-gray-600 mb-1 block">布局类型</label>
                                      <select className="px-4 py-2 border border-gray-300 rounded-lg">
                                        <option>力导向布局</option>
                                        <option>层次布局</option>
                                        <option>圆形布局</option>
                                      </select>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-600 mb-1 block">节点筛选</label>
                                      <select className="px-4 py-2 border border-gray-300 rounded-lg">
                                        <option>全部节点</option>
                                        <option>核心概念</option>
                                        <option>关键技术</option>
                                      </select>
                                    </div>
                                    <button className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg self-end">
                                      重置视图
                                    </button>
                                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg self-end">
                                      搜索节点
                                    </button>
              </div>

                                  <div className="flex-1 border-2 border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                      <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                      </svg>
                                      <p className="text-lg font-medium">知识图谱可视化区域</p>
                                      <p className="text-sm mt-2">图谱节点将在这里交互展示</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {getExperimentType() === 'workflow' && (
                                <div className="h-full flex flex-col">
                                  <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <button className="p-2 hover:bg-gray-100 rounded">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                      </button>
                            <div>
                                        <h2 className="font-semibold">工作流演示项目</h2>
                                        <p className="text-xs text-gray-500">保存时间：2025-04-23 08:51:01</p>
                                      </div>
                            </div>
                            <div className="flex items-center gap-2">
                                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                        + 添加组件
                                      </button>
                                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                        ▶ 调试
                                      </button>
                                      <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                        💾 保存
                                      </button>
                                      <button className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                                        发布
                                      </button>
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 bg-gray-100 p-6 overflow-auto">
                                    <div className="bg-white rounded-lg p-8 min-h-full flex items-center justify-center">
                                      <div className="text-center text-gray-500">
                                        <svg className="h-16 w-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h8M12 8v8" />
                                        </svg>
                                        <p className="text-lg font-medium mb-2">工作流画布</p>
                                        <p className="text-sm">拖拽组件到此处创建工作流</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {getExperimentType() === 'coding' && (
                                <div className="h-full flex">
                                  <div className="w-1/2 bg-gray-900 text-white p-4">
                                    <div className="mb-2 text-sm text-gray-400">index.html</div>
                                    <div className="font-mono text-sm">
                                      <div className="text-gray-500">1</div>
                                      <div className="text-gray-500">2</div>
                                      <div className="text-gray-500">3</div>
                                      <div className="text-green-400">// AI 编程环境</div>
                                      <div className="text-blue-400">// 在此编写代码</div>
                                    </div>
                                  </div>
                                  <div className="w-1/2 bg-white flex items-center justify-center">
                                    <div className="text-center text-gray-500">
                                      <p className="text-lg font-medium">预览区域</p>
                                      <p className="text-sm mt-2">代码运行结果将在这里显示</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {getExperimentType() === 'notebook' && (
                                <div className="h-full flex flex-col bg-white">
                                  <div className="border-b border-gray-200 px-4 py-3">
                                    <div className="flex items-center justify-between">
                                      <h2 className="font-semibold">📓 Notebook - 深度学习实验.ipynb</h2>
                                      <div className="flex gap-2">
                                        <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                          + Cell
                                        </button>
                                        <button className="px-3 py-1 text-sm bg-orange-500 text-white rounded hover:bg-orange-600">
                                          ▶ Run All
                                        </button>
                            </div>
                          </div>
                        </div>
                        
                                  <div className="flex-1 p-4 overflow-auto space-y-3">
                                    {/* Cell 1 */}
                                    <div className="border border-gray-300 rounded">
                                      <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-b flex items-center">
                                        <span>In [1]:</span>
                                      </div>
                                      <div className="p-3 font-mono text-sm bg-white">
                                        <div><span className="text-purple-600">import</span> <span className="text-black">numpy</span> <span className="text-purple-600">as</span> <span className="text-black">np</span></div>
                                        <div><span className="text-purple-600">import</span> <span className="text-black">matplotlib.pyplot</span> <span className="text-purple-600">as</span> <span className="text-black">plt</span></div>
                                      </div>
                                    </div>

                                    {/* Cell 2 */}
                                    <div className="border border-gray-300 rounded">
                                      <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-b">In [2]:</div>
                                      <div className="p-3 font-mono text-sm bg-white text-gray-600">
                                        <div># 加载数据集</div>
                                        <div>X = np.random.randn(100, 2)</div>
                                        <div>y = np.random.randint(0, 2, 100)</div>
                                      </div>
                                    </div>

                                    {/* Cell 3 - 带输出 */}
                                    <div className="border border-gray-300 rounded">
                                      <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-b">In [3]:</div>
                                      <div className="p-3 font-mono text-sm bg-white">
                                        <div>print(<span className="text-green-600">"Data shape:"</span>, X.shape)</div>
                                      </div>
                                      <div className="bg-gray-50 px-3 py-1 text-xs text-gray-500 border-t">Out [3]:</div>
                                      <div className="p-3 font-mono text-sm bg-white">
                                        Data shape: (100, 2)
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {getExperimentType() === 'interactive' && (
                                <div className="h-full flex flex-col bg-white">
                                  <div className="flex-1 p-6 flex items-center justify-center">
                                    <div className="max-w-2xl w-full text-center">
                                      <h2 className="text-2xl font-bold text-gray-800 mb-4">交互式学习环境</h2>
                                      <p className="text-gray-600 mb-6">通过可视化交互界面深入理解AI概念</p>
                                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
                                        <svg className="h-24 w-24 mx-auto mb-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                        <p className="text-gray-700">互动实验即将启动...</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* 底部工具栏 */}
                            <div className="bg-gray-100 border-t border-gray-300 px-4 py-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <button 
                                  className="px-3 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-800"
                                  onClick={() => setShowExperiment(false)}
                                >
                                  ← 返回编辑器
                                </button>
                                <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-200">
                                  🔄 刷新
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button className="p-2 hover:bg-gray-200 rounded">
                                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 底部统计信息 */}
            <div className="mt-6">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">整体进度</span>
                      <span className="text-sm font-semibold text-foreground">{courseData.progress}%</span>
                    </div>
                    <Progress value={courseData.progress} className="h-2 bg-white/20" />
                    </div>
                    
                    <div className="flex items-center justify-center gap-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">12</div>
                        <div className="text-xs text-muted-foreground">已完成</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">8</div>
                        <div className="text-xs text-muted-foreground">进行中</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" className="border-border text-foreground hover:bg-muted/50">
                    <Award className="h-4 w-4 mr-2" />
                    查看证书
                  </Button>
                </div>
              </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CourseLearning;
