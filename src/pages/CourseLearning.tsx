import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  Users,
  Award,
  MessageSquare
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";

const CourseLearning = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(1);

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
        lessons: 5,
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
        lessons: 8,
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
        lessons: 10,
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
          { id: 8, title: '生成对抗网络', duration: '30分钟', completed: false },
          { id: 9, title: '变分自编码器', duration: '25分钟', completed: false },
          { id: 10, title: '实践项目', duration: '25分钟', completed: false }
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
  const currentLessonData = currentChapterData?.lessons?.find(lesson => lesson.current) || currentChapterData?.lessons?.[0];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePreviousLesson = () => {
    if (currentLesson > 1) {
      setCurrentLesson(currentLesson - 1);
    }
  };

  const handleNextLesson = () => {
    if (currentChapterData?.lessons && currentLesson < currentChapterData.lessons.length) {
      setCurrentLesson(currentLesson + 1);
    }
  };

  const handleBackToCourse = () => {
    navigate('/courses');
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
              {/* 左侧：视频播放区域 */}
              <div className="lg:col-span-3">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
                  <CardContent className="p-0">
                    {/* 视频播放器区域 */}
                    <div className="relative bg-black rounded-t-lg">
                      <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <div className="text-center text-white">
                          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Play className="h-8 w-8" />
                          </div>
                          <p className="text-lg font-semibold">视频播放器</p>
                          <p className="text-sm text-gray-300">点击播放按钮开始学习</p>
                        </div>
                      </div>
                      
                      {/* 播放控制栏 */}
                      <div className="bg-black/80 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handlePlayPause}
                            className="border-white/30 text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handlePreviousLesson}
                            className="border-white/30 text-white hover:bg-white/20"
                          >
                            <SkipBack className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleNextLesson}
                            className="border-white/30 text-white hover:bg-white/20"
                          >
                            <SkipForward className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-4 text-white text-sm">
                          <span>00:00 / {currentLessonData?.duration}</span>
                          <div className="w-32 h-1 bg-white/30 rounded-full">
                            <div className="w-1/3 h-full bg-white rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 课程内容标签页 */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">课程内容</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="video" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="video">视频</TabsTrigger>
                        <TabsTrigger value="notes">笔记</TabsTrigger>
                        <TabsTrigger value="resources">资源</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="video" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">
                            {currentLessonData?.title}
                          </h3>
                          <p className="text-muted-foreground">
                            这是第{currentChapter}章的第{currentLesson}节课，时长{currentLessonData?.duration}。
                            本节课将深入讲解相关概念和实际应用。
                          </p>
                          <div className="bg-white/5 p-4 rounded-lg">
                            <h4 className="font-semibold text-foreground mb-2">学习要点：</h4>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              <li>• 理解核心概念和原理</li>
                              <li>• 掌握实际应用方法</li>
                              <li>• 完成相关练习和作业</li>
                              <li>• 参与讨论和互动</li>
                            </ul>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="notes" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">学习笔记</h3>
                          <div className="bg-white/5 p-4 rounded-lg min-h-32">
                            <p className="text-muted-foreground">在这里记录你的学习笔记...</p>
                          </div>
                          <Button className="w-full">
                            <BookOpen className="h-4 w-4 mr-2" />
                            保存笔记
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="resources" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-foreground">学习资源</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card className="bg-white/5 border-white/10">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-foreground mb-2">课程资料</h4>
                                <p className="text-sm text-muted-foreground mb-3">下载相关课程资料和文档</p>
                                <Button size="sm" variant="outline">下载</Button>
                              </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10">
                              <CardContent className="p-4">
                                <h4 className="font-semibold text-foreground mb-2">练习题目</h4>
                                <p className="text-sm text-muted-foreground mb-3">完成相关练习和作业</p>
                                <Button size="sm" variant="outline">开始练习</Button>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </div>

              {/* 右侧：课程大纲 */}
              <div className="space-y-6">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">课程大纲</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {courseData.chapters.map((chapter) => (
                      <div key={chapter.id} className="space-y-2">
                        <div 
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            chapter.id === currentChapter 
                              ? 'bg-primary/20 border border-primary/30' 
                              : 'bg-white/5 hover:bg-white/10'
                          }`}
                          onClick={() => setCurrentChapter(chapter.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground text-sm">
                                第{chapter.id}章 {chapter.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {chapter.lessons?.length}节课 · {chapter.duration}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {chapter.completed && (
                                <CheckCircle className="h-4 w-4 text-green-400" />
                              )}
                              {chapter.current && (
                                <Badge className="bg-primary text-white text-xs">进行中</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* 显示当前章节的课程列表 */}
                        {chapter.id === currentChapter && chapter.lessons && (
                          <div className="ml-4 space-y-1">
                            {chapter.lessons.map((lesson) => (
                              <div 
                                key={lesson.id}
                                className={`p-2 rounded cursor-pointer transition-colors ${
                                  lesson.id === currentLesson 
                                    ? 'bg-primary/10 border border-primary/20' 
                                    : 'hover:bg-white/5'
                                }`}
                                onClick={() => setCurrentLesson(lesson.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-foreground">{lesson.title}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                                    {lesson.completed && (
                                      <CheckCircle className="h-3 w-3 text-green-400" />
                                    )}
                                    {lesson.current && (
                                      <Badge className="bg-primary text-white text-xs">当前</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* 学习统计 */}
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground text-lg">学习统计</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">整体进度</span>
                      <span className="text-sm font-semibold text-foreground">{courseData.progress}%</span>
                    </div>
                    <Progress value={courseData.progress} className="h-2 bg-white/20" />
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-foreground">12</div>
                        <div className="text-xs text-muted-foreground">已完成</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-foreground">8</div>
                        <div className="text-xs text-muted-foreground">进行中</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 快捷操作 */}
                <div className="space-y-2">
                  <Button className="w-full bg-primary hover:bg-primary-dark text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    学习讨论
                  </Button>
                  <Button variant="outline" className="w-full border-border text-foreground hover:bg-muted/50">
                    <Award className="h-4 w-4 mr-2" />
                    查看证书
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
