import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Target, Trophy, TrendingUp, User, BookOpen, Play, Brain, RotateCcw } from "lucide-react";
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

  const [userStats] = useState({
    totalQuestions: 1250,
    correctAnswers: 1050,
    accuracy: 84,
    studyTime: 125,
    wrongQuestions: 200
  });

  const practiceModules = [
    {
      id: 'chapter-practice',
      title: '章节练习',
      description: '按照课程章节进行针对性练习，巩固知识点',
      icon: BookOpen,
      questions: 680,
      chapters: [
        { name: '人工智能概述', questions: 50, completed: true },
        { name: '机器学习基础', questions: 120, completed: true },
        { name: '深度学习原理', questions: 150, completed: false, current: true },
        { name: '生成式AI技术', questions: 200, completed: false },
        { name: '实际应用案例', questions: 100, completed: false },
        { name: '项目实践', questions: 60, completed: false }
      ]
    }
  ];

  const simulationExams = [
    {
      id: 'mock-1',
      title: '模拟考试一',
      description: '基础知识综合测试',
      questions: 100,
      duration: 120,
      difficulty: '初级',
      taken: true,
      score: 85
    },
    {
      id: 'mock-2', 
      title: '模拟考试二',
      description: '应用能力综合测试',
      questions: 120,
      duration: 150,
      difficulty: '中级',
      taken: true,
      score: 78
    },
    {
      id: 'mock-3',
      title: '模拟考试三', 
      description: '高级实战综合测试',
      questions: 150,
      duration: 180,
      difficulty: '高级',
      taken: false,
      score: null
    }
  ];

  const wrongQuestionTypes = [
    { type: '机器学习算法', count: 45, percentage: 23 },
    { type: '深度学习原理', count: 38, percentage: 19 },
    { type: '生成式AI应用', count: 42, percentage: 21 },
    { type: '数据处理方法', count: 35, percentage: 18 },
    { type: '模型评估指标', count: 40, percentage: 19 }
  ];

  const handleStartPractice = (type: string, id?: string) => {
    if (type === 'chapter') {
      navigate(`/training/chapter/${id}`);
    } else if (type === 'simulation') {
      navigate(`/training/simulation/${id}`);
    } else if (type === 'wrong-questions') {
      navigate('/training/wrong-questions');
    }
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
              <h1 className="text-3xl font-bold text-foreground mb-2">训练中心</h1>
              <p className="text-xl text-muted-foreground">
                全方位练习提升，轻松通过AI训练师认证考试
              </p>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button variant="outline" onClick={() => navigate("/training/history")} className="border-border text-foreground hover:bg-muted/50">
                  <Clock className="h-4 w-4 mr-2" />
                  训练历史
                </Button>
                <Button variant="outline" onClick={() => navigate("/training/analysis")} className="border-border text-foreground hover:bg-muted/50">
                  <Target className="h-4 w-4 mr-2" />
                  知识点分析
                </Button>
              </div>
                    </div>

            {/* 统计面板 */}
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{userStats.totalQuestions}</div>
                    <div className="text-sm text-muted-foreground">累计练习题目</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userStats.correctAnswers}</div>
                    <div className="text-sm text-muted-foreground">正确答题数</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userStats.accuracy}%</div>
                    <div className="text-sm text-muted-foreground">答题准确率</div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{userStats.studyTime}h</div>
                    <div className="text-sm text-muted-foreground">学习时长</div>
                </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{userStats.wrongQuestions}</div>
                    <div className="text-sm text-muted-foreground">错题数量</div>
                            </div>
                </CardContent>
              </Card>
                          </div>
                          
            {/* 主要内容 */}
            <Tabs defaultValue="practice" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
                <TabsTrigger value="practice" className="data-[state=active]:bg-white/20">题目练习</TabsTrigger>
                <TabsTrigger value="simulation" className="data-[state=active]:bg-white/20">模拟考试</TabsTrigger>
                <TabsTrigger value="wrong-questions" className="data-[state=active]:bg-white/20">错题练习</TabsTrigger>
              </TabsList>

              {/* 题目练习 */}
              <TabsContent value="practice" className="space-y-6">
                {practiceModules.map((module) => (
                  <Card key={module.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-primary w-16 h-16 rounded-xl flex items-center justify-center shadow-soft">
                          <module.icon className="h-8 w-8 text-white" />
                            </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl text-foreground">{module.title}</CardTitle>
                          <CardDescription className="text-muted-foreground mt-1">{module.description}</CardDescription>
                          <div className="flex items-center gap-4 mt-3">
                            <Badge variant="outline" className="bg-white/10 border-white/20 text-foreground">
                              <BookOpen className="h-3 w-3 mr-1" />
                              共 {module.questions} 道题目
                            </Badge>
                            <Badge variant="outline" className="bg-white/10 border-white/20 text-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              6个章节
                            </Badge>
                          </div>
                  </div>
                </div>
                      </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-3">
                        {module.chapters.map((chapter, index) => (
                          <div key={index} className="group relative overflow-hidden">
                            <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-primary/30 transition-all duration-300 hover:shadow-soft">
                              <div className="flex items-center gap-3 flex-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${
                                  chapter.completed ? 'bg-green-100 text-green-700' : 
                                  chapter.current ? 'bg-primary text-white' : 
                                  'bg-muted text-muted-foreground'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {chapter.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <Target className="h-3 w-3" />
                                    {chapter.questions} 题
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {chapter.completed && (
                                  <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                                    ✓ 已完成
                                  </Badge>
                                )}
                                {chapter.current && (
                                  <Badge className="bg-primary text-white border-0 shadow-soft">
                                    🔥 进行中
                                  </Badge>
                                )}
                                <Button 
                                  size="sm"
                                  variant={chapter.completed ? "outline" : "default"}
                                  className={`transition-all duration-300 ${
                                    chapter.completed ? 'hover:bg-primary hover:text-primary-foreground' : 
                                    'shadow-soft hover:shadow-medium'
                                  }`}
                                  onClick={() => handleStartPractice('chapter', chapter.name)}
                                >
                                  <Target className="h-4 w-4 mr-1" />
                                  {chapter.completed ? '重新练习' : chapter.current ? '继续练习' : '开始练习'}
                                </Button>
                              </div>
                            </div>
                            
                            {/* Progress bar for completed chapters */}
                            {chapter.completed && (
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-200">
                                <div className="h-full bg-green-500 w-full rounded-b-xl"></div>
                              </div>
                            )}
                            {chapter.current && (
                              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary/20">
                                <div className="h-full bg-primary w-3/4 rounded-b-xl"></div>
                            </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Chapter overview */}
                      <div className="mt-6 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">章节完成进度</div>
                          <div className="text-sm font-medium text-primary">
                            {module.chapters.filter(c => c.completed).length} / {module.chapters.length} 章节已完成
                          </div>
                        </div>
                        <Progress 
                          value={(module.chapters.filter(c => c.completed).length / module.chapters.length) * 100} 
                          className="h-2 mt-2 bg-white/20"
                        />
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </TabsContent>

              {/* 模拟考试 */}
              <TabsContent value="simulation" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {simulationExams.map((exam) => (
                    <Card key={exam.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
                            <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                            <CardTitle className="text-foreground">{exam.title}</CardTitle>
                            <CardDescription className="text-muted-foreground">{exam.description}</CardDescription>
                        </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">题目数量:</span>
                            <span className="text-foreground">{exam.questions} 题</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">考试时长:</span>
                            <span className="text-foreground">{exam.duration} 分钟</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">难度等级:</span>
                            <Badge variant="outline" className="border-white/20 text-foreground">{exam.difficulty}</Badge>
                          </div>
                          
                          {exam.taken && exam.score && (
                            <div className="mt-4 p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-green-700">上次成绩:</span>
                                <span className="font-bold text-green-700">{exam.score}分</span>
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            className="w-full mt-4 bg-primary hover:bg-primary-dark text-white"
                            onClick={() => handleStartPractice('simulation', exam.id)}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            {exam.taken ? '重新考试' : '开始考试'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* 错题练习 */}
              <TabsContent value="wrong-questions" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
                          <RotateCcw className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-foreground">错题分析</CardTitle>
                          <CardDescription className="text-muted-foreground">按知识点分类的错题统计</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {wrongQuestionTypes.map((type, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-foreground">{type.type}</span>
                              <span className="text-muted-foreground">{type.count} 题 ({type.percentage}%)</span>
                            </div>
                            <Progress value={type.percentage * 5} className="h-2 bg-white/20" />
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6">
                        <Button 
                          className="w-full bg-primary hover:bg-primary-dark text-white"
                          onClick={() => handleStartPractice('wrong-questions')}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          开始错题练习
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-foreground">练习建议</CardTitle>
                      <CardDescription className="text-muted-foreground">基于您的错题情况提供的学习建议</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-warning-light rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2">重点关注</h4>
                        <p className="text-sm text-yellow-700">
                          您在"机器学习算法"和"生成式AI应用"方面的错题较多，建议重点复习相关章节。
                        </p>
                      </div>
                      
                      <div className="p-4 bg-info-light rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-800 mb-2">学习策略</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• 每天练习20-30道错题</li>
                          <li>• 结合课程内容复习理论</li>
                          <li>• 做题后及时查看解析</li>
                          <li>• 定期回顾已掌握的知识点</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-success-light rounded-lg border border-green-200">
                        <h4 className="font-medium text-green-800 mb-2">进度目标</h4>
                        <p className="text-sm text-green-700">
                          建议在考试前将错题正确率提升至90%以上，增强考试信心。
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCenter;