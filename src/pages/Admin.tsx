import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { 
  Database, 
  Users, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload,
  BarChart3,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Activity,
  GraduationCap,
  Bell,
  Settings,
  Search,
  Filter,
  Shield,
  MessageSquare,
  Clipboard
} from "lucide-react";

export const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  // 模拟数据
  const dashboardStats = {
    totalUsers: 1250,
    activeUsers: 892,
    totalQuestions: 3500,
    totalExams: 156,
    todayExams: 12,
    passRate: 87.5
  };

  const recentUsers = [
    { id: 1, name: "张三", email: "zhangsan@example.com", joinDate: "2024-03-20", status: "active" },
    { id: 2, name: "李四", email: "lisi@example.com", joinDate: "2024-03-19", status: "active" },
    { id: 3, name: "王五", email: "wangwu@example.com", joinDate: "2024-03-18", status: "inactive" }
  ];

  const questionBanks = [
    { id: 1, name: "人工智能概述", category: "基础理论", questions: 150, difficulty: "初级" },
    { id: 2, name: "机器学习算法", category: "核心技术", questions: 300, difficulty: "中级" },
    { id: 3, name: "深度学习实践", category: "应用实战", questions: 250, difficulty: "高级" }
  ];

  const examSessions = [
    { id: 1, name: "AI训练师认证考试-2024年3月", date: "2024-03-25", participants: 85, status: "进行中" },
    { id: 2, name: "AI训练师模拟考试", date: "2024-03-20", participants: 120, status: "已结束" },
    { id: 3, name: "AI训练师补考", date: "2024-03-30", participants: 25, status: "未开始" }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-muted/20 to-background">
        {/* 左侧菜单 */}
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />

        {/* 右侧主要内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 顶部标题栏 */}
          <header className="bg-white border-b border-border shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-primary">
                    {getSectionTitle(activeSection)}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {getSectionDescription(activeSection)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  系统正常
                </Badge>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  通知
                </Button>
              </div>
            </div>
          </header>

          {/* 主内容区域 */}
          <main className="flex-1 overflow-auto admin-content">
            {renderContent(activeSection)}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );

  // 获取当前区域标题
  function getSectionTitle(section: string): string {
    const titles: Record<string, string> = {
      dashboard: "仪表盘",
      users: "用户管理",
      courses: "课程管理", 
      questions: "题库管理",
      exams: "考试管理",
      certificates: "证书管理",
      analytics: "数据统计",
      content: "内容管理",
      logs: "日志管理",
      settings: "系统设置",
      import: "批量导入",
      notifications: "通知管理",
      security: "安全管理",
      feedback: "反馈管理"
    };
    return titles[section] || "管理中心";
  }

  // 获取当前区域描述
  function getSectionDescription(section: string): string {
    const descriptions: Record<string, string> = {
      dashboard: "系统概览和核心数据统计",
      users: "学生和管理员账户管理",
      courses: "课程内容和学习材料管理",
      questions: "试题库和题目维护管理",
      exams: "考试场次安排和成绩管理",
      certificates: "认证证书颁发和管理",
      analytics: "学习数据分析和系统统计",
      content: "公告通知和内容发布管理",
      logs: "系统日志和操作记录查询",
      settings: "平台配置和系统参数设置",
      import: "批量导入用户和题目数据",
      notifications: "系统通知推送管理",
      security: "系统安全设置和权限管理",
      feedback: "用户反馈收集和处理"
    };
    return descriptions[section] || "智涌AI教育平台管理系统";
  }

  // 渲染主要内容
  function renderContent(section: string) {
    switch (section) {
      case "dashboard":
        return renderDashboard();
      case "users":
        return renderUsers();
      case "courses":
        return renderCourses();
      case "questions":
        return renderQuestions();
      case "exams":
        return renderExams();
      case "certificates":
        return renderCertificates();
      case "analytics":
        return renderAnalytics();
      case "content":
        return renderContentManagement();
      case "logs":
        return renderLogs();
      case "settings":
        return renderSettings();
      case "import":
        return renderImport();
      case "notifications":
        return renderNotifications();
      case "security":
        return renderSecurity();
      case "feedback":
        return renderFeedback();
      default:
        return renderDashboard();
    }
  }

  // 渲染仪表盘
  function renderDashboard() {
    return (
      <div className="space-y-6">
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">总用户数</p>
                  <p className="text-2xl font-bold text-primary">{dashboardStats.totalUsers}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+12.5%</span>
                    <span className="text-muted-foreground ml-1">本月</span>
                  </div>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">活跃用户</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.activeUsers}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+8.3%</span>
                    <span className="text-muted-foreground ml-1">本周</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">题库总数</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalQuestions}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+156</span>
                    <span className="text-muted-foreground ml-1">本周新增</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">考试通过率</p>
                  <p className="text-2xl font-bold text-purple-600">{dashboardStats.passRate}%</p>
                  <div className="flex items-center text-sm text-purple-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+2.1%</span>
                    <span className="text-muted-foreground ml-1">较上月</span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 近期用户注册 */}
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    近期用户注册
                  </CardTitle>
                  <CardDescription>最近7天新注册用户</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  查看全部
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? '活跃' : '待激活'}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{user.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 今日考试安排 */}
          <Card className="shadow-medium">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    今日考试安排
                  </CardTitle>
                  <CardDescription>今天共 {dashboardStats.todayExams} 场考试</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  管理考试
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-900">AI训练师认证考试</h4>
                        <p className="text-sm text-blue-700">上午 9:00 - 11:00</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-blue-600 text-white">35人参考</Badge>
                      <p className="text-xs text-blue-700 mt-1">进行中</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-900">模拟考试练习</h4>
                        <p className="text-sm text-green-700">下午 2:00 - 4:00</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-600 text-white">28人参考</Badge>
                      <p className="text-xs text-green-700 mt-1">准备中</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 系统状态监控 */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              系统状态监控
            </CardTitle>
            <CardDescription>实时系统运行状态和性能指标</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>服务器负载</span>
                  <span className="text-green-600">正常</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">CPU使用率: 35%</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>内存使用</span>
                  <span className="text-yellow-600">良好</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">内存使用率: 65%</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>数据库连接</span>
                  <span className="text-green-600">稳定</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-muted-foreground">连接池: 25/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 其他功能模块的渲染函数
  function renderUsers() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索用户..." className="w-64" />
            </div>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出数据
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              添加用户
            </Button>
          </div>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户信息</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead>学习进度</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">65%</div>
                        <div className="w-16 bg-gray-200 rounded-full h-1">
                          <div className="bg-primary h-1 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? '活跃' : '非活跃'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          查看
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderCourses() {
    const courses = [
      { id: 1, name: "生成式人工智能基础与应用", category: "AI基础", status: "已发布", students: 156, chapters: 18, createDate: "2024-01-15" },
      { id: 2, name: "机器学习实战训练", category: "机器学习", status: "草稿", students: 0, chapters: 12, createDate: "2024-03-10" },
      { id: 3, name: "深度学习原理与实践", category: "深度学习", status: "已发布", students: 89, chapters: 15, createDate: "2024-02-20" }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索课程..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              导入课程
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新建课程
            </Button>
          </div>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>课程信息</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>学生数</TableHead>
                  <TableHead>章节数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{course.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {course.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{course.category}</TableCell>
                    <TableCell>{course.students}人</TableCell>
                    <TableCell>{course.chapters}章</TableCell>
                    <TableCell>
                      <Badge variant={course.status === '已发布' ? 'default' : 'secondary'}>
                        {course.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{course.createDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          预览
                        </Button>
                        <Button size="sm" variant="outline">
                          设置
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderQuestions() {
    const questionStats = [
      { category: "AI基础理论", total: 458, easy: 180, medium: 205, hard: 73 },
      { category: "机器学习", total: 332, easy: 125, medium: 142, hard: 65 },
      { category: "深度学习", total: 289, easy: 98, medium: 134, hard: 57 },
      { category: "实践应用", total: 216, easy: 89, medium: 92, hard: 35 }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索题目..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="ai-basic">AI基础理论</SelectItem>
                <SelectItem value="ml">机器学习</SelectItem>
                <SelectItem value="dl">深度学习</SelectItem>
                <SelectItem value="practice">实践应用</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="难度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部难度</SelectItem>
                <SelectItem value="easy">简单</SelectItem>
                <SelectItem value="medium">中等</SelectItem>
                <SelectItem value="hard">困难</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              批量导入
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出题库
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新增题目
            </Button>
          </div>
        </div>

        {/* 题库统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {questionStats.map((stat, index) => (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{stat.category}</h3>
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">{stat.total}</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-green-600">
                      <div className="font-medium">{stat.easy}</div>
                      <div>简单</div>
                    </div>
                    <div className="text-yellow-600">
                      <div className="font-medium">{stat.medium}</div>
                      <div>中等</div>
                    </div>
                    <div className="text-red-600">
                      <div className="font-medium">{stat.hard}</div>
                      <div>困难</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>题目信息</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>难度</TableHead>
                  <TableHead>题型</TableHead>
                  <TableHead>使用次数</TableHead>
                  <TableHead>正确率</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionBanks.map((bank) => (
                  <TableRow key={bank.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{bank.name}</p>
                        <p className="text-sm text-muted-foreground">{bank.questions} 道题目</p>
                      </div>
                    </TableCell>
                    <TableCell>{bank.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        bank.difficulty === '初级' ? 'text-green-600 border-green-200' :
                        bank.difficulty === '中级' ? 'text-yellow-600 border-yellow-200' :
                        'text-red-600 border-red-200'
                      }>
                        {bank.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>选择题</TableCell>
                    <TableCell>156次</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">78%</span>
                        <div className="w-12 bg-gray-200 rounded-full h-1">
                          <div className="bg-green-600 h-1 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          预览
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderExams() {
    const examStats = [
      { name: "今日考试", value: 12, icon: Calendar, color: "blue" },
      { name: "本周考试", value: 45, icon: Calendar, color: "green" },
      { name: "总考试场次", value: 234, icon: Award, color: "purple" },
      { name: "平均通过率", value: "87.5%", icon: TrendingUp, color: "orange" }
    ];

    return (
      <div className="space-y-6">
        {/* 考试统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {examStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.name}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                      <IconComponent className={`h-5 w-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索考试..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="ongoing">进行中</SelectItem>
                <SelectItem value="finished">已结束</SelectItem>
                <SelectItem value="pending">未开始</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="formal">正式考试</SelectItem>
                <SelectItem value="mock">模拟考试</SelectItem>
                <SelectItem value="practice">练习测试</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出成绩
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              创建考试
            </Button>
          </div>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>考试信息</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>时间安排</TableHead>
                  <TableHead>参考人数</TableHead>
                  <TableHead>平均分</TableHead>
                  <TableHead>通过率</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examSessions.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{exam.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {exam.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">认证考试</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{exam.date}</div>
                        <div className="text-muted-foreground">9:00-11:00</div>
                      </div>
                    </TableCell>
                    <TableCell>{exam.participants}人</TableCell>
                    <TableCell>
                      <span className="font-medium">85.6分</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">87%</span>
                        <div className="w-12 bg-gray-200 rounded-full h-1">
                          <div className="bg-green-600 h-1 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          exam.status === '进行中' ? 'default' :
                          exam.status === '已结束' ? 'secondary' : 'outline'
                        }
                      >
                        {exam.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          详情
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          监控
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderCertificates() {
    const certificateStats = [
      { name: "已颁发证书", value: 89, icon: Award, color: "green" },
      { name: "待审核", value: 12, icon: GraduationCap, color: "yellow" },
      { name: "有效证书", value: 76, icon: Shield, color: "blue" },
      { name: "即将过期", value: 8, icon: Calendar, color: "red" }
    ];

    const certificates = [
      { id: 1, name: "AI训练师初级认证", recipient: "张三", issueDate: "2024-03-15", validUntil: "2027-03-15", status: "有效" },
      { id: 2, name: "AI训练师中级认证", recipient: "李四", issueDate: "2024-03-10", validUntil: "2027-03-10", status: "有效" },
      { id: 3, name: "AI训练师高级认证", recipient: "王五", issueDate: "2024-02-28", validUntil: "2027-02-28", status: "待审核" }
    ];

    return (
      <div className="space-y-6">
        {/* 证书统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {certificateStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="shadow-soft">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.name}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                      <IconComponent className={`h-5 w-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索证书..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="valid">有效</SelectItem>
                <SelectItem value="pending">待审核</SelectItem>
                <SelectItem value="expired">已过期</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              批量导出
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              颁发证书
            </Button>
          </div>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>证书信息</TableHead>
                  <TableHead>获得者</TableHead>
                  <TableHead>颁发日期</TableHead>
                  <TableHead>有效期至</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-primary to-secondary rounded-lg">
                          <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{cert.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {cert.id}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{cert.recipient}</TableCell>
                    <TableCell>{cert.issueDate}</TableCell>
                    <TableCell>{cert.validUntil}</TableCell>
                    <TableCell>
                      <Badge variant={cert.status === '有效' ? 'default' : 'secondary'}>
                        {cert.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          预览
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          撤销
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderAnalytics() {
    const analyticsData = {
      userGrowth: [
        { month: "1月", users: 156, active: 89 },
        { month: "2月", users: 234, active: 145 },
        { month: "3月", users: 389, active: 234 },
        { month: "4月", users: 445, active: 298 },
        { month: "5月", users: 567, active: 389 },
        { month: "6月", users: 678, active: 456 }
      ],
      examData: [
        { name: "理论考试通过率", value: 87.5, trend: "+5.2%" },
        { name: "实践考试通过率", value: 82.3, trend: "+3.8%" },
        { name: "平均学习时长", value: 125, unit: "小时", trend: "+12h" },
        { name: "平均完成率", value: 78.9, trend: "+7.1%" }
      ]
    };

    return (
      <div className="space-y-6">
        {/* 关键指标 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {analyticsData.examData.map((item, index) => (
            <Card key={index} className="shadow-soft">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">
                    {item.value}{item.unit && item.unit}
                    {!item.unit && item.name.includes('率') && '%'}
                  </div>
                  <div className="text-sm text-green-600">
                    {item.trend} 较上月
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 用户增长趋势 */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>用户增长趋势</CardTitle>
              <CardDescription>过去6个月用户注册和活跃情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userGrowth.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-primary rounded"></div>
                      <div>
                        <p className="font-medium">{data.month}</p>
                        <p className="text-sm text-muted-foreground">总用户: {data.users}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{data.active}</p>
                      <p className="text-sm text-muted-foreground">活跃用户</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 学习效果分析 */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>学习效果分析</CardTitle>
              <CardDescription>各课程模块学习效果统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI基础理论</span>
                    <span>85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>机器学习实践</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>深度学习原理</span>
                    <span>82%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>实际应用项目</span>
                    <span>76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 详细统计表格 */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>详细数据统计</CardTitle>
            <CardDescription>各项指标的详细统计数据</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>指标名称</TableHead>
                  <TableHead>当前值</TableHead>
                  <TableHead>上月值</TableHead>
                  <TableHead>变化趋势</TableHead>
                  <TableHead>达标状态</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>新用户注册</TableCell>
                  <TableCell>156人</TableCell>
                  <TableCell>142人</TableCell>
                  <TableCell className="text-green-600">+9.8%</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-700">达标</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>课程完成率</TableCell>
                  <TableCell>78.5%</TableCell>
                  <TableCell>75.2%</TableCell>
                  <TableCell className="text-green-600">+3.3%</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-700">达标</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>考试通过率</TableCell>
                  <TableCell>85.2%</TableCell>
                  <TableCell>83.1%</TableCell>
                  <TableCell className="text-green-600">+2.1%</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-700">达标</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>用户满意度</TableCell>
                  <TableCell>4.6/5</TableCell>
                  <TableCell>4.5/5</TableCell>
                  <TableCell className="text-green-600">+0.1</TableCell>
                  <TableCell><Badge className="bg-green-100 text-green-700">优秀</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderContentManagement() {
    const announcements = [
      { id: 1, title: "系统维护通知", content: "系统将于2024年3月30日进行维护", status: "已发布", createDate: "2024-03-25" },
      { id: 2, title: "新课程上线公告", content: "《深度学习实战》课程正式上线", status: "草稿", createDate: "2024-03-24" },
      { id: 3, title: "考试安排通知", content: "4月份AI训练师认证考试安排", status: "已发布", createDate: "2024-03-23" }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索内容..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="announcement">公告</SelectItem>
                <SelectItem value="news">新闻</SelectItem>
                <SelectItem value="notice">通知</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            发布内容
          </Button>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>内容摘要</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground">{item.content}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === '已发布' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.createDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          预览
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderLogs() {
    const logs = [
      { id: 1, type: "用户操作", user: "张三", action: "登录系统", time: "2024-03-25 14:30:25", ip: "192.168.1.100", result: "成功" },
      { id: 2, type: "管理操作", user: "管理员", action: "创建考试", time: "2024-03-25 14:25:18", ip: "192.168.1.50", result: "成功" },
      { id: 3, type: "系统事件", user: "系统", action: "自动备份", time: "2024-03-25 14:20:00", ip: "-", result: "成功" },
      { id: 4, type: "安全事件", user: "李四", action: "密码错误", time: "2024-03-25 14:15:32", ip: "192.168.1.120", result: "失败" }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索日志..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="user">用户操作</SelectItem>
                <SelectItem value="admin">管理操作</SelectItem>
                <SelectItem value="system">系统事件</SelectItem>
                <SelectItem value="security">安全事件</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="结果" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="success">成功</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              导出日志
            </Button>
            <Button variant="outline">
              清理日志
            </Button>
          </div>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>类型</TableHead>
                  <TableHead>用户</TableHead>
                  <TableHead>操作</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>IP地址</TableHead>
                  <TableHead>结果</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline" className={
                        log.type === '安全事件' ? 'text-red-600 border-red-200' :
                        log.type === '管理操作' ? 'text-blue-600 border-blue-200' :
                        log.type === '系统事件' ? 'text-purple-600 border-purple-200' :
                        'text-green-600 border-green-200'
                      }>
                        {log.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell className="text-sm">{log.time}</TableCell>
                    <TableCell className="text-sm">{log.ip}</TableCell>
                    <TableCell>
                      <Badge variant={log.result === '成功' ? 'default' : 'destructive'}>
                        {log.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderSettings() {
    const systemSettings = [
      { category: "基本设置", items: [
        { name: "系统名称", value: "智涌AI教育平台", type: "text" },
        { name: "管理员邮箱", value: "admin@example.com", type: "email" },
        { name: "系统时区", value: "Asia/Shanghai", type: "select" }
      ]},
      { category: "安全设置", items: [
        { name: "密码最小长度", value: "8", type: "number" },
        { name: "登录失败锁定次数", value: "5", type: "number" },
        { name: "会话超时时间(分钟)", value: "30", type: "number" }
      ]},
      { category: "考试设置", items: [
        { name: "考试默认时长(分钟)", value: "120", type: "number" },
        { name: "自动提交剩余时间(分钟)", value: "5", type: "number" },
        { name: "允许重考次数", value: "3", type: "number" }
      ]}
    ];

    return (
      <div className="space-y-6">
        {systemSettings.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="shadow-medium">
            <CardHeader>
              <CardTitle>{section.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input 
                        type={item.type === 'number' ? 'number' : 'text'}
                        value={item.value} 
                        className="w-48" 
                        readOnly
                      />
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>系统维护</CardTitle>
            <CardDescription>系统维护和备份操作</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Database className="h-5 w-5" />
                <span>数据备份</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Activity className="h-5 w-5" />
                <span>清理缓存</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Settings className="h-5 w-5" />
                <span>重启服务</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderImport() {
    const importTypes = [
      { name: "用户数据", description: "批量导入学生用户信息", icon: Users, format: "Excel (.xlsx)" },
      { name: "题库数据", description: "批量导入考试题目", icon: Database, format: "Excel (.xlsx)" },
      { name: "课程内容", description: "批量导入课程资料", icon: BookOpen, format: "ZIP压缩包" },
      { name: "成绩数据", description: "批量导入考试成绩", icon: Award, format: "Excel (.xlsx)" }
    ];

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {importTypes.map((type, index) => {
            const IconComponent = type.icon;
            return (
              <Card key={index} className="shadow-soft hover:shadow-medium transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="p-3 bg-primary/10 rounded-lg w-fit mx-auto">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{type.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                      <p className="text-xs text-muted-foreground mt-2">支持格式: {type.format}</p>
                    </div>
                    <Button className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      选择文件
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>导入历史</CardTitle>
            <CardDescription>查看最近的批量导入记录</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>导入类型</TableHead>
                  <TableHead>文件名</TableHead>
                  <TableHead>导入时间</TableHead>
                  <TableHead>成功数量</TableHead>
                  <TableHead>失败数量</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>用户数据</TableCell>
                  <TableCell>students_2024_03.xlsx</TableCell>
                  <TableCell>2024-03-25 14:30</TableCell>
                  <TableCell>156</TableCell>
                  <TableCell>3</TableCell>
                  <TableCell><Badge>完成</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>题库数据</TableCell>
                  <TableCell>ai_questions.xlsx</TableCell>
                  <TableCell>2024-03-24 16:20</TableCell>
                  <TableCell>89</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell><Badge>完成</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderNotifications() {
    const notifications = [
      { id: 1, title: "系统升级通知", content: "平台将于本周末进行系统升级", type: "系统通知", target: "全体用户", status: "已发送", sendTime: "2024-03-25 10:00" },
      { id: 2, title: "考试提醒", content: "AI训练师认证考试将于明天开始", type: "考试通知", target: "考试学员", status: "定时发送", sendTime: "2024-03-26 08:00" },
      { id: 3, title: "新课程上线", content: "《深度学习实战》课程正式发布", type: "课程通知", target: "全体用户", status: "草稿", sendTime: "-" }
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索通知..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="system">系统通知</SelectItem>
                <SelectItem value="exam">考试通知</SelectItem>
                <SelectItem value="course">课程通知</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新建通知
          </Button>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>标题</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>目标用户</TableHead>
                  <TableHead>发送时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notif) => (
                  <TableRow key={notif.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{notif.title}</p>
                        <p className="text-sm text-muted-foreground">{notif.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{notif.type}</Badge>
                    </TableCell>
                    <TableCell>{notif.target}</TableCell>
                    <TableCell>{notif.sendTime}</TableCell>
                    <TableCell>
                      <Badge variant={
                        notif.status === '已发送' ? 'default' :
                        notif.status === '定时发送' ? 'secondary' : 'outline'
                      }>
                        {notif.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          发送
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderSecurity() {
    const securityEvents = [
      { type: "登录异常", user: "张三", description: "异地登录检测", time: "2024-03-25 14:30", risk: "中" },
      { type: "密码攻击", user: "未知", description: "暴力破解尝试", time: "2024-03-25 14:25", risk: "高" },
      { type: "权限异常", user: "李四", description: "尝试访问未授权页面", time: "2024-03-25 14:20", risk: "低" }
    ];

    return (
      <div className="space-y-6">
        {/* 安全概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">安全等级</p>
                  <p className="text-2xl font-bold text-green-600">良好</p>
                </div>
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">风险事件</p>
                  <p className="text-2xl font-bold text-yellow-600">3</p>
                </div>
                <Bell className="h-5 w-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">在线用户</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">系统状态</p>
                  <p className="text-2xl font-bold text-green-600">正常</p>
                </div>
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle>安全事件</CardTitle>
            <CardDescription>最近的安全事件和风险提醒</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>事件类型</TableHead>
                  <TableHead>相关用户</TableHead>
                  <TableHead>事件描述</TableHead>
                  <TableHead>发生时间</TableHead>
                  <TableHead>风险等级</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{event.user}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>
                      <Badge variant={
                        event.risk === '高' ? 'destructive' :
                        event.risk === '中' ? 'secondary' : 'outline'
                      }>
                        {event.risk}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        处理
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  function renderFeedback() {
    const feedbacks = [
      { id: 1, user: "张三", type: "功能建议", title: "希望增加移动端支持", content: "建议开发手机APP版本", status: "待处理", time: "2024-03-25", rating: 4 },
      { id: 2, user: "李四", type: "问题反馈", title: "视频播放卡顿", content: "课程视频经常卡顿，影响学习体验", status: "处理中", time: "2024-03-24", rating: 2 },
      { id: 3, user: "王五", type: "使用体验", title: "界面很友好", content: "整体使用体验不错，界面设计很棒", status: "已完成", time: "2024-03-23", rating: 5 }
    ];

    return (
      <div className="space-y-6">
        {/* 反馈统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">总反馈数</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">待处理</p>
                  <p className="text-2xl font-bold text-red-600">12</p>
                </div>
                <Clipboard className="h-5 w-5 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">平均评分</p>
                  <p className="text-2xl font-bold text-green-600">4.2</p>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-soft">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">处理率</p>
                  <p className="text-2xl font-bold">92%</p>
                </div>
                <Award className="h-5 w-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索反馈..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
                <SelectItem value="suggestion">功能建议</SelectItem>
                <SelectItem value="bug">问题反馈</SelectItem>
                <SelectItem value="experience">使用体验</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出反馈
          </Button>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>标题</TableHead>
                  <TableHead>评分</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.id}>
                    <TableCell>{feedback.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{feedback.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{feedback.title}</p>
                        <p className="text-sm text-muted-foreground">{feedback.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < feedback.rating ? "text-yellow-400" : "text-gray-300"}>
                            ★
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{feedback.time}</TableCell>
                    <TableCell>
                      <Badge variant={
                        feedback.status === '已完成' ? 'default' :
                        feedback.status === '处理中' ? 'secondary' : 'outline'
                      }>
                        {feedback.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          查看
                        </Button>
                        <Button size="sm" variant="outline">
                          回复
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
};