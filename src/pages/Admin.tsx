import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Award
} from "lucide-react";

export const Admin = () => {
  const [activeTab, setActiveTab] = useState("overview");

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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* 管理员头部 */}
      <header className="bg-white border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                管理员控制台
              </h1>
              <p className="text-muted-foreground mt-1">智涌·人工智能中心管理系统</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700">
                系统正常运行
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">系统概览</TabsTrigger>
            <TabsTrigger value="questions">题库管理</TabsTrigger>
            <TabsTrigger value="exams">考试管理</TabsTrigger>
            <TabsTrigger value="users">用户管理</TabsTrigger>
          </TabsList>

          {/* 系统概览 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">总用户数</p>
                      <p className="text-2xl font-bold text-primary">{dashboardStats.totalUsers}</p>
                    </div>
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">活跃用户</p>
                      <p className="text-2xl font-bold text-green-600">{dashboardStats.activeUsers}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">题库总数</p>
                      <p className="text-2xl font-bold text-blue-600">{dashboardStats.totalQuestions}</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">考试通过率</p>
                      <p className="text-2xl font-bold text-purple-600">{dashboardStats.passRate}%</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 近期用户注册 */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>近期用户注册</CardTitle>
                <CardDescription>最近注册的用户列表</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>注册时间</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status === 'active' ? '活跃' : '非活跃'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* 今日考试安排 */}
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>今日考试安排</CardTitle>
                <CardDescription>今天安排的考试场次: {dashboardStats.todayExams} 场</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <h4 className="font-medium">AI训练师认证考试</h4>
                        <p className="text-sm text-muted-foreground">上午 9:00 - 11:00</p>
                      </div>
                    </div>
                    <Badge>35人参考</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <div>
                        <h4 className="font-medium">AI训练师模拟考试</h4>
                        <p className="text-sm text-muted-foreground">下午 2:00 - 4:00</p>
                      </div>
                    </div>
                    <Badge>28人参考</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 题库管理 */}
          <TabsContent value="questions" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">题库管理</h2>
                <p className="text-muted-foreground">管理考试题目和题库</p>
              </div>
              <div className="flex gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      新增题库
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新增题库</DialogTitle>
                      <DialogDescription>创建新的题库分类</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="bankName">题库名称</Label>
                        <Input id="bankName" placeholder="请输入题库名称" />
                      </div>
                      <div>
                        <Label htmlFor="category">分类</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">基础理论</SelectItem>
                            <SelectItem value="core">核心技术</SelectItem>
                            <SelectItem value="practice">应用实战</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="difficulty">难度等级</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="选择难度" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">初级</SelectItem>
                            <SelectItem value="intermediate">中级</SelectItem>
                            <SelectItem value="advanced">高级</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button className="flex-1">创建题库</Button>
                        <Button variant="outline" className="flex-1">取消</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  批量导入
                </Button>
              </div>
            </div>

            <Card className="shadow-medium">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>题库名称</TableHead>
                      <TableHead>分类</TableHead>
                      <TableHead>题目数量</TableHead>
                      <TableHead>难度等级</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {questionBanks.map((bank) => (
                      <TableRow key={bank.id}>
                        <TableCell className="font-medium">{bank.name}</TableCell>
                        <TableCell>{bank.category}</TableCell>
                        <TableCell>{bank.questions}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{bank.difficulty}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 考试管理 */}
          <TabsContent value="exams" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">考试管理</h2>
                <p className="text-muted-foreground">创建和管理考试场次</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                创建考试
              </Button>
            </div>

            <Card className="shadow-medium">
              <CardContent className="pt-6">
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
                        <TableCell>{exam.participants}</TableCell>
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
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              查看详情
                            </Button>
                            <Button size="sm" variant="outline">
                              导出成绩
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 用户管理 */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">用户管理</h2>
                <p className="text-muted-foreground">管理学生和管理员账号</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  导出用户
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  添加用户
                </Button>
              </div>
            </div>

            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>用户列表</CardTitle>
                  <div className="flex gap-2">
                    <Input placeholder="搜索用户..." className="w-64" />
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部</SelectItem>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">非活跃</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>用户名</TableHead>
                      <TableHead>邮箱</TableHead>
                      <TableHead>注册时间</TableHead>
                      <TableHead>最后登录</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">张三</TableCell>
                      <TableCell>zhangsan@example.com</TableCell>
                      <TableCell>2024-03-01</TableCell>
                      <TableCell>2024-03-20</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">活跃</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">编辑</Button>
                          <Button size="sm" variant="outline">重置密码</Button>
                          <Button size="sm" variant="outline" className="text-red-600">删除</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};