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
  Filter
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
          <main className="flex-1 overflow-auto p-6">
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
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">课程管理</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderQuestions() {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Input placeholder="搜索题目..." className="w-64" />
            <Select>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="难度" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部</SelectItem>
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
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              新增题目
            </Button>
          </div>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>题目信息</TableHead>
                  <TableHead>分类</TableHead>
                  <TableHead>难度</TableHead>
                  <TableHead>使用次数</TableHead>
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
                      <Badge variant="outline">{bank.difficulty}</Badge>
                    </TableCell>
                    <TableCell>156次</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
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
    return (
      <div className="space-y-6">
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
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            创建考试
          </Button>
        </div>

        <Card className="shadow-medium">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>考试名称</TableHead>
                  <TableHead>考试时间</TableHead>
                  <TableHead>参考人数</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {examSessions.map((exam) => (
                  <TableRow key={exam.id}>
                    <TableCell className="font-medium">{exam.name}</TableCell>
                    <TableCell>{exam.date}</TableCell>
                    <TableCell>{exam.participants}人</TableCell>
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
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">证书管理</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderAnalytics() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">数据统计</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderContentManagement() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">内容管理</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderLogs() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">日志管理</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">系统设置</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderImport() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Upload className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">批量导入</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderNotifications() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">通知管理</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderSecurity() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">安全管理</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }

  function renderFeedback() {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">反馈管理</h3>
          <p className="text-muted-foreground">此功能正在开发中...</p>
        </div>
      </div>
    );
  }
};