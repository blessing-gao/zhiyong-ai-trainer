import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Clock,
  BookMarked,
  X,
  Eye,
} from 'lucide-react';
import { paperApi, tagApi } from '@/services/api';
import PaperPreviewDialog from './PaperPreviewDialog';

interface Paper {
  id: string;
  name: string;
  type: string;
  totalScore: number;
  duration: number;
  questionCount: number;
  status: number;
}

interface PageResponse {
  code: number;
  data: {
    current: string;
    size: string;
    total: string;
    pages: string;
    records: Paper[];
    has_next: boolean;
    has_previous: boolean;
  };
}

interface FirstLevelTag {
  id: number;
  tagName: string;
}

interface CreatePaperFormData {
  name: string;
  description: string;
  type: 'exam' | 'practice' | 'mock';
  totalScore: number;
  passScore: number;
  duration: number;
  questionCount: number;
  typeRatio: {
    judge: number;
    single: number;
    multiple: number;
  };
  knowledgeRatio: {
    [key: number]: number;
  };
}

interface PaperDetail extends Paper {
  description?: string;
  passScore?: number;
  knowledgeRatio?: string;
  typeRatio?: string;
  typeScore?: string;
  questionsJson?: string;
}

interface Question {
  question_id: number;
  type: string;
  stem: string;
  options: string;
  answer: string;
  difficulty?: string;
  level?: string;
  analysis?: string;
}

