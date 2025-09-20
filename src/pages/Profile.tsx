import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Award, BookOpen, TrendingUp, Calendar, Mail, Phone, Edit3 } from "lucide-react";

export const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "张三",
    email: "zhangsan@example.com", 
    phone: "138****8888",
    studentId: "AI2024001",
    joinDate: "2024-01-15",
    avatar: ""
  });

  const learningProgress = {
    totalCourses: 1,
    completedCourses: 0,
    currentProgress: 65,
    studyHours: 125,
    certificates: 0
  };

  const examRecords = [
    {
      id: 1,
      examName: "AI训练师模拟考试一",
      date: "2024-03-15",
      score: 85,
      status: "通过",
      certificate: false
    },
    {
      id: 2,
      examName: "AI训练师模拟考试二", 
      date: "2024-03-20",
      score: 78,
      status: "通过",
      certificate: false
    },
    {
      id: 3,
      examName: "AI训练师正式考试",
      date: "待考试",
      score: null,
      status: "未参加",
      certificate: false
    }
  ];

  const certificates = [
    {
      id: 1,
      name: "人工智能基础认证",
      issueDate: "2024-03-25",
      validUntil: "2027-03-25",
      status: "有效",
      level: "初级"
    }
  ];

  const achievements = [
    { name: "初次登录", icon: "🎉", description: "首次登录系统", achieved: true },
    { name: "学习达人", icon: "📚", description: "累计学习100小时", achieved: true },
    { name: "练习之星", icon: "⭐", description: "完成1000道练习题", achieved: true },
    { name: "考试高手", icon: "🏆", description: "模拟考试平均分85+", achieved: true },
    { name: "证书获得者", icon: "🎓", description: "获得第一个认证证书", achieved: false },
    { name: "完美通关", icon: "💯", description: "正式考试95分以上", achieved: false }
  ];

  const handleSave = () => {
    setIsEditing(false);
    // 这里可以添加保存逻辑
  };

  const handleInputChange = (field: string, value: string) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background py-8">
      <div className="container mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            个人中心
          </h1>
          <p className="text-xl text-muted-foreground">
            管理个人信息，查看学习进度和考试成绩
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* 左侧用户信息卡片 */}
            <div className="lg:col-span-1">
              <Card className="shadow-medium sticky top-24">
                <CardHeader className="text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarImage src={userInfo.avatar} />
                    <AvatarFallback className="text-2xl gradient-primary text-white">
                      {userInfo.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{userInfo.name}</CardTitle>
                  <CardDescription>学号: {userInfo.studentId}</CardDescription>
                  <Badge className="bg-green-100 text-green-700">
                    活跃学员
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>加入时间: {userInfo.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>学习时长: {learningProgress.studyHours}小时</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>获得证书: {learningProgress.certificates}个</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 右侧主要内容 */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">概览</TabsTrigger>
                  <TabsTrigger value="exams">考试记录</TabsTrigger>
                  <TabsTrigger value="certificates">证书认证</TabsTrigger>
                  <TabsTrigger value="settings">个人设置</TabsTrigger>
                </TabsList>

                {/* 概览 */}
                <TabsContent value="overview" className="space-y-6">
                  {/* 学习进度统计 */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="shadow-soft">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <div className="text-2xl font-bold">{learningProgress.totalCourses}</div>
                          <div className="text-sm text-muted-foreground">报名课程</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-soft">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                          <div className="text-2xl font-bold">{learningProgress.currentProgress}%</div>
                          <div className="text-sm text-muted-foreground">当前进度</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-soft">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <Award className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                          <div className="text-2xl font-bold">{learningProgress.certificates}</div>
                          <div className="text-sm text-muted-foreground">获得证书</div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-soft">
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <User className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                          <div className="text-2xl font-bold">{learningProgress.studyHours}</div>
                          <div className="text-sm text-muted-foreground">学习时长(h)</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* 当前学习进度 */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>学习进度</CardTitle>
                      <CardDescription>生成式人工智能基础与应用课程</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span>总体进度</span>
                            <span>{learningProgress.currentProgress}%</span>
                          </div>
                          <Progress value={learningProgress.currentProgress} className="h-3" />
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">当前章节</div>
                            <div className="font-medium">第3章 深度学习原理</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">下一里程碑</div>
                            <div className="font-medium">完成第3章学习</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 成就徽章 */}
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>成就徽章</CardTitle>
                      <CardDescription>您的学习成就记录</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border text-center transition-all ${
                              achievement.achieved
                                ? 'bg-green-50 border-green-200 text-green-800'
                                : 'bg-gray-50 border-gray-200 text-gray-400'
                            }`}
                          >
                            <div className="text-2xl mb-2">{achievement.icon}</div>
                            <div className="font-medium text-sm">{achievement.name}</div>
                            <div className="text-xs mt-1">{achievement.description}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 考试记录 */}
                <TabsContent value="exams" className="space-y-6">
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>考试记录</CardTitle>
                      <CardDescription>您的所有考试记录和成绩</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {examRecords.map((record) => (
                          <div key={record.id} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{record.examName}</h4>
                                <div className="text-sm text-muted-foreground mt-1">
                                  考试时间: {record.date}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-4">
                                {record.score && (
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-primary">
                                      {record.score}分
                                    </div>
                                    <div className="text-xs text-muted-foreground">成绩</div>
                                  </div>
                                )}
                                
                                <Badge
                                  variant={record.status === "通过" ? "default" : "secondary"}
                                  className={
                                    record.status === "通过"
                                      ? "bg-green-100 text-green-700"
                                      : record.status === "未参加"
                                      ? "bg-gray-100 text-gray-700"
                                      : ""
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 证书认证 */}
                <TabsContent value="certificates" className="space-y-6">
                  <Card className="shadow-medium">
                    <CardHeader>
                      <CardTitle>证书认证</CardTitle>
                      <CardDescription>您已获得的认证证书</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {certificates.length > 0 ? (
                        <div className="space-y-4">
                          {certificates.map((cert) => (
                            <div key={cert.id} className="p-4 border rounded-lg bg-gradient-to-r from-primary/5 to-primary/10">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <div className="gradient-primary w-12 h-12 rounded-lg flex items-center justify-center">
                                    <Award className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{cert.name}</h4>
                                    <div className="text-sm text-muted-foreground">
                                      颁发日期: {cert.issueDate}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      有效期至: {cert.validUntil}
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <Badge className="mb-2">{cert.level}</Badge>
                                  <div>
                                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                                      {cert.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Award className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-medium mb-2">暂无证书</h3>
                          <p className="text-muted-foreground mb-4">
                            完成课程学习并通过考试后可获得认证证书
                          </p>
                          <Button onClick={() => window.location.href = '/courses'}>
                            去学习课程
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* 个人设置 */}
                <TabsContent value="settings" className="space-y-6">
                  <Card className="shadow-medium">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>个人信息</CardTitle>
                          <CardDescription>管理您的个人基本信息</CardDescription>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(!isEditing)}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          {isEditing ? '取消编辑' : '编辑信息'}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="name">姓名</Label>
                            <Input
                              id="name"
                              value={userInfo.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="email">邮箱</Label>
                            <Input
                              id="email"
                              type="email"
                              value={userInfo.email}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="phone">手机号</Label>
                            <Input
                              id="phone"
                              value={userInfo.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              disabled={!isEditing}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="studentId">学号</Label>
                            <Input
                              id="studentId"
                              value={userInfo.studentId}
                              disabled
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor="joinDate">加入时间</Label>
                            <Input
                              id="joinDate"
                              value={userInfo.joinDate}
                              disabled
                            />
                          </div>
                        </div>
                      </div>
                      
                      {isEditing && (
                        <div className="flex gap-2 mt-6">
                          <Button onClick={handleSave}>
                            保存更改
                          </Button>
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            取消
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};