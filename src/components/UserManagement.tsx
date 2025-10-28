import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Download,
  Filter,
  Bell,
  Eye,
  FileText,
  Lock,
  Unlock,
  Loader2,
  Upload
} from "lucide-react";
import { userApi } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import AddUserDialog from "./AddUserDialog";
import BatchImportUsersDialog from "./BatchImportUsersDialog";

interface User {
  id: number;
  username: string;
  email: string;
  real_name: string;
  create_time: string;
  status: number;
  user_type: string;
}

interface PageResponse {
  page: number;
  page_size: number;
  total_count: number;
  total_pages: number;
  data: User[];
  has_next: boolean;
  has_previous: boolean;
}

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | string>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [showBatchImportDialog, setShowBatchImportDialog] = useState(false);

  // 加载用户列表
  const loadUsers = async (page: number = 1) => {
    setLoading(true);
    try {
      const response: any = await userApi.pageUsers({
        page,
        pageSize,
        username: searchTerm || undefined,
        status: statusFilter !== "all" ? parseInt(statusFilter as string) : undefined,
      });

      if (response.code === 0 && response.data) {
        setUsers(response.data.data || []);
        setCurrentPage(response.data.page);
        setTotalPages(response.data.total_pages);
        setTotalCount(response.data.total_count);
      } else {
        toast({
          title: "错误",
          description: response.msg || "加载用户列表失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "加载用户列表失败",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadUsers(1);
  }, []);

  // 搜索用户
  const handleSearch = () => {
    setCurrentPage(1);
    loadUsers(1);
  };

  // 禁用用户
  const handleDisableUser = async (userId: number) => {
    try {
      const response: any = await userApi.disableUser(userId);
      if (response.code === 0) {
        toast({
          title: "成功",
          description: "用户已禁用",
        });
        loadUsers(currentPage);
      } else {
        toast({
          title: "错误",
          description: response.msg || "禁用用户失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "禁用用户失败",
        variant: "destructive",
      });
    }
  };

  // 启用用户
  const handleEnableUser = async (userId: number) => {
    try {
      const response: any = await userApi.enableUser(userId);
      if (response.code === 0) {
        toast({
          title: "成功",
          description: "用户已启用",
        });
        loadUsers(currentPage);
      } else {
        toast({
          title: "错误",
          description: response.msg || "启用用户失败",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "错误",
        description: "启用用户失败",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索用户名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 w-64 bg-white/90 border-gray-200 rounded-xl"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm"
          >
            <option value="all">全部状态</option>
            <option value="1">启用</option>
            <option value="0">禁用</option>
          </select>
          <Button
            variant="outline"
            className="border-gray-200 rounded-xl"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4 mr-2" />
            搜索
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="border-gray-200 rounded-xl">
            <Download className="h-4 w-4 mr-2" />
            导出数据
          </Button>
          <Button
            variant="outline"
            className="border-gray-200 rounded-xl"
            onClick={() => setShowBatchImportDialog(true)}
          >
            <Upload className="h-4 w-4 mr-2" />
            批量导入
          </Button>
          <Button
            className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl"
            onClick={() => setShowAddUserDialog(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            + 添加用户
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm rounded-2xl">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">加载中...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">用户信息</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">用户名</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">注册时间</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">状态</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          暂无用户数据
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-300 to-purple-300">
                                <AvatarFallback className="bg-transparent text-white text-sm">
                                  {user.real_name ? user.real_name[0] : user.username[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-700">{user.real_name || user.username}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.create_time).toLocaleDateString('zh-CN')}
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={user.status === 1 ? "bg-green-100 text-green-800 border-0" : "bg-red-100 text-red-800 border-0"}>
                              {user.status === 1 ? "启用" : "禁用"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => {
                                  if (user.status === 1) {
                                    handleDisableUser(user.id);
                                  } else {
                                    handleEnableUser(user.id);
                                  }
                                }}
                              >
                                {user.status === 1 ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <Unlock className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    共 {totalCount} 条记录，第 {currentPage} / {totalPages} 页
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => loadUsers(currentPage - 1)}
                    >
                      上一页
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => loadUsers(currentPage + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 添加用户对话框 */}
      <AddUserDialog
        isOpen={showAddUserDialog}
        onClose={() => setShowAddUserDialog(false)}
        onSuccess={() => loadUsers(1)}
      />

      {/* 批量导入用户对话框 */}
      <BatchImportUsersDialog
        isOpen={showBatchImportDialog}
        onClose={() => setShowBatchImportDialog(false)}
        onSuccess={() => loadUsers(1)}
      />
    </div>
  );
};

export default UserManagement;