const PaperManagement = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPapers, setTotalPapers] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [jumpPage, setJumpPage] = useState<string>('');

  // 创建试卷对话框状态
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [firstLevelTags, setFirstLevelTags] = useState<FirstLevelTag[]>([]);
  const [tagsLoading, setTagsLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // 创建试卷表单数据
  const [formData, setFormData] = useState<CreatePaperFormData>({
    name: '',
    description: '',
    type: 'exam',
    totalScore: 100,
    passScore: 60,
    duration: 90,
    questionCount: 100,
    typeRatio: {
      judge: 20,
      single: 70,
      multiple: 10,
    },
    knowledgeRatio: {},
  });

  // 预览试卷相关状态
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewPaper, setPreviewPaper] = useState<PaperDetail | null>(null);
  const [previewQuestions, setPreviewQuestions] = useState<Question[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // 组卷预览对话框状态
  const [showPaperPreviewDialog, setShowPaperPreviewDialog] = useState(false);

  // 获取试卷列表
  const fetchPapers = async (page: number, size: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await paperApi.getPapersByPage(page, size) as PageResponse;

      if (response.code === 0 && response.data) {
        setPapers(response.data.records);
        setCurrentPage(parseInt(response.data.current));
        setTotalPages(parseInt(response.data.pages));
        setTotalPapers(parseInt(response.data.total));
      } else {
        setError('获取试卷列表失败');
      }
    } catch (err) {
      setError('获取试卷列表出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error fetching papers:', err);
    } finally {
      setLoading(false);
    }
  };

  // 加载一级知识点
  const loadFirstLevelTags = async () => {
    setTagsLoading(true);
    try {
      const response = await tagApi.getFirstLevelTags() as any;
      if (response.code === 0 && response.data) {
        setFirstLevelTags(response.data);

        // 初始化知识点比例（均匀分配）
        const ratio: { [key: number]: number } = {};
        const percentPerTag = Math.floor(100 / response.data.length);
        response.data.forEach((tag: FirstLevelTag, index: number) => {
          if (index === response.data.length - 1) {
            // 最后一个知识点补足余数
            ratio[tag.id] = 100 - percentPerTag * (response.data.length - 1);
          } else {
            ratio[tag.id] = percentPerTag;
          }
        });

        setFormData(prev => ({
          ...prev,
          knowledgeRatio: ratio,
        }));
      }
    } catch (err) {
      console.error('Error loading tags:', err);
      setCreateError('加载知识点失败');
    } finally {
      setTagsLoading(false);
    }
  };

  // 打开创建试卷对话框
  const handleOpenCreateDialog = async () => {
    setCreateError(null);
    await loadFirstLevelTags();
    setShowCreateDialog(true);
  };

  // 关闭创建试卷对话框
  const handleCloseCreateDialog = () => {
    setShowCreateDialog(false);
    setCreateError(null);
    setFormData({
      name: '',
      description: '',
      type: 'exam',
      totalScore: 150,
      passScore: 90,
      duration: 120,
      questionCount: 100,
      typeRatio: {
        judge: 20,
        single: 70,
        multiple: 10,
      },
      knowledgeRatio: {},
    });
  };

  // 验证表单数据
  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return '试卷名称不能为空';
    }
    if (formData.totalScore <= 0) {
      return '试卷总分必须大于0';
    }
    if (formData.passScore <= 0) {
      return '及格分数必须大于0';
    }
    if (formData.passScore > formData.totalScore) {
      return '及格分数不能大于试卷总分';
    }
    if (formData.duration <= 0) {
      return '考试时长必须大于0';
    }
    if (formData.questionCount <= 0) {
      return '题目总数必须大于0';
    }

    const typeRatioSum = formData.typeRatio.judge + formData.typeRatio.single + formData.typeRatio.multiple;
    if (typeRatioSum !== 100) {
      return `题型比例之和必须等于100，当前为: ${typeRatioSum}`;
    }

    const knowledgeRatioSum = Object.values(formData.knowledgeRatio).reduce((sum, val) => sum + val, 0);
    if (knowledgeRatioSum !== 100) {
      return `知识点比例之和必须等于100，当前为: ${knowledgeRatioSum}`;
    }

    return null;
  };

  // 创建试卷 - 先显示预览
  const handleCreatePaper = async () => {
    const validationError = validateForm();
    if (validationError) {
      setCreateError(validationError);
      return;
    }

    // 关闭创建对话框，打开预览对话框
    setShowCreateDialog(false);
    setShowPaperPreviewDialog(true);
  };

  // 保存试卷成功后的回调
  const handlePaperSaved = (paperId: string) => {
    // 刷新列表
    fetchPapers(1, pageSize);
  };

  // 打开预览对话框
  const handleOpenPreview = async (paperId: string) => {
    setPreviewLoading(true);
    setPreviewError(null);
    try {
      const response = await paperApi.getPaperDetail(parseInt(paperId)) as any;

      if (response.code === 0) {
        const paper = response.data;
        setPreviewPaper(paper);

        // 解析试卷中的题目ID
        let questionIds: number[] = [];
        if (paper.questionsJson) {
          try {
            questionIds = JSON.parse(paper.questionsJson);
          } catch (e) {
            console.error('Failed to parse questionsJson:', e);
          }
        }

        // 获取每个题目的详情
        const questions: Question[] = [];
        for (const qId of questionIds) {
          try {
            const qResponse = await paperApi.getQuestionDetail(qId) as any;
            if (qResponse.code === 0) {
              questions.push(qResponse.data);
            }
          } catch (err) {
            console.error(`Failed to fetch question ${qId}:`, err);
          }
        }

        setPreviewQuestions(questions);
        setShowPreviewDialog(true);
      } else {
        setPreviewError(response.message || '获取试卷详情失败');
      }
    } catch (err) {
      setPreviewError('获取试卷详情出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error fetching paper detail:', err);
    } finally {
      setPreviewLoading(false);
    }
  };

  // 关闭预览对话框
  const handleClosePreview = () => {
    setShowPreviewDialog(false);
    setPreviewPaper(null);
    setPreviewQuestions([]);
    setPreviewError(null);
  };

  // 初始化加载
  useEffect(() => {
    fetchPapers(1, pageSize);
  }, []);

  // 处理分页
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchPapers(newPage, pageSize);
    }
  };

  // 处理每页数量变化
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    fetchPapers(1, newSize);
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
    fetchPapers(pageNum, pageSize);
  };

  // 处理回车键跳转
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleJumpPage();
    }
  };

  // 获取试卷类型标签
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exam':
        return '正式考试卷';
      case 'practice':
        return '练习卷';
      case 'mock':
        return '模拟卷';
      default:
        return type;
    }
  };

  // 获取试卷类型颜色
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exam':
        return 'text-blue-600 border-blue-200';
      case 'practice':
        return 'text-green-600 border-green-200';
      case 'mock':
        return 'text-purple-600 border-purple-200';
      default:
        return 'text-gray-600 border-gray-200';
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

  return (
    <div className="space-y-6">
      {/* 搜索和操作栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Input placeholder="搜索试卷..." className="w-64" />
          <select className="w-32 px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>全部类型</option>
            <option value="exam">正式考试卷</option>
            <option value="practice">练习卷</option>
            <option value="mock">模拟卷</option>
          </select>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleOpenCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            随机组卷
          </Button>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">试卷总数</h3>
                <FileText className="h-4 w-4 text-gray-500" />
              </div>
              <div className="text-2xl font-bold">{totalPapers}</div>
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

      {/* 试卷列表 */}
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">试卷名称</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">试卷类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">总分</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">做题时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">题目数量</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>加载中...</span>
                      </div>
                    </td>
                  </tr>
                ) : papers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      暂无试卷数据
                    </td>
                  </tr>
                ) : (
                  papers.map((paper) => (
                    <tr key={paper.id}>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium truncate">{paper.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getTypeColor(paper.type)}>
                          {getTypeLabel(paper.type)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{paper.totalScore}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-gray-500" />
                          {paper.duration}分钟
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm">
                          <BookMarked className="h-3 w-3 text-gray-500" />
                          {paper.questionCount}题
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getStatusColor(paper.status)}>
                          {getStatusLabel(paper.status)}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenPreview(paper.id)}
                            title="预览试卷"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3" />
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
            第 {currentPage} / {totalPages} 页，共 {totalPapers} 条
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

      {/* 预览试卷对话框 */}
      {showPreviewDialog && previewPaper && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">试卷预览 - {previewPaper.name}</h2>
              <button
                onClick={handleClosePreview}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* 错误提示 */}
              {previewError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {previewError}
                </div>
              )}

              {previewLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>加载试卷详情中...</span>
                </div>
              ) : (
                <>
                  {/* 试卷基本信息 */}
                  <div className="space-y-4 border-b pb-4">
                    <h3 className="font-medium text-sm">试卷基本信息</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">试卷类型</p>
                        <p className="text-sm font-medium">{getTypeLabel(previewPaper.type)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">试卷总分</p>
                        <p className="text-sm font-medium">{previewPaper.totalScore}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">及格分数</p>
                        <p className="text-sm font-medium">{previewPaper.passScore}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">考试时长</p>
                        <p className="text-sm font-medium">{previewPaper.duration}分钟</p>
                      </div>
                    </div>

                    {previewPaper.description && (
                      <div>
                        <p className="text-xs text-gray-500">试卷说明</p>
                        <p className="text-sm">{previewPaper.description}</p>
                      </div>
                    )}
                  </div>

                  {/* 题型比例 */}
                  {previewPaper.typeRatio && (
                    <div className="space-y-4 border-b pb-4">
                      <h3 className="font-medium text-sm">题型比例</h3>

                      <div className="grid grid-cols-3 gap-4">
                        {(() => {
                          try {
                            const typeRatio = JSON.parse(previewPaper.typeRatio);
                            return (
                              <>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <p className="text-xs text-gray-600">判断题</p>
                                  <p className="text-lg font-bold text-blue-600">{typeRatio.judge}%</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                  <p className="text-xs text-gray-600">单选题</p>
                                  <p className="text-lg font-bold text-green-600">{typeRatio.single}%</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                  <p className="text-xs text-gray-600">多选题</p>
                                  <p className="text-lg font-bold text-purple-600">{typeRatio.multiple}%</p>
                                </div>
                              </>
                            );
                          } catch (e) {
                            return <p className="text-sm text-gray-500">无法解析题型比例</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* 题型分值 */}
                  {previewPaper.typeScore && (
                    <div className="space-y-4 border-b pb-4">
                      <h3 className="font-medium text-sm">题型分值</h3>

                      <div className="grid grid-cols-3 gap-4">
                        {(() => {
                          try {
                            const typeScore = JSON.parse(previewPaper.typeScore);
                            return (
                              <>
                                <div className="p-3 bg-blue-50 rounded-lg">
                                  <p className="text-xs text-gray-600">判断题</p>
                                  <p className="text-lg font-bold text-blue-600">{typeScore.judge}分</p>
                                </div>
                                <div className="p-3 bg-green-50 rounded-lg">
                                  <p className="text-xs text-gray-600">单选题</p>
                                  <p className="text-lg font-bold text-green-600">{typeScore.single}分</p>
                                </div>
                                <div className="p-3 bg-purple-50 rounded-lg">
                                  <p className="text-xs text-gray-600">多选题</p>
                                  <p className="text-lg font-bold text-purple-600">{typeScore.multiple}分</p>
                                </div>
                              </>
                            );
                          } catch (e) {
                            return <p className="text-sm text-gray-500">无法解析题型分值</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* 知识点比例 */}
                  {previewPaper.knowledgeRatio && (
                    <div className="space-y-4 border-b pb-4">
                      <h3 className="font-medium text-sm">知识点比例</h3>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {(() => {
                          try {
                            const knowledgeRatio = JSON.parse(previewPaper.knowledgeRatio);
                            return Object.entries(knowledgeRatio).map(([tagId, ratio]: [string, any]) => (
                              <div key={tagId} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600">知识点 {tagId}</p>
                                <p className="text-lg font-bold text-gray-700">{ratio}%</p>
                              </div>
                            ));
                          } catch (e) {
                            return <p className="text-sm text-gray-500">无法解析知识点比例</p>;
                          }
                        })()}
                      </div>
                    </div>
                  )}

                  {/* 试卷题目 */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-sm">试卷题目 ({previewQuestions.length}题)</h3>

                    {previewQuestions.length === 0 ? (
                      <p className="text-sm text-gray-500">暂无题目</p>
                    ) : (
                      <div className="space-y-4">
                        {previewQuestions.map((question, index) => (
                          <div key={question.question_id} className="p-4 border rounded-lg bg-gray-50">
                            {/* 题目头部 */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">第 {index + 1} 题</span>
                                <Badge variant="outline" className="text-xs">
                                  {question.type === 'judge' ? '判断题' :
                                   question.type === 'single' ? '单选题' :
                                   question.type === 'multiple' ? '多选题' : question.type}
                                </Badge>
                                {question.difficulty && (
                                  <Badge variant="outline" className="text-xs">
                                    难度: {question.difficulty}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* 题干 */}
                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-800">{question.stem}</p>
                            </div>

                            {/* 选项 */}
                            {question.options && (
                              <div className="mb-3 space-y-2">
                                {(() => {
                                  try {
                                    const options = JSON.parse(question.options);
                                    if (Array.isArray(options)) {
                                      return options.map((option: any, idx: number) => (
                                        <div key={idx} className="flex items-start gap-2 text-sm">
                                          <span className="font-medium text-gray-600 min-w-6">
                                            {String.fromCharCode(65 + idx)}.
                                          </span>
                                          <span className="text-gray-700">
                                            {typeof option === 'string' ? option : option.text || option}
                                          </span>
                                        </div>
                                      ));
                                    }
                                    return null;
                                  } catch (e) {
                                    return <p className="text-xs text-gray-500">无法解析选项</p>;
                                  }
                                })()}
                              </div>
                            )}

                            {/* 答案和解析 */}
                            <div className="pt-3 border-t space-y-2">
                              <div className="flex gap-4 text-xs">
                                <div>
                                  <span className="text-gray-600">标准答案: </span>
                                  <span className="font-medium text-blue-600">{question.answer}</span>
                                </div>
                                {question.analysis && (
                                  <div>
                                    <span className="text-gray-600">解析: </span>
                                    <span className="text-gray-700">{question.analysis}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 关闭按钮 */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button onClick={handleClosePreview}>关闭</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 创建试卷对话框 */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">随机组卷</h2>
              <button
                onClick={handleCloseCreateDialog}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* 错误提示 */}
              {createError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {createError}
                </div>
              )}

              {/* 试卷基本信息 */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm">试卷基本信息</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">试卷名称 *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入试卷名称"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">试卷类型 *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="exam">正式考试卷</option>
                      <option value="practice">练习卷</option>
                      <option value="mock">模拟卷</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">试卷说明</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="请输入试卷说明"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">试卷总分 *</label>
                    <Input
                      type="number"
                      value={formData.totalScore}
                      onChange={(e) => setFormData({ ...formData, totalScore: parseFloat(e.target.value) || 0 })}
                      placeholder="请输入试卷总分"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">及格分数 *</label>
                    <Input
                      type="number"
                      value={formData.passScore}
                      onChange={(e) => setFormData({ ...formData, passScore: parseFloat(e.target.value) || 0 })}
                      placeholder="请输入及格分数"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">考试时长(分钟) *</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                      placeholder="请输入考试时长"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">题目总数 *</label>
                    <Input
                      type="number"
                      value={formData.questionCount}
                      onChange={(e) => setFormData({ ...formData, questionCount: parseInt(e.target.value) || 0 })}
                      placeholder="请输入题目总数"
                    />
                  </div>
                </div>
              </div>

              {/* 题型比例配置 */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-sm">题型比例配置</h3>
                <p className="text-xs text-gray-500">比例之和必须等于100%</p>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">判断题 (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.typeRatio.judge}
                      onChange={(e) => setFormData({
                        ...formData,
                        typeRatio: { ...formData.typeRatio, judge: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">单选题 (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.typeRatio.single}
                      onChange={(e) => setFormData({
                        ...formData,
                        typeRatio: { ...formData.typeRatio, single: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">多选题 (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={formData.typeRatio.multiple}
                      onChange={(e) => setFormData({
                        ...formData,
                        typeRatio: { ...formData.typeRatio, multiple: parseInt(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  比例总和: {formData.typeRatio.judge + formData.typeRatio.single + formData.typeRatio.multiple}%
                </div>
              </div>

              {/* 知识点比例配置 */}
              <div className="space-y-4 border-t pt-4">
                <h3 className="font-medium text-sm">知识点比例配置</h3>
                <p className="text-xs text-gray-500">比例之和必须等于100%</p>

                {tagsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">加载知识点中...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {firstLevelTags.map((tag) => (
                      <div key={tag.id}>
                        <label className="block text-sm font-medium mb-1">{tag.tagName} (%)</label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.knowledgeRatio[tag.id] || 0}
                          onChange={(e) => setFormData({
                            ...formData,
                            knowledgeRatio: {
                              ...formData.knowledgeRatio,
                              [tag.id]: parseInt(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-sm text-gray-600">
                  比例总和: {Object.values(formData.knowledgeRatio).reduce((sum, val) => sum + val, 0)}%
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 justify-end border-t pt-4">
                <Button
                  variant="outline"
                  onClick={handleCloseCreateDialog}
                  disabled={creating}
                >
                  取消
                </Button>
                <Button
                  onClick={handleCreatePaper}
                  disabled={creating || tagsLoading}
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      组卷中...
                    </>
                  ) : (
                    '开始组卷'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 组卷预览对话框 */}
      <PaperPreviewDialog
        open={showPaperPreviewDialog}
        onOpenChange={setShowPaperPreviewDialog}
        onSave={handlePaperSaved}
        formData={formData}
      />
    </div>
  );
};

export default PaperManagement;

