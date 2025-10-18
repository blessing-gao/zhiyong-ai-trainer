import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import UserManagement from "@/components/UserManagement";
import QuestionBankManagement from "@/components/QuestionBankManagement";
import PaperManagement from "@/components/PaperManagement";
import ExamManagement from "@/components/ExamManagement";
import { 
  LayoutDashboard, 
  GraduationCap, 
  FileText, 
  MessageSquare, 
  BookOpen,
  Search,
  Plus,
  TrendingUp,
  Users,
  BarChart3,
  ChevronRight,
  Settings,
  Database,
  Award,
  Calendar,
  Activity,
  Bell,
  Download,
  Upload,
  Edit,
  Trash2,
  Shield,
  Clipboard,
  Filter,
  Menu
} from "lucide-react";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  const sidebarItems = [
    { id: "Dashboard", label: "仪表盘", icon: LayoutDashboard },
    { id: "Users", label: "用户管理", icon: Users },
    { id: "Courses", label: "课程管理", icon: GraduationCap },
    { id: "QuestionBank", label: "题库管理", icon: FileText },
    { id: "Papers", label: "试卷管理", icon: FileText },
    { id: "Exams", label: "考试管理", icon: FileText },
    { id: "Certificates", label: "证书管理", icon: FileText },
    { id: "Analytics", label: "数据统计", icon: BarChart3 },
    { id: "Content", label: "内容管理", icon: BookOpen },
    { id: "Logs", label: "日志管理", icon: FileText },
    { id: "Settings", label: "系统设置", icon: Settings },
  ];

  // 仪表盘统计数据
  const dashboardStats = {
    totalUsers: 1250,
    activeUsers: 892,
    totalQuestions: 3500,
    totalExams: 156,
    todayExams: 12,
    passRate: 87.5
  };

  const courseItems = [
    { title: "生成式人工智能基础与应用", price: "¥299", students: 1250, growth: "+78%", color: "from-blue-400 to-cyan-300" },
    { title: "机器学习进阶", price: "¥499", students: 856, growth: "-13%", color: "from-purple-400 to-pink-300" },
    { title: "深度学习实战", price: "¥699", students: 1089, growth: "+78%", color: "from-pink-400 to-rose-300" },
    { title: "自然语言处理", price: "¥599", students: 924, growth: "+78%", color: "from-indigo-400 to-blue-300" },
  ];

  const trendingStudents = [
    { name: "张三", value: "¥8,500", type: "总学时" },
    { name: "李四", value: "¥6,200", type: "总学时" },
  ];

  const recentMessages = [
    { name: "王老师", message: "关于课程安排的讨论", time: "10:15" },
    { name: "刘同学", message: "考试时间确认", time: "10:27" },
  ];

  // 获取当前区域标题
  function getSectionTitle(section: string): string {
    const titles: Record<string, string> = {
      Dashboard: "仪表盘",
      Users: "用户管理",
      Courses: "课程管理",
      QuestionBank: "题库管理",
      Papers: "试卷管理",
      Exams: "考试管理",
      Certificates: "证书管理",
      Analytics: "数据统计",
      Content: "内容管理",
      Logs: "日志管理",
      Settings: "系统设置"
    };
    return titles[section] || "管理中心";
  }

  // 获取当前区域描述
  function getSectionDescription(section: string): string {
    const descriptions: Record<string, string> = {
      Dashboard: "系统概览和核心数据统计",
      Users: "学生和管理员账户管理",
      Courses: "课程内容和学习材料管理",
      QuestionBank: "试题库和题目维护管理",
      Papers: "试卷创建、编辑和发布管理",
      Exams: "考试场次安排和成绩管理",
      Certificates: "认证证书颁发和管理",
      Analytics: "学习数据分析和系统统计",
      Content: "公告通知和内容发布管理",
      Logs: "系统日志和操作记录查询",
      Settings: "平台配置和系统参数设置"
    };
    return descriptions[section] || "智涌AI教育平台管理系统";
  }

  // 获取当前区域图标
  function getSectionIcon(section: string) {
    const icons: Record<string, any> = {
      Dashboard: <LayoutDashboard className="h-5 w-5 text-white" />,
      Users: <Users className="h-5 w-5 text-white" />,
      Courses: <GraduationCap className="h-5 w-5 text-white" />,
      QuestionBank: <FileText className="h-5 w-5 text-white" />,
      Papers: <FileText className="h-5 w-5 text-white" />,
      Exams: <FileText className="h-5 w-5 text-white" />,
      Certificates: <Award className="h-5 w-5 text-white" />,
      Analytics: <BarChart3 className="h-5 w-5 text-white" />,
      Content: <BookOpen className="h-5 w-5 text-white" />,
      Logs: <FileText className="h-5 w-5 text-white" />,
      Settings: <Settings className="h-5 w-5 text-white" />
    };
    return icons[section] || <LayoutDashboard className="h-5 w-5 text-white" />;
  }

  // 渲染主要内容
  function renderContent(section: string) {
    switch (section) {
      case "Dashboard":
        return renderDashboard();
      case "Users":
        return <UserManagement />;
      case "Courses":
        return renderCourses();
      case "QuestionBank":
        return renderQuestions();
      case "Papers":
        return renderPapers();
      case "Exams":
        return renderExams();
      case "Certificates":
        return renderCertificates();
      case "Analytics":
        return renderAnalytics();
      case "Content":
        return renderContentManagement();
      case "Logs":
        return renderLogs();
      case "Settings":
        return renderSettings();
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
          <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">总用户数</p>
                  <p className="text-2xl font-bold text-gray-700">{dashboardStats.totalUsers}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+12.5%</span>
                    <span className="text-gray-400 ml-1">本月</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">活跃用户</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.activeUsers}</p>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+8.3%</span>
                    <span className="text-gray-400 ml-1">本周</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">题库总数</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalQuestions}</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+156</span>
                    <span className="text-gray-400 ml-1">本周新增</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">考试通过率</p>
                  <p className="text-2xl font-bold text-blue-600">{dashboardStats.passRate}%</p>
                  <div className="flex items-center text-sm text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+2.1%</span>
                    <span className="text-gray-400 ml-1">较上月</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 近期用户注册 */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
            <div>
                  <CardTitle className="text-gray-700 flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    近期用户注册
                  </CardTitle>
                  <p className="text-sm text-gray-500">最近7天新注册用户</p>
            </div>
                <Button variant="outline" size="sm">
                  查看全部
                </Button>
          </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 1, name: "张三", email: "zhangsan@example.com", joinDate: "2024-03-20", status: "active" },
                  { id: 2, name: "李四", email: "lisi@example.com", joinDate: "2024-03-19", status: "active" },
                  { id: 3, name: "王五", email: "wangwu@example.com", joinDate: "2024-03-18", status: "inactive" }
                ].map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
        </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                        {user.status === 'active' ? '活跃' : '待激活'}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{user.joinDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 今日考试安排 */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-700 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    今日考试安排
                  </CardTitle>
                  <p className="text-sm text-gray-500">今天共 {dashboardStats.todayExams} 场考试</p>
                </div>
                <Button variant="outline" size="sm">
                  管理考试
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-100 rounded-lg border border-blue-200">
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

                <div className="p-4 bg-green-100 rounded-lg border border-green-200">
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
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              系统状态监控
            </CardTitle>
            <p className="text-sm text-gray-500">实时系统运行状态和性能指标</p>
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
                <p className="text-xs text-gray-500">CPU使用率: 35%</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>内存使用</span>
                  <span className="text-yellow-600">良好</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-gray-500">内存使用率: 65%</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>数据库连接</span>
                  <span className="text-green-600">稳定</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                <p className="text-xs text-gray-500">连接池: 25/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 渲染课程管理
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
            <select className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>全部</option>
              <option>已发布</option>
              <option>草稿</option>
            </select>
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

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">课程信息</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">分类</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">学生数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">章节数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{course.name}</p>
                            <p className="text-sm text-gray-500">ID: {course.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{course.category}</td>
                      <td className="px-6 py-4">{course.students}人</td>
                      <td className="px-6 py-4">{course.chapters}章</td>
                      <td className="px-6 py-4">
                        <Badge variant={course.status === '已发布' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{course.createDate}</td>
                      <td className="px-6 py-4">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 渲染题库管理
  function renderQuestions() {
    return <QuestionBankManagement />;
  }

  // 渲染试卷管理
  function renderPapers() {
    return <PaperManagement />;
  }

  // 渲染考试管理
  function renderExams() {
    return <ExamManagement />;
  }

  // 渲染证书管理
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
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{stat.name}</p>
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
            <select className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>全部</option>
              <option>有效</option>
              <option>待审核</option>
              <option>已过期</option>
            </select>
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

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
                    <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">证书信息</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">获得者</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">颁发日期</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">有效期至</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {certificates.map((cert) => (
                    <tr key={cert.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-600 rounded-lg">
                            <GraduationCap className="h-4 w-4 text-white" />
                      </div>
                          <div>
                            <p className="font-medium">{cert.name}</p>
                            <p className="text-sm text-gray-500">ID: {cert.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{cert.recipient}</td>
                      <td className="px-6 py-4">{cert.issueDate}</td>
                      <td className="px-6 py-4">{cert.validUntil}</td>
                      <td className="px-6 py-4">
                        <Badge variant={cert.status === '有效' ? 'default' : 'secondary'}>
                          {cert.status}
                          </Badge>
                      </td>
                      <td className="px-6 py-4">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
                      </div>
                    </CardContent>
                  </Card>
              </div>
    );
  }

  // 渲染数据统计
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
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{item.name}</p>
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
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
              <CardHeader>
              <CardTitle className="text-gray-700">用户增长趋势</CardTitle>
              <p className="text-sm text-gray-500">过去6个月用户注册和活跃情况</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userGrowth.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 bg-blue-600 rounded"></div>
                      <div>
                        <p className="font-medium">{data.month}</p>
                        <p className="text-sm text-gray-500">总用户: {data.users}</p>
                  </div>
                </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">{data.active}</p>
                      <p className="text-sm text-gray-500">活跃用户</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 学习效果分析 */}
          <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700">学习效果分析</CardTitle>
              <p className="text-sm text-gray-500">各课程模块学习效果统计</p>
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
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>实际应用项目</span>
                    <span>76%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* 详细统计表格 */}
            <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
              <CardHeader>
            <CardTitle className="text-gray-700">详细数据统计</CardTitle>
            <p className="text-sm text-gray-500">各项指标的详细统计数据</p>
              </CardHeader>
              <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">指标名称</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">当前值</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">上月值</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">变化趋势</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">达标状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4">新用户注册</td>
                    <td className="px-6 py-4">156人</td>
                    <td className="px-6 py-4">142人</td>
                    <td className="px-6 py-4 text-green-600">+9.8%</td>
                    <td className="px-6 py-4"><Badge className="bg-green-100 text-green-700">达标</Badge></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">课程完成率</td>
                    <td className="px-6 py-4">78.5%</td>
                    <td className="px-6 py-4">75.2%</td>
                    <td className="px-6 py-4 text-green-600">+3.3%</td>
                    <td className="px-6 py-4"><Badge className="bg-green-100 text-green-700">达标</Badge></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">考试通过率</td>
                    <td className="px-6 py-4">85.2%</td>
                    <td className="px-6 py-4">83.1%</td>
                    <td className="px-6 py-4 text-green-600">+2.1%</td>
                    <td className="px-6 py-4"><Badge className="bg-green-100 text-green-700">达标</Badge></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4">用户满意度</td>
                    <td className="px-6 py-4">4.6/5</td>
                    <td className="px-6 py-4">4.5/5</td>
                    <td className="px-6 py-4 text-green-600">+0.1</td>
                    <td className="px-6 py-4"><Badge className="bg-green-100 text-green-700">优秀</Badge></td>
                  </tr>
                </tbody>
              </table>
                </div>
              </CardContent>
            </Card>
          </div>
    );
  }

  // 渲染内容管理
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
            <select className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>全部</option>
              <option>公告</option>
              <option>新闻</option>
              <option>通知</option>
            </select>
                  </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            发布内容
          </Button>
                </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">标题</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">内容摘要</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {announcements.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 font-medium">{item.title}</td>
                      <td className="px-6 py-4 text-gray-500">{item.content}</td>
                      <td className="px-6 py-4">
                        <Badge variant={item.status === '已发布' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{item.createDate}</td>
                      <td className="px-6 py-4">
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
              </CardContent>
            </Card>
      </div>
    );
  }

  // 渲染日志管理
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
            <select className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>全部</option>
              <option>用户操作</option>
              <option>管理操作</option>
              <option>系统事件</option>
              <option>安全事件</option>
            </select>
            <select className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>全部</option>
              <option>成功</option>
              <option>失败</option>
            </select>
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

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">类型</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">用户</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">时间</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP地址</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">结果</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={
                          log.type === '安全事件' ? 'text-red-600 border-red-200' :
                          log.type === '管理操作' ? 'text-blue-600 border-blue-200' :
                          log.type === '系统事件' ? 'text-blue-600 border-blue-200' :
                          'text-green-600 border-green-200'
                        }>
                          {log.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">{log.user}</td>
                      <td className="px-6 py-4">{log.action}</td>
                      <td className="px-6 py-4 text-sm">{log.time}</td>
                      <td className="px-6 py-4 text-sm">{log.ip}</td>
                      <td className="px-6 py-4">
                        <Badge variant={log.result === '成功' ? 'default' : 'destructive'}>
                          {log.result}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 渲染系统设置
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
          <Card key={sectionIndex} className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700">{section.category}</CardTitle>
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

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
              <CardHeader>
            <CardTitle className="text-gray-700">系统维护</CardTitle>
            <p className="text-sm text-gray-500">系统维护和备份操作</p>
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

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-gradient-to-b from-blue-100/70 to-cyan-100/60 border-r border-blue-200/30 overflow-y-auto z-0 transition-all duration-300 flex flex-col ${sidebarCollapsed ? 'w-0 -translate-x-full' : 'w-56'}`}>
        {/* Profile */}
        <div className={`mb-3 ${sidebarCollapsed ? 'p-2' : 'p-5'}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} mb-3`}>
            <Avatar className="h-12 w-12 bg-gradient-to-br from-blue-400 to-cyan-400">
              <AvatarFallback className="bg-transparent text-white font-semibold">管</AvatarFallback>
                      </Avatar>
            {!sidebarCollapsed && (
              <div>
                <h3 className="font-semibold text-gray-700">管理员</h3>
                <p className="text-sm text-gray-400">Administrator</p>
                      </div>
            )}
                    </div>
                  </div>

        {/* Navigation */}
        <nav className={`space-y-1 pb-8 flex-1 ${sidebarCollapsed ? 'px-2' : 'px-5'}`}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-2 transition-all duration-300 ${
                  isActive 
                    ? "bg-white rounded-l-[2rem] shadow-lg relative z-20 -mr-8 pr-20" 
                    : "text-gray-500 hover:bg-white/30 hover:text-gray-700 rounded-l-xl hover:transform hover:-translate-x-1"
                }`}
                title={sidebarCollapsed ? item.label : ""}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-500' : ''}`} />
                {!sidebarCollapsed && <span className={`font-medium whitespace-nowrap ${isActive ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent' : ''}`}>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button - 放在菜单底部 */}
        <div className={`mt-auto pt-4 border-t border-white/20 ${sidebarCollapsed ? 'px-2' : 'px-5'}`}>
          <Button
            onClick={handleLogout}
            className={`w-full bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 rounded-xl ${sidebarCollapsed ? 'p-2' : 'px-4 py-2'}`}
            title={sidebarCollapsed ? "退出登录" : ""}
          >
            {sidebarCollapsed ? <Settings className="h-5 w-5" /> : "退出登录"}
          </Button>
        </div>

      </aside>

      {/* Main Content */}
      <main className={`${sidebarCollapsed ? 'ml-0' : 'ml-56'} min-h-screen relative z-10 transition-all duration-300`}>
        {/* 底色层 - 与导航栏相同颜色，非圆角 */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-100/70 to-cyan-100/60"></div>
        
        {/* 白色圆角背景层 */}
        <div className={`relative bg-white min-h-screen ${sidebarCollapsed ? 'rounded-none' : 'rounded-l-[2rem] -ml-8'}`}>
          {/* 页面头部 */}
          <header className={`bg-white/80 backdrop-blur-sm border-b border-blue-200/30 shadow-sm ${sidebarCollapsed ? 'rounded-none' : 'rounded-tl-[2rem]'}`}>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="p-2 rounded-lg hover:bg-transparent"
                >
                  <Menu className="h-5 w-5 text-blue-500" />
                </Button>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  {getSectionTitle(activeSection)}
                </h1>
                <p className="text-sm text-gray-500">
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
          <div className="p-8">
            {renderContent(activeSection)}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
