import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { getAllCourses } from "@/services/courseService";
import CourseListing from "@/components/CourseListing";
import { Course } from "@/types/course";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CourseCenter = () => {
  const { applyRoleTheme } = useTheme();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  // 获取课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (!courses) {
      setFilteredCourses([]);
      return;
    }

    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredCourses(filtered);
  }, [courses, searchQuery]);

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
    { course: "深度学习原理", time: "08:15:30 AM", score: "92分", status: "进行中" },
    { course: "神经网络架构", time: "昨天 16:30", score: "90分", status: "已完成" },
    { course: "自然语言处理", time: "昨天 14:20", score: "87分", status: "已完成" },
    { course: "计算机视觉基础", time: "2天前", score: "93分", status: "已完成" },
    { course: "强化学习入门", time: "3天前", score: "85分", status: "已完成" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      <Header />
      
      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
            {/* 半透明蓝色容器 */}
            <div className="bg-blue-50/20 backdrop-blur-xl rounded-3xl border border-blue-200/30 p-8 shadow-2xl">
            
            {/* 顶部标题和按钮区域 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">{courseData.title}</h1>
              
              {/* 使用与下方内容区域相同的网格布局 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex items-end">
                  <p className="text-muted-foreground whitespace-nowrap">{courseData.description}</p>
                </div>
                <div className="lg:col-span-2">
                  {/* 使用与下方"学习讨论"和"最近活动"相同的二列布局 */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div></div>
                    <div className="flex justify-between gap-3 items-center">
                      <Button 
                        variant="outline" 
                        className="border-border text-foreground hover:bg-muted/50 whitespace-nowrap"
                        onClick={() => setShowCertificate(true)}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        查看证书编号
                      </Button>
                      <Button 
                        className="text-white border-0 whitespace-nowrap"
                        style={{ 
                          background: 'linear-gradient(135deg, #67B3FF 0%, #4A90E2 100%)'
                        }}
                        onClick={() => handleStartLearning()}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        继续学习
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 主要内容区域 - 两列布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* 左侧列 */}
              <div className="lg:col-span-1 flex flex-col space-y-6">
              {/* 课程内容 */}
              <Card className="bg-blue-50/20 border-blue-200/30 backdrop-blur-sm flex-1">
                <CardHeader>
                    <CardTitle className="text-foreground text-lg">课程内容</CardTitle>
                    <p className="text-muted-foreground text-sm">系统化的课程设计，循序渐进掌握AI核心技术</p>
                </CardHeader>
                  <CardContent className="space-y-3">
                  {courseData.chapters.map((chapter) => (
                    <div key={chapter.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground text-sm font-medium">第{chapter.id}章 {chapter.title}</span>
                        <span className="text-muted-foreground text-xs">{chapter.lessons}节课</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {chapter.completed && (
                            <Badge 
                              variant="secondary" 
                              className="text-white text-xs border-0"
                              style={{ 
                                background: 'linear-gradient(135deg, #A2EBFF 0%, #79E3DA 100%)'
                              }}
                            >
                              已完成
                            </Badge>
                          )}
                          {chapter.current && (
                            <Badge 
                              className="text-white text-xs border-0"
                              style={{ backgroundColor: '#67B3FF' }}
                            >
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
                            variant="outline"
                            onClick={() => handleStartLearning(chapter.id)}
                            className="text-xs bg-white border transition-all"
                            style={{
                              borderColor: '#67B3FF',
                              color: '#67B3FF'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#67B3FF';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'white';
                              e.currentTarget.style.color = '#67B3FF';
                            }}
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


            </div>

              {/* 中间列 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 学习讨论和最近活动 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 学习讨论 */}
                  <Card className="bg-blue-50/20 border-blue-200/30 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-foreground text-lg flex items-center gap-2">
                        学习讨论
                        <span className="text-green-500 text-sm">+0.5%</span>
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">avg hours / weeks</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* 点状图数据可视化 */}
                        <div className="h-32 flex items-end justify-center gap-1.5">
                          {Array.from({ length: 12 }, (_, i) => {
                            const stackHeight = Math.floor(Math.random() * 5) + 1;
                            const intensity = Math.random();
                            const colors = ['#A2EBFF', '#79E3DA', '#97CAFF', '#67B3FF'];
                            const colorIndex = Math.floor(intensity * colors.length);
                            const backgroundColor = colors[colorIndex];
                            
                            return (
                              <div key={i} className="flex flex-col gap-1">
                                {Array.from({ length: stackHeight }, (_, j) => (
                                  <div 
                                    key={j}
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor }}
                                  ></div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* 图例 */}
                        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#A2EBFF' }}></div>
                            <span>2 Hours</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#79E3DA' }}></div>
                            <span>4 Hours</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#97CAFF' }}></div>
                            <span>6 Hours</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded" style={{ backgroundColor: '#67B3FF' }}></div>
                            <span>10 Hours</span>
                          </div>
                        </div>

                        {/* 学生讨论列表 */}
                        <div className="space-y-2">
                          {[
                            { name: "Syafanah san", content: "今天这道题。。。。。", time: "Today", status: "Waiting" },
                            { name: "Devon Lane", content: "今天这道题。。。。。", time: "Today", status: "Done" },
                            { name: "Marvin McKinney", content: "今天这道题。。。。。", time: "Yesterday", status: "Done" },
                            { name: "Devon Lane", content: "今天这道题。。。。。", time: "Yesterday", status: "Done" },
                            { name: "Eleanor Pena", content: "今天这道题。。。。。", time: "Yesterday", status: "Failed" }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ 
                                    backgroundColor: item.status === 'Done' ? '#67B3FF' : 
                                                   item.status === 'Waiting' ? '#97CAFF' : '#A2EBFF'
                                  }}
                                ></div>
                                <span className="text-foreground">{item.name}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-foreground">{item.content}</p>
                                <p className="text-muted-foreground">{item.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 最近活动 */}
                  <Card 
                    className="border-blue-200/40 backdrop-blur-sm relative overflow-hidden"
                    style={{ 
                      background: '#FFFFFF'
                    }}
                  >
                    {/* 背景渐变圆圈 */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-50" style={{ background: '#97CAFF' }}></div>
                    <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-50" style={{ background: '#67B3FF' }}></div>
                    
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-foreground text-lg">最近活动</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 relative z-10">
                      {recentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#67B3FF' }}></div>
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
                      <div className="pt-2 border-t border-white/10">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>4H</span>
                          <span>Total work hours include extra hours</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 学习课程资料和统计卡片 */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* 学习课程资料 */}
                  <Card className="bg-blue-50/20 border-blue-200/30 backdrop-blur-sm lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-foreground text-lg">学习课程资料</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          {/* 环形进度条 */}
                          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                            {/* 定义渐变色 */}
                            <defs>
                              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#79E3DA', stopOpacity: 1 }} />
                                <stop offset="50%" style={{ stopColor: '#97CAFF', stopOpacity: 1 }} />
                                <stop offset="100%" style={{ stopColor: '#67B3FF', stopOpacity: 1 }} />
                              </linearGradient>
                            </defs>
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="none"
                              className="text-gray-200"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="url(#progressGradient)"
                              strokeWidth="12"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 40}`}
                              strokeDashoffset={`${2 * Math.PI * 40 * (1 - courseData.progress / 100)}`}
                              className="transition-all duration-1000 ease-out"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-foreground">{courseData.progress}%</div>
                              <div className="text-xs text-muted-foreground">完成度</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 统计卡片 */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* 第一行：课程评分和学习人数 */}
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="bg-blue-50/20 border-blue-200/30 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">课程评分</p>
                              <p className="text-2xl font-bold text-foreground">{courseData.rating}</p>
                              <p className="text-muted-foreground/70 text-xs">years</p>
                            </div>
                            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#A2EBFF' }}>
                              <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-blue-50/20 border-blue-200/30 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-muted-foreground text-xs mb-1">学习人数</p>
                              <p className="text-2xl font-bold text-foreground">{courseData.students}</p>
                              <p className="text-muted-foreground/70 text-xs">人在学习</p>
                            </div>
                            <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#79E3DA' }}>
                              <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* 第二行：课程时长 */}
                    <Card className="bg-blue-50/20 border-blue-200/30 backdrop-blur-sm">
                      <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-foreground text-sm font-medium">时长</span>
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#97CAFF' }}>
                              <span className="text-white text-xs">&gt;</span>
                            </div>
                          </div>
                          <div className="h-8 flex items-end justify-center gap-1">
                            {Array.from({ length: 20 }, (_, i) => (
                              <div 
                                key={i} 
                                className="w-1 rounded-t"
                                style={{ 
                                  backgroundColor: '#67B3FF',
                                  height: `${i < 12 ? '20px' : '8px'}`
                                }}
                              ></div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#67B3FF' }}></div>
                            <span className="text-foreground text-sm">课程时长: 50小时</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* 证书编号弹窗 */}
      <AlertDialog open={showCertificate} onOpenChange={setShowCertificate}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>证书编号</AlertDialogTitle>
            <AlertDialogDescription>
              您的课程证书编号为：
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 text-center">
            <div className="text-2xl font-bold text-primary tracking-wider">
              {certificateNumber}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>确定</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseCenter;
