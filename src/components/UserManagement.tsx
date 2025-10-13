import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Plus, 
  Download, 
  Filter,
  Bell,
  Eye,
  FileText
} from "lucide-react";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const users = [
    {
      id: 1,
      name: "张三",
      email: "zhangsan@example.com",
      registrationDate: "2024-03-20",
      progress: 65,
      status: "活跃",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      name: "李四",
      email: "lisi@example.com",
      registrationDate: "2024-03-19",
      progress: 65,
      status: "活跃",
      statusColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 3,
      name: "王五",
      email: "wangwu@example.com",
      registrationDate: "2024-03-18",
      progress: 65,
      status: "非活跃",
      statusColor: "bg-gray-100 text-gray-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-300 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-700">用户管理</h1>
            <p className="text-sm text-gray-500">学生和管理员账户管理</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">系统正常</span>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-500">
            <Bell className="h-4 w-4 mr-2" />
            通知
          </Button>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索用户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 bg-white/90 border-gray-200 rounded-xl"
            />
          </div>
          <Button variant="outline" className="border-gray-200 rounded-xl">
            <Filter className="h-4 w-4 mr-2" />
            状态筛选
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-gray-200 rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            导出数据
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl">
            <Plus className="h-4 w-4 mr-2" />
            + 添加用户
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">用户信息</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">注册时间</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">学习进度</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-300 to-purple-300">
                          <AvatarFallback className="bg-transparent text-white text-sm">
                            {user.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-700">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.registrationDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Progress value={user.progress} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${user.statusColor} border-0`}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-700">
                          查看
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
};

export default UserManagement;
