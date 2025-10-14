import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, BookOpen, Trophy, TrendingUp, User, MessageSquare, Play, Users, Award } from "lucide-react";
import Header from "@/components/Header";
import BackgroundCircles from "@/components/BackgroundCircles";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import aiCourseHero from "@/assets/ai-course-hero.jpg";

const CourseCenter = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [enrolledCourses] = useState(['ai-basics']); // 模拟已报名课程

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

  const recentActivities = [
    { course: "人工智能概述", time: "10:42:23 AM", score: "95分", status: "已完成" },
    { course: "机器学习基础", time: "09:21:45 AM", score: "88分", status: "已完成" },
    { course: "深度学习原理", time: "08:15:30 AM", score: "92分", status: "进行中" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Header />
      
      {/* 蓝色渐变圆形背景元素 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-80 -right-100 w-[640px] h-[640px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.6) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-100 -right-60 w-[800px] h-[800px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.5) 0%, transparent 70%)',
          animationDelay: '1s'
        }}></div>
      </div>
      
      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 欢迎区域 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{courseData.title}</h1>
              <p className="text-muted-foreground">{courseData.description}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* 课程统计卡片 */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 课程时长 */}
                <Card className="bg-gradient-to-br from-purple-300/30 to-purple-400/20 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">课程时长</p>
                        <p className="text-2xl font-bold text-foreground">{courseData.duration}</p>
                        <p className="text-muted-foreground/70 text-xs">总时长</p>
                      </div>
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* 学习人数 */}
                <Card className="bg-gradient-to-br from-pink-300/30 to-pink-400/20 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">学习人数</p>
                        <p className="text-2xl font-bold text-foreground">{courseData.students}</p>
                        <p className="text-muted-foreground/70 text-xs">人在学习</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                {/* 课程评分 */}
                <Card className="bg-gradient-to-br from-blue-300/30 to-blue-400/20 border-white/20 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm mb-1">课程评分</p>
                        <p className="text-2xl font-bold text-foreground">{courseData.rating}</p>
                        <p className="text-muted-foreground/70 text-xs">⭐ 评分</p>
                      </div>
                      <Award className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 学习进度 */}
              <Card className="bg-white/20 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground text-center">学习进度</CardTitle>
                </CardHeader>
                <CardContent className="flex items-start justify-center pt-2">
                  <div className="relative w-44 h-44">
                    {/* 完整圆形进度条 - 由多个短条组成 */}
                    <div className="absolute inset-0">
                      {/* 生成多个短条组成完整圆形 */}
                      {Array.from({ length: 30 }, (_, i) => {
                        const angle = (i * 360) / 30; // 从0到360度，完整圆形
                        const radius = 65;
                        const centerX = 88;
                        const centerY = 88;
                        // 减去短条宽度的一半，使其围绕圆心旋转
                        const barWidth = 8; // w-2 = 0.5rem = 8px
                        const barHeight = 20; // h-5 = 1.25rem = 20px
                        const x = centerX + radius * Math.cos((angle - 90) * Math.PI / 180) - barWidth / 2;
                        const y = centerY + radius * Math.sin((angle - 90) * Math.PI / 180) - barHeight / 2;
                        const completedBars = Math.floor((courseData.progress / 100) * 30);
                        const isCompleted = i < completedBars;
                        
                        return (
                          <div
                            key={i}
                             className={`absolute w-2 h-5 rounded-full ${
                               isCompleted 
                                 ? 'bg-cyan-400'  // 已完成的65%用青蓝色
                                 : 'bg-blue-600/30'   // 未完成的35%用深蓝色，降低透明度
                             }`}
                            style={{
                              left: `${x}px`,
                              top: `${y}px`,
                              transform: `rotate(${angle}deg)`,
                              transformOrigin: 'center center',
                            }}
                          />
                        );
                      })}
                    </div>
                    {/* 中心文字 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold text-foreground">{courseData.progress}%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 课程内容 */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    课程内容
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mt-1">系统化的课程设计，循序渐进掌握AI核心技术</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {courseData.chapters.map((chapter) => (
                    <div key={chapter.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground text-sm font-medium">第{chapter.id}章 {chapter.title}</span>
                        <span className="text-muted-foreground text-xs">{chapter.lessons}节课</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {chapter.completed && (
                            <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                              已完成
                            </Badge>
                          )}
                          {chapter.current && (
                            <Badge className="bg-primary text-white text-xs">
                              学习中
                            </Badge>
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs">{chapter.duration}</span>
                      </div>
                      {isEnrolled && (
                        <div className="flex justify-end">
                          <Button 
                            size="sm" 
                            variant={chapter.current ? "default" : "outline"}
                            onClick={() => handleStartLearning(chapter.id)}
                            className="text-xs"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {chapter.completed ? '重新学习' : chapter.current ? '继续学习' : '开始学习'}
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* 最近活动 */}
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    最近活动
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-purple-300"></div>
                        <div>
                          <p className="text-foreground text-sm font-medium">{activity.course}</p>
                          <p className="text-muted-foreground text-xs">{activity.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground text-sm">{activity.score}</p>
                        <p className="text-muted-foreground text-xs">{activity.status}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* 快捷操作 */}
            <div className="mt-8 flex flex-wrap gap-4">
              {!isEnrolled ? (
                <Button 
                  className="bg-primary hover:bg-primary-dark text-white"
                  onClick={handleEnroll}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  立即报名
                </Button>
              ) : (
                <Button 
                  className="bg-primary hover:bg-primary-dark text-white"
                  onClick={() => handleStartLearning()}
                >
                  <Play className="h-4 w-4 mr-2" />
                  继续学习
                </Button>
              )}
              <Button variant="outline" className="border-border text-foreground hover:bg-muted/50">
                <User className="h-4 w-4 mr-2" />
                查看证书
              </Button>
              <Button variant="outline" className="border-border text-foreground hover:bg-muted/50">
                <MessageSquare className="h-4 w-4 mr-2" />
                学习讨论
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCenter;
