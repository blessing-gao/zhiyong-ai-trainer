import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { examApi } from "@/services/api";
import CreateExamDialog from "./CreateExamDialog";
import ExamPreviewDialog from "./ExamPreviewDialog";
import {
  Plus,
  Download,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";

interface Exam {
  id: number;
  examName: string;
  startTime: string;
  endTime: string;
  totalScore: number;
  passScore: number;
  duration: number;
  status: number;
  examType?: number;
  description?: string;
  createBy?: string;
  updateBy?: string;
  createTime: string;
  updateTime: string;
}

interface PageData {
  records: Exam[];
  current: number;
  size: number;
  total: number;
  pages: number;
}

const ExamManagement = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("全部");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);

  // 加载考试列表
  const loadExams = async (page: number = 1) => {
    setLoading(true);
    try {
      const response: any = await examApi.getExamsByPage(page, pageSize);
      if (response.code === 0 && response.data) {
        const pageData: PageData = response.data;
        setExams(pageData.records || []);
        setCurrentPage(pageData.current || 1);
        setTotalPages(pageData.pages || 0);
        setTotalCount(pageData.total || 0);
      }
    } catch (error) {
      console.error("Failed to load exams:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams(currentPage);
  }, [currentPage, pageSize]);

  // 获取状态标签
  const getStatusBadge = (status: number) => {
    const statusMap: Record<number, { label: string; variant: any }> = {
      1: { label: "未开始", variant: "outline" },
      2: { label: "进行中", variant: "default" },
      3: { label: "已结束", variant: "secondary" },
    };
    const statusInfo = statusMap[status] || { label: "未知", variant: "outline" };
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  // 格式化日期时间
  const formatDateTime = (dateTime: string) => {
    if (!dateTime) return "-";
    const date = new Date(dateTime);
    return date.toLocaleString("zh-CN");
  };

  // 计算考试时间范围
  const getTimeRange = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "-";
    const start = new Date(startTime);
    const end = new Date(endTime);
    return `${start.toLocaleDateString("zh-CN")} ${start.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })} - ${end.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`;
  };

  // 过滤考试列表
  const filteredExams = exams.filter((exam) => {
    const matchesSearch = exam.examName.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "全部" ||
      (statusFilter === "未开始" && exam.status === 1) ||
      (statusFilter === "进行中" && exam.status === 2) ||
      (statusFilter === "已结束" && exam.status === 3);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 考试统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">总考试数</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">进行中</p>
                <p className="text-2xl font-bold text-green-600">
                  {exams.filter((e) => e.status === 2).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">已结束</p>
                <p className="text-2xl font-bold text-blue-600">
                  {exams.filter((e) => e.status === 3).length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Award className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">未开始</p>
                <p className="text-2xl font-bold text-orange-600">
                  {exams.filter((e) => e.status === 1).length}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input
            placeholder="搜索考试名称..."
            className="w-64"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <select
            className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>全部</option>
            <option>未开始</option>
            <option>进行中</option>
            <option>已结束</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出成绩
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            创建考试
          </Button>
        </div>
      </div>

      {/* 考试列表 */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">加载中...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      考试名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      时间安排
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      总分/及格分
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      考试状态
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam) => (
                      <tr key={exam.id}>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium">{exam.examName}</p>
                            <p className="text-sm text-gray-500">ID: {exam.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div>{getTimeRange(exam.startTime, exam.endTime)}</div>
                            <div className="text-gray-500">时长: {exam.duration}分钟</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-medium">{exam.totalScore}分</div>
                            <div className="text-gray-500">及格: {exam.passScore}分</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(exam.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              title="预览"
                              onClick={() => {
                                setSelectedExamId(exam.id);
                                setPreviewDialogOpen(true);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" title="编辑">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" title="删除" className="text-red-600">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        暂无考试数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 {totalCount} 条记录，第 {currentPage} / {totalPages} 页
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              下一页
            </Button>
          </div>
        </div>
      )}

      {/* 创建考试对话框 */}
      <CreateExamDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={() => loadExams(1)}
      />

      {/* 考试预览对话框 */}
      {selectedExamId && (
        <ExamPreviewDialog
          open={previewDialogOpen}
          onOpenChange={setPreviewDialogOpen}
          examId={selectedExamId}
        />
      )}
    </div>
  );
};

export default ExamManagement;

