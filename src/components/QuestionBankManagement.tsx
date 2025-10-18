import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Download,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Database,
  Loader2,
  X,
  Eye,
} from 'lucide-react';
import { questionApi } from '@/services/api';

interface Question {
  question_id: string;
  type: string;
  stem: string;
  difficulty: string;
  level: string;
  answer: string;
  status: number;
  options?: string;
  analysis?: string;
}

interface PageResponse {
  code: number;
  data: {
    current: string;
    size: string;
    total: string;
    pages: string;
    records: Question[];
    has_next: boolean;
    has_previous: boolean;
  };
}

const QuestionBankManagement = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [jumpPage, setJumpPage] = useState<string>('');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // 查询条件
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');

  // 获取题目列表（统一接口，支持无条件或条件查询）
  const fetchQuestions = async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      // 统一调用一个接口，自动处理有无条件的情况
      const response = await questionApi.listQuestions(
        page,
        size,
        selectedType || undefined,
        selectedDifficulty || undefined,
        selectedLevel || undefined,
        searchKeyword || undefined
      ) as PageResponse;

      if (response.code === 0 && response.data) {
        setQuestions(response.data.records);
        setCurrentPage(parseInt(response.data.current));
        setTotalPages(parseInt(response.data.pages));
        setTotalQuestions(parseInt(response.data.total));
      } else {
        setError('获取题目列表失败');
      }
    } catch (err) {
      setError('获取题目列表出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchQuestions(1, pageSize);
  }, []);

  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchQuestions(newPage, pageSize);
    }
  };

  // 处理每页数量变化
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    fetchQuestions(1, newSize);
  };

  // 处理页码跳转
  const handleJumpPage = () => {
    const pageNum = parseInt(jumpPage);
    if (isNaN(pageNum)) {
      setError('请输入有效的页码');
      return;
    }
    if (pageNum < 1 || pageNum > totalPages) {
      setError(`页码必须在 1 到 ${totalPages} 之间`);
      return;
    }
    setError(null);
    setJumpPage('');
    fetchQuestions(pageNum, pageSize);
  };

  // 处理回车键跳转
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJumpPage();
    }
  };

  // 处理查询
  const handleSearch = () => {
    setCurrentPage(1);
    fetchQuestions(1, pageSize);
  };

  // 处理重置查询条件
  const handleResetFilters = () => {
    setSearchKeyword('');
    setSelectedType('');
    setSelectedDifficulty('');
    setSelectedLevel('');
    setCurrentPage(1);
    fetchQuestions(1, pageSize);
  };

  // 处理查询条件回车
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 打开预览
  const handlePreview = (question: Question) => {
    setPreviewQuestion(question);
    setShowPreview(true);
  };

  // 关闭预览
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewQuestion(null);
  };

  // 解析选项
  const parseOptions = (optionsStr: string | undefined) => {
    if (!optionsStr) return [];
    try {
      return JSON.parse(optionsStr);
    } catch {
      return [];
    }
  };

  // 获取状态标签
  const getStatusLabel = (status: number) => {
    return status === 1 ? '已启用' : '已禁用';
  };

  // 获取状态颜色
  const getStatusColor = (status: number) => {
    return status === 1 ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200';
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-600 border-green-200';
      case 'medium':
        return 'text-yellow-600 border-yellow-200';
      case 'hard':
        return 'text-red-600 border-red-200';
      default:
        return 'text-gray-600 border-gray-200';
    }
  };

  // 获取难度标签
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '简单';
      case 'medium':
        return '中等';
      case 'hard':
        return '困难';
      default:
        return difficulty;
    }
  };

  // 获取题型标签
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'single':
        return '单选题';
      case 'multiple':
        return '多选题';
      case 'judge':
        return '判断题';
      case 'fill':
        return '填空题';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="搜索题干关键字..."
              className="w-48"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={handleSearchKeyPress}
            />
            <select
              className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">全部题型</option>
              <option value="single">单选题</option>
              <option value="multiple">多选题</option>
              <option value="judge">判断题</option>
              <option value="fill">填空题</option>
            </select>
            <select
              className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">全部难度</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
            <select
              className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option value="">全部级别</option>
              <option value="level1">Level 1</option>
              <option value="level2">Level 2</option>
              <option value="level3">Level 3</option>
              <option value="level4">Level 4</option>
              <option value="level5">Level 5</option>
            </select>
            <Button
              size="sm"
              onClick={handleSearch}
              disabled={loading}
            >
              查询
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleResetFilters}
              disabled={loading}
            >
              重置
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              批量导入
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出题库
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              新增题目
            </Button>
          </div>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">题库总数</h3>
                <Database className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-2xl font-bold">{totalQuestions}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* 题目列表 */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题目ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题目内容</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">难度</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">级别</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>加载中...</span>
                      </div>
                    </td>
                  </tr>
                ) : questions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      暂无题目数据
                    </td>
                  </tr>
                ) : (
                  questions.map((question) => (
                    <tr key={question.question_id}>
                      <td className="px-6 py-4 text-sm">{question.question_id}</td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium truncate">{question.stem}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{getTypeLabel(question.type)}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getDifficultyColor(question.difficulty)}>
                          {getDifficultyLabel(question.difficulty)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">{question.level}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getStatusColor(question.status)}>
                          {getStatusLabel(question.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePreview(question)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            预览
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 分页控件 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            第 {currentPage} / {totalPages} 页，共 {totalQuestions} 条
          </span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value={10}>每页10条</option>
            <option value={20}>每页20条</option>
            <option value={50}>每页50条</option>
          </select>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
          >
            下一页
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>

          {/* 页码跳转 */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-300">
            <span className="text-sm text-gray-600">跳转到</span>
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="页码"
              className="w-16 h-8 text-sm"
            />
            <span className="text-sm text-gray-600">页</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleJumpPage}
              disabled={!jumpPage || loading}
              className="text-sm"
            >
              跳转
            </Button>
          </div>
        </div>
      </div>

      {/* 预览模态框 */}
      {showPreview && previewQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">题目预览</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClosePreview}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* 题目基本信息 */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">题目ID:</span>
                  <span className="text-sm">{previewQuestion.question_id}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">题型:</span>
                  <Badge variant="outline">{getTypeLabel(previewQuestion.type)}</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">难度:</span>
                  <Badge variant="outline" className={getDifficultyColor(previewQuestion.difficulty)}>
                    {getDifficultyLabel(previewQuestion.difficulty)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">级别:</span>
                  <span className="text-sm">{previewQuestion.level}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">状态:</span>
                  <Badge variant="outline" className={getStatusColor(previewQuestion.status)}>
                    {getStatusLabel(previewQuestion.status)}
                  </Badge>
                </div>
              </div>

              <div className="border-t pt-4" />

              {/* 完整题干 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">题目内容</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{previewQuestion.stem}</p>
                </div>
              </div>

              {/* 选项 */}
              {previewQuestion.options && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">选项</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    {parseOptions(previewQuestion.options).map((option: any, index: number) => (
                      <div key={index} className="text-sm text-gray-700">
                        <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 答案 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">答案</h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900">{previewQuestion.answer}</p>
                </div>
              </div>

              {/* 解析 */}
              {previewQuestion.analysis && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-900">题目解析</h3>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-sm text-green-900 whitespace-pre-wrap">{previewQuestion.analysis}</p>
                  </div>
                </div>
              )}

              {/* 关闭按钮 */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleClosePreview}
                >
                  关闭
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QuestionBankManagement;

