import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Award, BookOpen, TrendingUp, Calendar, Mail, Phone, CreditCard as Edit3, Settings, GraduationCap, Target, Clock, Trophy, Star, Download, Eye, ChevronRight, Activity, ChartBar as BarChart3, Users, Shield } from "lucide-react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";

const PersonalCenter = () => {
  const { applyRoleTheme } = useTheme();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "张三",
    email: "zhangsan@example.com", 
    phone: "138****8888",
    studentId: "AI2024001",
    joinDate: "2024年1月15日",
    avatar: "",
    level: "初级学员",
    rank: "前15%",
    totalPoints: 2350
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

  const dashboardStats = [
    {
      title: "学习进度",
      value: "68%",
      change: "+12%",
      trend: "up",
      icon: BookOpen,
      description: "本周进步明显"
    },
    {
      title: "累计学时",
      value: "125h",
      change: "+8h",
      trend: "up", 
      icon: Clock,
      description: "本周新增"
    },
    {
      title: "练习正确率",
      value: "87%",
      change: "+5%",
      trend: "up",
      icon: Target,
      description: "较上周提升"
    },
    {
      title: "排名",
      value: "15%",
      change: "+3%",
      trend: "up",
      icon: Trophy,
      description: "班级排名"
    }
  ];

  const recentActivities = [
    {
      type: "course",
      title: "完成了《深度学习基础》第5章",
      time: "2小时前",
      icon: BookOpen,
      status: "completed"
    },
    {
      type: "practice",
      title: "练习题正确率达到90%",
      time: "4小时前", 
      icon: Target,
      status: "achievement"
    },
    {
      type: "exam",
      title: "模拟考试得分85分",
      time: "1天前",
      icon: Award,
      status: "passed"
    },
    {
      type: "milestone",
      title: "获得学习达人徽章",
      time: "2天前",
      icon: Star,
      status: "milestone"
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "完成第6章视频学习",
      deadline: "2024-03-28",
      priority: "high",
      progress: 60
    },
    {
      id: 2,
      title: "提交实训作业：图像分类项目",
      deadline: "2024-03-30",
      priority: "medium",
      progress: 30
    },
    {
      id: 3,
      title: "参加AI训练师认证考试",
      deadline: "2024-04-05",
      priority: "high",
      progress: 0
    }
  ];

  const examRecords = [
    {
      id: 1,
      examName: "AI训练师模拟考试一",
      date: "2024-03-15",
      score: 85,
      status: "已通过",
      type: "模拟考试",
      duration: "120分钟"
    },
    {
      id: 2,
      examName: "深度学习章节测试",
      date: "2024-03-20", 
      score: 92,
      status: "已通过",
      type: "章节测试",
      duration: "60分钟"
    },
    {
      id: 3,
      examName: "AI训练师认证考试",
      date: "2024-04-05",
      score: null,
      status: "待参加",
      type: "正式考试",
      duration: "180分钟"
    }
  ];

  const certificates = [
    {
      id: 1,
      name: "人工智能基础认证",
      issuer: "智涌AI教育中心",
      issueDate: "2024-03-25",
      validUntil: "2027-03-25",
      status: "有效",
      level: "初级",
      credentialId: "CERT-AI-2024-001"
    }
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen;
      case 'practice': return Target;
      case 'exam': return Award;
      case 'milestone': return Star;
      default: return Activity;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-success-light';
      case 'achievement': return 'text-blue-600 bg-info-light';
      case 'passed': return 'text-orange-600 bg-warning-light';
      case 'milestone': return 'text-yellow-600 bg-warning-light';
      default: return 'text-gray-600 bg-muted';
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
            
            {/* 顶部横幅 */}
            <div className="bg-primary text-white rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 border-4 border-white/20">
                    <AvatarImage src={userInfo.avatar} />
                    <AvatarFallback className="text-2xl bg-white/20">
                      {userInfo.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{userInfo.name}</h1>
                    <div className="flex items-center gap-4 text-white/80">
                      <span>学号：{userInfo.studentId}</span>
                      <Separator orientation="vertical" className="h-4 bg-white/30" />
                      <span>{userInfo.level}</span>
                      <Separator orientation="vertical" className="h-4 bg-white/30" />
                      <span>加入时间：{userInfo.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-white/20 text-white border-white/30">
                        总积分：{userInfo.totalPoints}
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        班级排名：{userInfo.rank}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Settings className="h-4 w-4 mr-2" />
                  设置
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid bg-white/10 border-white/20">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 data-[state=active]:bg-white/20">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">仪表盘</span>
                </TabsTrigger>
                <TabsTrigger value="learning" className="flex items-center gap-2 data-[state=active]:bg-white/20">
                  <BookOpen className="h-4 w-4" />
                  <span className="hidden sm:inline">学习中心</span>
                </TabsTrigger>
                <TabsTrigger value="exams" className="flex items-center gap-2 data-[state=active]:bg-white/20">
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">考试记录</span>
                </TabsTrigger>
                <TabsTrigger value="certificates" className="flex items-center gap-2 data-[state=active]:bg-white/20">
                  <GraduationCap className="h-4 w-4" />
                  <span className="hidden sm:inline">我的证书</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white/20">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">个人资料</span>
                </TabsTrigger>
              </TabsList>

              {/* 仪表盘 */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {dashboardStats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm shadow-soft hover:shadow-medium transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">{stat.title}</p>
                              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                              <div className="flex items-center gap-1 text-sm">
                                <TrendingUp className="h-3 w-3 text-green-600" />
                                <span className="text-green-600">{stat.change}</span>
                                <span className="text-muted-foreground">{stat.description}</span>
                              </div>
                            </div>
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <IconComponent className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* 最近活动 */}
                  <Card className="lg:col-span-2 bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Activity className="h-5 w-5" />
                        最近活动
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">您的学习动态和成就记录</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentActivities.map((activity, index) => {
                          const IconComponent = getActivityIcon(activity.type);
                          return (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-white/20">
                              <div className={`p-2 rounded-lg ${getActivityColor(activity.status)}`}>
                                <IconComponent className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-foreground">{activity.title}</p>
                                <p className="text-sm text-muted-foreground">{activity.time}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 待办任务 */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Target className="h-5 w-5" />
                        待办任务
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">即将到期的学习任务</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {upcomingTasks.map((task) => (
                          <div key={task.id} className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-sm text-foreground">{task.title}</p>
                                <p className="text-xs text-muted-foreground">截止：{task.deadline}</p>
                  </div>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                              </Badge>
                  </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">进度</span>
                                <span className="text-foreground">{task.progress}%</span>
                  </div>
                              <Progress value={task.progress} className="h-2 bg-white/20" />
                  </div>
                </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4" size="sm">
                        查看全部任务
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 学习中心 */}
              <TabsContent value="learning" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* 学习进度 */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                    <CardHeader>
                      <CardTitle className="text-foreground">当前课程进度</CardTitle>
                      <CardDescription className="text-muted-foreground">生成式人工智能基础与应用</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-medium text-foreground">总体进度</span>
                          <span className="text-primary font-bold">68%</span>
                        </div>
                        <Progress value={68} className="h-3 bg-white/20" />
                </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">12</div>
                          <div className="text-sm text-blue-600">已完成章节</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg">
                          <div className="text-2xl font-bold text-orange-600">6</div>
                          <div className="text-sm text-orange-600">剩余章节</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">当前学习</span>
                          <span className="text-sm font-medium text-foreground">第13章 大模型微调技术</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">下一目标</span>
                          <span className="text-sm font-medium text-foreground">完成实训项目</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 学习统计 */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                    <CardHeader>
                      <CardTitle className="text-foreground">学习统计</CardTitle>
                      <CardDescription className="text-muted-foreground">本月学习数据概览</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-primary/5 rounded-lg">
                          <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold text-foreground">125h</div>
                          <div className="text-sm text-muted-foreground">累计学时</div>
                        </div>
                        <div className="text-center p-4 bg-success-light rounded-lg">
                          <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                          <div className="text-2xl font-bold text-foreground">87%</div>
                          <div className="text-sm text-muted-foreground">练习正确率</div>
                        </div>
                        <div className="text-center p-4 bg-info-light rounded-lg">
                          <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                          <div className="text-2xl font-bold text-foreground">156</div>
                          <div className="text-sm text-muted-foreground">完成练习</div>
                        </div>
                        <div className="text-center p-4 bg-warning-light rounded-lg">
                          <Trophy className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                          <div className="text-2xl font-bold text-foreground">15%</div>
                          <div className="text-sm text-muted-foreground">班级排名</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* 考试记录 */}
              <TabsContent value="exams" className="space-y-6">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Award className="h-5 w-5" />
                      考试记录
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">所有考试成绩和详细记录</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {examRecords.map((record) => (
                        <div key={record.id} className="p-4 border border-white/20 rounded-lg hover:bg-white/5 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-foreground">{record.examName}</h4>
                                <Badge variant="outline" className="border-white/20 text-foreground">
                                  {record.type}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {record.date}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  {record.duration}
                </div>
              </div>
            </div>

                            <div className="flex items-center gap-4">
                              {record.score && (
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">{record.score}</div>
                                  <div className="text-xs text-muted-foreground">分</div>
                                </div>
                              )}
                              
                              <div className="flex flex-col gap-2">
                                <Badge className={
                                  record.status === "已通过" 
                                    ? "bg-green-100 text-green-700" 
                                    : record.status === "待参加"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                                }>
                                  {record.status}
                                </Badge>
                                {record.score && (
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-3 w-3 mr-1" />
                                    详情
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 证书管理 */}
              <TabsContent value="certificates" className="space-y-6">
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <GraduationCap className="h-5 w-5" />
                      我的证书
                  </CardTitle>
                    <CardDescription className="text-muted-foreground">已获得的认证证书和资质</CardDescription>
                </CardHeader>
                  <CardContent>
                    {certificates.length > 0 ? (
                      <div className="space-y-4">
                        {certificates.map((cert) => (
                          <div key={cert.id} className="p-6 border border-white/20 rounded-lg bg-primary/5">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4">
                                <div className="p-3 bg-primary rounded-lg">
                                  <GraduationCap className="h-8 w-8 text-white" />
                                </div>
                                <div className="space-y-2">
                                  <h3 className="text-lg font-semibold text-foreground">{cert.name}</h3>
                                  <p className="text-sm text-muted-foreground">颁发机构：{cert.issuer}</p>
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">颁发日期：</span>
                                      <span className="font-medium text-foreground">{cert.issueDate}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">有效期至：</span>
                                      <span className="font-medium text-foreground">{cert.validUntil}</span>
                                    </div>
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    证书编号：{cert.credentialId}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex gap-2">
                                  <Badge>{cert.level}</Badge>
                                  <Badge className="bg-green-100 text-green-700">
                                    {cert.status}
                        </Badge>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-3 w-3 mr-1" />
                                    预览
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Download className="h-3 w-3 mr-1" />
                                    下载
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2 text-foreground">暂无证书</h3>
                        <p className="text-muted-foreground mb-6">
                          完成课程学习并通过考试后可获得认证证书
                        </p>
                        <Button>
                          去学习课程
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* 个人资料 */}
              <TabsContent value="profile" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* 基本信息 */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-foreground">基本信息</CardTitle>
                          <CardDescription className="text-muted-foreground">管理您的个人基本信息</CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          {isEditing ? '保存' : '编辑'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name" className="text-foreground">姓名</Label>
                          <Input
                            id="name"
                            value={userInfo.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                            className="bg-white/5 border-white/20"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="studentId" className="text-foreground">学号</Label>
                          <Input
                            id="studentId"
                            value={userInfo.studentId}
                            disabled
                            className="bg-white/5 border-white/20"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="email" className="text-foreground">邮箱</Label>
                          <Input
                            id="email"
                            type="email"
                            value={userInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={!isEditing}
                            className="bg-white/5 border-white/20"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="phone" className="text-foreground">手机号</Label>
                          <Input
                            id="phone"
                            value={userInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={!isEditing}
                            className="bg-white/5 border-white/20"
                          />
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2 pt-4">
                          <Button onClick={handleSave} size="sm">
                            保存更改
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                            取消
                          </Button>
                    </div>
                      )}
                </CardContent>
              </Card>

                  {/* 账户安全 */}
                  <Card className="bg-white/10 border-white/20 backdrop-blur-sm shadow-medium">
                <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Shield className="h-5 w-5" />
                        账户安全
                  </CardTitle>
                      <CardDescription className="text-muted-foreground">保护您的账户安全</CardDescription>
                </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">登录密码</p>
                            <p className="text-sm text-muted-foreground">建议定期更换密码</p>
                          </div>
                          <Button variant="outline" size="sm">修改</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">手机绑定</p>
                            <p className="text-sm text-muted-foreground">{userInfo.phone}</p>
                          </div>
                          <Button variant="outline" size="sm">更换</Button>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">邮箱绑定</p>
                            <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                          </div>
                          <Button variant="outline" size="sm">更换</Button>
                      </div>
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

export default PersonalCenter;