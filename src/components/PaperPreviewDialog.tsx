import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  X,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { paperApi, questionApi } from '@/services/api';

interface PaperPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (paperId: string) => void;
  formData: any;
}

interface Question {
  id: number;
  stem: string;
  type: string;
  options: string;
  answer: string;
  analysis?: string;
  difficulty?: string;
}

const PaperPreviewDialog = ({
  open,
  onOpenChange,
  onSave,
  formData,
}: PaperPreviewDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [questionsPerPage] = useState(5);

  // 添加题目相关状态
  const [showAddQuestionDialog, setShowAddQuestionDialog] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('');
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<number>>(new Set());

  // 加载试卷预览
  useEffect(() => {
    if (open && formData) {
      loadPreview();
    }
  }, [open, formData]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: any = await paperApi.generatePaperPreview(formData);

      if (response.code === 0 && response.data) {
        setQuestions(response.data.questions || []);
        setCurrentPage(0);
      } else {
        setError(response.msg || '生成预览失败');
      }
    } catch (err) {
      setError('生成预览出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error loading preview:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);

    // 如果删除后当前页没有数据，返回上一页
    const maxPage = Math.ceil(newQuestions.length / questionsPerPage) - 1;
    if (currentPage > maxPage && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 搜索题库中的题目
  const handleSearchQuestions = async () => {
    setSearchLoading(true);
    try {
      const response: any = await questionApi.listQuestions(
        1,
        100,
        searchType || undefined,
        undefined,
        undefined,
        searchKeyword || undefined
      );

      if (response.code === 0 && response.data) {
        // 过滤掉已经在试卷中的题目
        const currentQuestionIds = new Set(questions.map(q => q.id));
        const filtered = response.data.records.filter((q: any) => !currentQuestionIds.has(q.id));
        setAvailableQuestions(filtered);
      } else {
        setAvailableQuestions([]);
      }
    } catch (err) {
      console.error('Error searching questions:', err);
      setAvailableQuestions([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // 添加选中的题目到试卷
  const handleAddSelectedQuestions = () => {
    const newQuestions = availableQuestions.filter(q => selectedQuestionIds.has(q.id));
    setQuestions([...questions, ...newQuestions]);
    setSelectedQuestionIds(new Set());
    setShowAddQuestionDialog(false);
  };

  // 切换题目选中状态
  const toggleQuestionSelection = (questionId: number) => {
    const newSelected = new Set(selectedQuestionIds);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestionIds(newSelected);
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      setError('试卷中必须至少包含一道题目');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const saveRequest = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        totalScore: formData.totalScore,
        passScore: formData.passScore,
        duration: formData.duration,
        questionIds: questions.map(q => q.id),
      };

      const response: any = await paperApi.savePaper(saveRequest);

      if (response.code === 0 && response.data) {
        onSave(response.data.id);
        onOpenChange(false);
      } else {
        setError(response.msg || '保存试卷失败');
      }
    } catch (err) {
      setError('保存试卷出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error saving paper:', err);
    } finally {
      setSaving(false);
    }
  };

  const startIndex = currentPage * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-lg font-semibold">试卷预览</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* 错误提示 */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* 试卷基本信息 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600">试卷名称</p>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">试卷类型</p>
                <Badge variant="outline">{formData.type}</Badge>
              </div>
              <div>
                <p className="text-xs text-gray-600">总分</p>
                <p className="font-medium">{formData.totalScore}分</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">时长</p>
                <p className="font-medium">{formData.duration}分钟</p>
              </div>
            </div>
          </div>

          {/* 题目列表 */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>加载题目中...</span>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    题目列表 ({questions.length}题)
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowAddQuestionDialog(true)}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      添加题目
                    </Button>
                    <span className="text-sm text-gray-600">
                      第 {currentPage + 1} / {totalPages || 1} 页
                    </span>
                  </div>
                </div>

                {currentQuestions.length > 0 ? (
                  <div className="space-y-3">
                    {currentQuestions.map((question, idx) => (
                      <div
                        key={question.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-sm">
                                {startIndex + idx + 1}. {question.stem.substring(0, 50)}
                                {question.stem.length > 50 ? '...' : ''}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {question.type === 'judge'
                                  ? '判断题'
                                  : question.type === 'single'
                                  ? '单选题'
                                  : '多选题'}
                              </Badge>
                            </div>
                            {question.difficulty && (
                              <p className="text-xs text-gray-500">
                                难度: {question.difficulty}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveQuestion(startIndex + idx)
                            }
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无题目
                  </div>
                )}
              </div>

              {/* 分页按钮 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Button
                      key={i}
                      size="sm"
                      variant={currentPage === i ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(i)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-2 justify-end border-t pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              取消
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || questions.length === 0}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  保存中...
                </>
              ) : (
                '确认试卷'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 添加题目对话框 */}
      {showAddQuestionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">添加题目</h2>
              <button
                onClick={() => setShowAddQuestionDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <CardContent className="p-6 space-y-4">
              {/* 搜索条件 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">题干关键词</label>
                    <Input
                      placeholder="搜索题干..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">题型</label>
                    <select
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">全部题型</option>
                      <option value="judge">判断题</option>
                      <option value="single">单选题</option>
                      <option value="multiple">多选题</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearchQuestions}
                      disabled={searchLoading}
                      className="w-full gap-2"
                    >
                      {searchLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          搜索中...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4" />
                          搜索
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* 题目列表 */}
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {availableQuestions.length > 0 ? (
                  availableQuestions.map((question) => (
                    <div
                      key={question.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleQuestionSelection(question.id)}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedQuestionIds.has(question.id)}
                          onChange={() => toggleQuestionSelection(question.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">
                              {question.stem.substring(0, 60)}
                              {question.stem.length > 60 ? '...' : ''}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {question.type === 'judge'
                                ? '判断题'
                                : question.type === 'single'
                                ? '单选题'
                                : '多选题'}
                            </Badge>
                          </div>
                          {question.difficulty && (
                            <p className="text-xs text-gray-500">
                              难度: {question.difficulty}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchLoading ? '搜索中...' : '暂无题目，请先搜索'}
                  </div>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 justify-end border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddQuestionDialog(false)}
                >
                  取消
                </Button>
                <Button
                  onClick={handleAddSelectedQuestions}
                  disabled={selectedQuestionIds.size === 0}
                >
                  添加 ({selectedQuestionIds.size}题)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PaperPreviewDialog;

