import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Play, BookOpen, Clock, Users, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aiCourseHero from "@/assets/ai-course-hero.jpg";

export const Courses = () => {
  const navigate = useNavigate();
  const [enrolledCourses] = useState(['ai-basics']); // 模拟已报名课程

  const courseData = {
    id: 'ai-basics',
    title: '生成式人工智能基础与应用',
    description: '全面学习生成式AI的基础理论、核心技术和实际应用，为成为专业AI训练师奠定坚实基础。',
    duration: '50小时',
    students: 1250,
    rating: 4.9,
    price: '免费',
    progress: 65, // 模拟学习进度
    chapters: [
      {
        id: 1,
        title: '人工智能概述',
        lessons: 5,
        duration: '120分钟',
        completed: true
      },
      {
        id: 2,
        title: '机器学习基础',
        lessons: 8,
        duration: '200分钟',
        completed: true
      },
      {
        id: 3,
        title: '深度学习原理',
        lessons: 10,
        duration: '300分钟',
        completed: false,
        current: true
      },
      {
        id: 4,
        title: '生成式AI技术',
        lessons: 12,
        duration: '360分钟',
        completed: false
      },
      {
        id: 5,
        title: '实际应用案例',
        lessons: 8,
        duration: '240分钟',
        completed: false
      },
      {
        id: 6,
        title: '项目实践',
        lessons: 6,
        duration: '180分钟',
        completed: false
      }
    ]
  };

  const isEnrolled = enrolledCourses.includes(courseData.id);

  const handleEnroll = () => {
    // 模拟报名逻辑
    if (!isEnrolled) {
      // 这里可以添加报名逻辑
      console.log('报名课程');
    }
  };

  const handleStartLearning = (chapterId?: number) => {
    // 模拟开始学习逻辑
    navigate('/courses/ai-basics/learn', { 
      state: { chapterId: chapterId || courseData.chapters.find(c => c.current)?.id || 1 } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            课程中心
          </h1>
          <p className="text-xl text-muted-foreground">
            系统性学习生成式人工智能知识体系
          </p>
        </div>

        {/* 课程详情 */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧课程信息 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 课程头部信息 */}
              <Card className="shadow-medium">
                <CardContent className="p-0">
                  <div className="relative">
                    <img 
                      src={aiCourseHero} 
                      alt={courseData.title}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute inset-0 gradient-hero opacity-30 rounded-t-lg"></div>
                    <Badge className="absolute top-4 right-4 bg-white/90 text-primary">
                      官方认证
                    </Badge>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-3xl font-bold mb-4">{courseData.title}</h2>
                    <p className="text-muted-foreground mb-6">{courseData.description}</p>
                    
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        共 {courseData.duration}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {courseData.students} 人在学习
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        完成可获得证书
                      </div>
                    </div>

                    {isEnrolled && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span>学习进度</span>
                          <span>{courseData.progress}%</span>
                        </div>
                        <Progress value={courseData.progress} className="h-2" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 课程内容 */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>课程内容</CardTitle>
                  <CardDescription>
                    系统化的课程设计，循序渐进掌握AI核心技术
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courseData.chapters.map((chapter) => (
                      <div 
                        key={chapter.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          chapter.completed ? 'bg-green-50 border-green-200' :
                          chapter.current ? 'bg-blue-50 border-primary' :
                          'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">
                              第{chapter.id}章 {chapter.title}
                            </h4>
                            <div className="flex gap-4 text-sm text-muted-foreground">
                              <span>{chapter.lessons} 节课</span>
                              <span>{chapter.duration}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {chapter.completed && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                已完成
                              </Badge>
                            )}
                            {chapter.current && (
                              <Badge className="bg-primary text-white">
                                学习中
                              </Badge>
                            )}
                            {isEnrolled && (
                              <Button 
                                size="sm" 
                                variant={chapter.current ? "default" : "outline"}
                                onClick={() => handleStartLearning(chapter.id)}
                              >
                                <Play className="h-4 w-4 mr-1" />
                                {chapter.completed ? '重新学习' : chapter.current ? '继续学习' : '开始学习'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧操作面板 */}
            <div className="space-y-6">
              <Card className="shadow-medium sticky top-24">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-primary">
                    {courseData.price}
                  </CardTitle>
                  <CardDescription>
                    限时免费开放
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!isEnrolled ? (
                    <Button 
                      className="w-full gradient-primary text-white hover:opacity-90"
                      onClick={handleEnroll}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      立即报名
                    </Button>
                  ) : (
                    <Button 
                      className="w-full gradient-primary text-white hover:opacity-90"
                      onClick={() => handleStartLearning()}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      继续学习
                    </Button>
                  )}
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>课程时长</span>
                      <span>{courseData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>学习人数</span>
                      <span>{courseData.students}+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>课程评分</span>
                      <span>⭐ {courseData.rating}/5.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span>学习方式</span>
                      <span>在线自学</span>
                    </div>
                    <div className="flex justify-between">
                      <span>证书认证</span>
                      <span>✅ 支持</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 学习提示 */}
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle className="text-lg">学习建议</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• 建议每天学习1-2小时</p>
                  <p>• 认真完成每章节练习</p>
                  <p>• 参与讨论增强理解</p>
                  <p>• 定期复习巩固知识</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};