import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  Database,
  Loader2,
  X,
  Eye,
  ChevronDown,
  Lock,
  Unlock,
  Upload,
} from 'lucide-react';
import { questionApi, tagApi, questionTagApi, questionTypeApi } from '@/services/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QuestionBatchImport from './QuestionBatchImport';

interface Question {
  id: string;
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

interface TagTreeNode {
  id: number;
  name: string;
  code: string;
  description?: string;
  children?: TagTreeNode[];
}

const QuestionBankManagement = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showTagTree, setShowTagTree] = useState(false);
  const [tagTree, setTagTree] = useState<TagTreeNode[]>([]);
  const [loadingTagTree, setLoadingTagTree] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [totalPages, setTotalPages] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [jumpPage, setJumpPage] = useState<string>('');
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewQuestionTags, setPreviewQuestionTags] = useState<any>(null);
  const [loadingPreviewTags, setLoadingPreviewTags] = useState(false);

  // 编辑对话框状态
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [editingTags, setEditingTags] = useState<any[]>([]);
  const [savingEdit, setSavingEdit] = useState(false);
  const [editTagTree, setEditTagTree] = useState<TagTreeNode[]>([]);
  const [editExpandedNodes, setEditExpandedNodes] = useState<Set<string>>(new Set());
  const [loadingEditTagTree, setLoadingEditTagTree] = useState(false);

  // 新增题目对话框状态
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createFormData, setCreateFormData] = useState<any>({
    type: '',
    stem: '',
    options: '[]',
    answer: '',
    difficulty: '',
    level: '',
    analysis: '',
    status: 1,
  });
  const [creatingTags, setCreatingTags] = useState<any[]>([]);
  const [savingCreate, setSavingCreate] = useState(false);
  const [createTagTree, setCreateTagTree] = useState<TagTreeNode[]>([]);
  const [createExpandedNodes, setCreateExpandedNodes] = useState<Set<string>>(new Set());
  const [loadingCreateTagTree, setLoadingCreateTagTree] = useState(false);
  const [questionTypes, setQuestionTypes] = useState<any[]>([]);
  const [loadingQuestionTypes, setLoadingQuestionTypes] = useState(false);
  const [createAddMethod, setCreateAddMethod] = useState<'single' | 'batch' | 'smart'>('single');

  // 批量导入对话框状态
  const [showBatchImportDialog, setShowBatchImportDialog] = useState(false);

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
  const handlePreview = async (question: Question) => {
    setPreviewQuestion(question);
    setShowPreview(true);

    // 加载题目的标签信息
    setLoadingPreviewTags(true);
    try {
      const response = await questionTagApi.getQuestionTagsWithDetails(parseInt(question.id));
      if (response.code === 0) {
        setPreviewQuestionTags(response.data);
      }
    } catch (err) {
      console.error('Failed to load question tags:', err);
    } finally {
      setLoadingPreviewTags(false);
    }
  };

  // 关闭预览
  const handleClosePreview = () => {
    setShowPreview(false);
    setPreviewQuestion(null);
    setPreviewQuestionTags(null);
  };

  // 禁用题目
  const handleDisableQuestion = async (question: Question) => {
    try {
      const response: any = await questionApi.disableQuestion(parseInt(question.id));
      if (response.code === 0) {
        // 刷新题目列表
        fetchQuestions(currentPage, pageSize);
      } else {
        setError('禁用题目失败: ' + (response.msg || '未知错误'));
      }
    } catch (err) {
      setError('禁用题目出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error disabling question:', err);
    }
  };

  // 启用题目
  const handleEnableQuestion = async (question: Question) => {
    try {
      const response: any = await questionApi.enableQuestion(parseInt(question.id));
      if (response.code === 0) {
        // 刷新题目列表
        fetchQuestions(currentPage, pageSize);
      } else {
        setError('启用题目失败: ' + (response.msg || '未知错误'));
      }
    } catch (err) {
      setError('启用题目出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error enabling question:', err);
    }
  };

  // 打开编辑对话框
  const handleEdit = async (question: Question) => {
    setEditingQuestion(question);
    setEditFormData({
      question_id: question.id,
      type: question.type,
      stem: question.stem,
      options: question.options,
      answer: question.answer,
      difficulty: question.difficulty,
      level: question.level,
      analysis: question.analysis,
      status: question.status,
    });

    // 加载题目的标签信息
    try {
      const response = await questionTagApi.getQuestionTagsWithDetails(parseInt(question.id));
      if (response.code === 0 && response.data && response.data.tags) {
        setEditingTags(response.data.tags);
      } else {
        setEditingTags([]);
      }
    } catch (err) {
      console.error('Failed to load question tags:', err);
      setEditingTags([]);
    }

    // 加载标签树
    setLoadingEditTagTree(true);
    try {
      const response = await tagApi.getTagTree();
      if (response.code === 0 && response.data) {
        setEditTagTree(response.data);
        setEditExpandedNodes(new Set());
      }
    } catch (err) {
      console.error('Error fetching tag tree:', err);
    } finally {
      setLoadingEditTagTree(false);
    }

    setShowEditDialog(true);
  };

  // 关闭编辑对话框
  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditingQuestion(null);
    setEditFormData({});
    setEditingTags([]);
    setEditTagTree([]);
    setEditExpandedNodes(new Set());
  };

  // 处理编辑表单字段变化
  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  // 解析选项为数组
  const parseOptionsToArray = (optionsStr: string | undefined): string[] => {
    if (!optionsStr) return [];
    try {
      const parsed = JSON.parse(optionsStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  // 将选项数组转换为 JSON 字符串
  const optionsArrayToJson = (options: string[]): string => {
    return JSON.stringify(options);
  };

  // 处理选项变化（用于选择题）
  const handleOptionChange = (index: number, value: string) => {
    const options = parseOptionsToArray(editFormData.options);
    options[index] = value;
    handleEditFormChange('options', optionsArrayToJson(options));
  };

  // 添加新选项
  const handleAddOption = () => {
    const options = parseOptionsToArray(editFormData.options);
    options.push('');
    handleEditFormChange('options', optionsArrayToJson(options));
  };

  // 删除选项
  const handleRemoveOption = (index: number) => {
    const options = parseOptionsToArray(editFormData.options);
    options.splice(index, 1);
    handleEditFormChange('options', optionsArrayToJson(options));
  };

  // 切换编辑对话框中的节点展开/收起
  const toggleEditNodeExpand = (nodeId: string) => {
    const newExpanded = new Set(editExpandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setEditExpandedNodes(newExpanded);
  };

  // 在编辑对话框中选择标签
  const handleSelectTagInEdit = (firstLevelId: number, secondLevelId: number, thirdLevelId: number) => {
    // 检查是否已经存在相同的标签
    const exists = editingTags.some(
      (tag) =>
        tag.firstLevelTagId === firstLevelId &&
        tag.secondLevelTagId === secondLevelId &&
        tag.thirdLevelTagId === thirdLevelId
    );

    if (!exists) {
      setEditingTags([
        ...editingTags,
        {
          firstLevelTagId: firstLevelId,
          firstLevelTagName: '',
          secondLevelTagId: secondLevelId,
          secondLevelTagName: '',
          thirdLevelTagId: thirdLevelId,
          thirdLevelTagName: '',
        },
      ]);
    }
  };

  // 移除编辑对话框中的标签
  const handleRemoveTagInEdit = (index: number) => {
    setEditingTags(editingTags.filter((_, i) => i !== index));
  };

  // 打开新增题目对话框
  const handleOpenCreateDialog = async () => {
    setShowCreateDialog(true);
    setCreateFormData({
      type: '',
      stem: '',
      options: '[]',
      answer: '',
      difficulty: '',
      level: '',
      analysis: '',
      status: 1,
    });
    setCreatingTags([]);
    setCreateAddMethod('single');

    // 加载题型列表
    setLoadingQuestionTypes(true);
    try {
      const response = await questionTypeApi.getEnabledTypes();
      if (response.code === 0 && response.data) {
        setQuestionTypes(response.data);
      }
    } catch (err) {
      console.error('Error fetching question types:', err);
    } finally {
      setLoadingQuestionTypes(false);
    }

    // 加载标签树
    setLoadingCreateTagTree(true);
    try {
      const response = await tagApi.getTagTree();
      if (response.code === 0 && response.data) {
        setCreateTagTree(response.data);
        setCreateExpandedNodes(new Set());
      }
    } catch (err) {
      console.error('Error fetching tag tree:', err);
    } finally {
      setLoadingCreateTagTree(false);
    }
  };

  // 关闭新增题目对话框
  const handleCloseCreateDialog = () => {
    setShowCreateDialog(false);
    setCreateFormData({
      type: '',
      stem: '',
      options: '[]',
      answer: '',
      difficulty: '',
      level: '',
      analysis: '',
      status: 1,
    });
    setCreatingTags([]);
    setCreateTagTree([]);
    setCreateExpandedNodes(new Set());
  };

  // 处理新增表单字段变化
  const handleCreateFormChange = (field: string, value: any) => {
    setCreateFormData({
      ...createFormData,
      [field]: value,
    });
  };

  // 在新增对话框中选择标签
  const handleSelectTagInCreate = (firstLevelId: number, secondLevelId: number, thirdLevelId: number) => {
    // 检查是否已经存在相同的标签
    const exists = creatingTags.some(
      (tag) =>
        tag.firstLevelTagId === firstLevelId &&
        tag.secondLevelTagId === secondLevelId &&
        tag.thirdLevelTagId === thirdLevelId
    );

    if (!exists) {
      setCreatingTags([
        ...creatingTags,
        {
          firstLevelTagId: firstLevelId,
          firstLevelTagName: '',
          secondLevelTagId: secondLevelId,
          secondLevelTagName: '',
          thirdLevelTagId: thirdLevelId,
          thirdLevelTagName: '',
        },
      ]);
    }
  };

  // 移除新增对话框中的标签
  const handleRemoveTagInCreate = (index: number) => {
    setCreatingTags(creatingTags.filter((_, i) => i !== index));
  };

  // 保存新增题目
  const handleSaveCreate = async () => {
    if (!createFormData.type || !createFormData.stem || !createFormData.answer) {
      setError('题型、题干和答案不能为空');
      return;
    }

    setSavingCreate(true);
    try {
      // 构建请求数据
      const requestData = {
        type: createFormData.type,
        stem: createFormData.stem,
        options: createFormData.options,
        answer: createFormData.answer,
        difficulty: createFormData.difficulty || '',
        level: createFormData.level || '',
        analysis: createFormData.analysis || '',
        status: createFormData.status,
        tags: creatingTags.map((tag) => ({
          firstLevelTagId: tag.firstLevelTagId,
          secondLevelTagId: tag.secondLevelTagId,
          thirdLevelTagId: tag.thirdLevelTagId,
        })),
      };

      const response = await questionApi.createQuestion(requestData);
      if (response.code === 0) {
        // 关闭对话框
        handleCloseCreateDialog();
        // 刷新题目列表
        fetchQuestions(1, pageSize);
        setError(null);
      } else {
        setError('创建题目失败: ' + (response.msg || '未知错误'));
      }
    } catch (err) {
      setError('创建题目出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error creating question:', err);
    } finally {
      setSavingCreate(false);
    }
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    if (!editingQuestion) return;

    setSavingEdit(true);
    try {
      // 构建请求数据
      const requestData = {
        question_id: parseInt(editFormData.question_id),
        type: editFormData.type,
        stem: editFormData.stem,
        options: editFormData.options,
        answer: editFormData.answer,
        difficulty: editFormData.difficulty,
        level: editFormData.level,
        analysis: editFormData.analysis,
        status: editFormData.status,
        tags: editingTags.map((tag) => ({
          firstLevelTagId: tag.firstLevelTagId,
          secondLevelTagId: tag.secondLevelTagId,
          thirdLevelTagId: tag.thirdLevelTagId,
        })),
      };

      const response = await questionApi.updateQuestionWithTags(requestData);
      if (response.code === 0) {
        // 关闭对话框
        handleCloseEditDialog();
        // 刷新题目列表
        fetchQuestions(currentPage, pageSize);
        setError(null);
      } else {
        setError('保存题目失败: ' + (response.msg || '未知错误'));
      }
    } catch (err) {
      setError('保存题目出错: ' + (err instanceof Error ? err.message : '未知错误'));
      console.error('Error saving question:', err);
    } finally {
      setSavingEdit(false);
    }
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

  // 获取标签树
  const handleShowTagTree = async () => {
    setShowTagTree(true);
    setLoadingTagTree(true);
    try {
      const response = await tagApi.getTagTree();
      if (response.code === 0 && response.data) {
        setTagTree(response.data);
        setExpandedNodes(new Set());
      }
    } catch (err) {
      console.error('Error fetching tag tree:', err);
    } finally {
      setLoadingTagTree(false);
    }
  };

  // 切换节点展开/收起
  const toggleNodeExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  // 递归渲染树节点
  const renderTreeNode = (node: TagTreeNode, level: number = 0): JSX.Element => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleNodeExpand(node.id)}
              className="p-0 h-5 w-5 flex items-center justify-center"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? '' : '-rotate-90'
                }`}
              />
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <div className="flex-1">
            <div className="font-medium text-sm">{node.name}</div>
            {node.code && (
              <div className="text-xs text-gray-500">{node.code}</div>
            )}
          </div>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // 递归渲染编辑对话框中的树节点（带选择功能）
  const renderEditTreeNode = (node: TagTreeNode, level: number = 0, parentIds: { first?: number; second?: number } = {}): JSX.Element => {
    const isExpanded = editExpandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isThirdLevel = level === 2;

    return (
      <div key={node.id} className="select-none">
        <div
          className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded"
          style={{ paddingLeft: `${level * 20 + 8}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => toggleEditNodeExpand(node.id)}
              className="p-0 h-5 w-5 flex items-center justify-center"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? '' : '-rotate-90'
                }`}
              />
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <div className="flex-1">
            <div className="font-medium text-sm">{node.name}</div>
          </div>
          {isThirdLevel && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() =>
                handleSelectTagInEdit(
                  parentIds.first || 0,
                  parentIds.second || 0,
                  node.id
                )
              }
            >
              选择
            </Button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) =>
              renderEditTreeNode(child, level + 1, {
                first: level === 0 ? node.id : parentIds.first,
                second: level === 1 ? node.id : parentIds.second,
              })
            )}
          </div>
        )}
      </div>
    );
  };

  // 渲染新增对话框中的标签树节点
  const renderCreateTreeNode = (
    node: TagTreeNode,
    level: number = 0,
    parentIds: { first?: number; second?: number } = {}
  ): JSX.Element => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = createExpandedNodes.has(`create-${node.id}`);
    const isThirdLevel = level === 2;

    return (
      <div key={node.id} className="space-y-1">
        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          {hasChildren && (
            <button
              onClick={() => {
                const newExpanded = new Set(createExpandedNodes);
                if (isExpanded) {
                  newExpanded.delete(`create-${node.id}`);
                } else {
                  newExpanded.add(`create-${node.id}`);
                }
                setCreateExpandedNodes(newExpanded);
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
              />
            </button>
          )}
          {!hasChildren && <div className="w-5" />}
          <div className="flex-1">
            <div className="font-medium text-sm">{node.name}</div>
          </div>
          {isThirdLevel && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() =>
                handleSelectTagInCreate(
                  parentIds.first || 0,
                  parentIds.second || 0,
                  node.id
                )
              }
            >
              选择
            </Button>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((child) =>
              renderCreateTreeNode(child, level + 1, {
                first: level === 0 ? node.id : parentIds.first,
                second: level === 1 ? node.id : parentIds.second,
              })
            )}
          </div>
        )}
      </div>
    );
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
            <Button variant="outline" size="sm" onClick={handleShowTagTree}>
              <Database className="h-4 w-4 mr-2" />
              查看知识点树
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出题库
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowBatchImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              批量导入
            </Button>
            <Button size="sm" onClick={handleOpenCreateDialog}>
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
                    <tr key={question.id}>
                      <td className="px-6 py-4 text-sm">{question.id}</td>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(question)}
                          >
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
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => {
                              if (question.status === 1) {
                                handleDisableQuestion(question);
                              } else {
                                handleEnableQuestion(question);
                              }
                            }}
                          >
                            {question.status === 1 ? (
                              <Lock className="h-3 w-3" />
                            ) : (
                              <Unlock className="h-3 w-3" />
                            )}
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
                  <span className="text-sm">{previewQuestion.id}</span>
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

              {/* 知识点标签 */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">知识点标签</h3>
                {loadingPreviewTags ? (
                  <div className="text-sm text-gray-500">加载中...</div>
                ) : previewQuestionTags && previewQuestionTags.tags && previewQuestionTags.tags.length > 0 ? (
                  <div className="space-y-2">
                    {previewQuestionTags.tags.map((tag: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {tag.firstLevelTagName}
                          </Badge>
                          <span className="text-gray-400">/</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {tag.secondLevelTagName}
                          </Badge>
                          <span className="text-gray-400">/</span>
                          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                            {tag.thirdLevelTagName}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">暂无标签</div>
                )}
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

      {/* 编辑题目对话框 */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑题目</DialogTitle>
          </DialogHeader>

          {editingQuestion && (
            <div className="space-y-6 pr-4">
              {/* 题目基本信息 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">题目基本信息</h3>

                {/* 题型 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">题型</label>
                  <select
                    value={editFormData.type || ''}
                    onChange={(e) => handleEditFormChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">请选择题型</option>
                    <option value="judge">判断题</option>
                    <option value="single">单选题</option>
                    <option value="multiple">多选题</option>
                    <option value="fill">填空题</option>
                    <option value="short">简答题</option>
                  </select>
                </div>

                {/* 难度 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">难度</label>
                  <select
                    value={editFormData.difficulty || ''}
                    onChange={(e) => handleEditFormChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">请选择难度</option>
                    <option value="easy">简单</option>
                    <option value="medium">中等</option>
                    <option value="hard">困难</option>
                  </select>
                </div>

                {/* 级别 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">级别</label>
                  <select
                    value={editFormData.level || ''}
                    onChange={(e) => handleEditFormChange('level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">请选择级别</option>
                    <option value="level1">一级</option>
                    <option value="level2">二级</option>
                    <option value="level3">三级</option>
                    <option value="level4">四级</option>
                  </select>
                </div>

                {/* 状态 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                  <select
                    value={editFormData.status || 0}
                    onChange={(e) => handleEditFormChange('status', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value={0}>禁用</option>
                    <option value={1}>启用</option>
                  </select>
                </div>
              </div>

              {/* 题目内容 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">题目内容</h3>

                {/* 题干 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">题干</label>
                  <textarea
                    value={editFormData.stem || ''}
                    onChange={(e) => handleEditFormChange('stem', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={4}
                    placeholder="请输入题目内容"
                  />
                </div>

                {/* 选项 - 仅对选择题显示 */}
                {(editFormData.type === 'single' || editFormData.type === 'multiple') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">选项</label>
                    <div className="space-y-2">
                      {parseOptionsToArray(editFormData.options).map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-8 font-medium text-gray-700">
                            {String.fromCharCode(65 + index)}.
                          </span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder={`请输入选项${String.fromCharCode(65 + index)}`}
                          />
                          {parseOptionsToArray(editFormData.options).length > 2 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => handleRemoveOption(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleAddOption}
                        className="w-full"
                      >
                        + 添加选项
                      </Button>
                    </div>
                  </div>
                )}

                {/* 答案 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editFormData.type === 'judge' ? '答案（T/F）' : '答案'}
                  </label>
                  {editFormData.type === 'judge' ? (
                    <div className="flex gap-2">
                      <Button
                        variant={editFormData.answer === 'T' ? 'default' : 'outline'}
                        onClick={() => handleEditFormChange('answer', 'T')}
                        className="flex-1"
                      >
                        T (正确)
                      </Button>
                      <Button
                        variant={editFormData.answer === 'F' ? 'default' : 'outline'}
                        onClick={() => handleEditFormChange('answer', 'F')}
                        className="flex-1"
                      >
                        F (错误)
                      </Button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={editFormData.answer || ''}
                      onChange={(e) => handleEditFormChange('answer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      placeholder="请输入答案"
                    />
                  )}
                </div>

                {/* 解析 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">解析</label>
                  <textarea
                    value={editFormData.analysis || ''}
                    onChange={(e) => handleEditFormChange('analysis', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    rows={3}
                    placeholder="请输入题目解析"
                  />
                </div>
              </div>

              {/* 知识点标签 */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">知识点标签</h3>

                {/* 已选择的标签 */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">已选择的标签</label>
                  {editingTags.length > 0 ? (
                    <div className="space-y-2">
                      {editingTags.map((tag, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                              {tag.firstLevelTagName || `一级(${tag.firstLevelTagId})`}
                            </Badge>
                            <span className="text-gray-400">/</span>
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              {tag.secondLevelTagName || `二级(${tag.secondLevelTagId})`}
                            </Badge>
                            <span className="text-gray-400">/</span>
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {tag.thirdLevelTagName || `三级(${tag.thirdLevelTagId})`}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-600"
                            onClick={() => handleRemoveTagInEdit(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">暂无标签</div>
                  )}
                </div>

                {/* 标签树选择 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择标签</label>
                  {loadingEditTagTree ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  ) : editTagTree.length > 0 ? (
                    <div className="border rounded-lg p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
                      {editTagTree.map((node) => renderEditTreeNode(node))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">暂无知识点数据</div>
                  )}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseEditDialog}>
                  取消
                </Button>
                <Button onClick={handleSaveEdit} disabled={savingEdit}>
                  {savingEdit ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 新增题目对话框 */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新增题目</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 pr-4">
            {/* 添加方式选择 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">添加方式</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="single"
                    checked={createAddMethod === 'single'}
                    onChange={(e) => setCreateAddMethod(e.target.value as 'single' | 'batch' | 'smart')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">单个添加</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="batch"
                    checked={createAddMethod === 'batch'}
                    onChange={(e) => setCreateAddMethod(e.target.value as 'single' | 'batch' | 'smart')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">批量导入</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="smart"
                    checked={createAddMethod === 'smart'}
                    onChange={(e) => setCreateAddMethod(e.target.value as 'single' | 'batch' | 'smart')}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">智能导入</span>
                </label>
              </div>
            </div>

            {/* 单个添加模式 */}
            {createAddMethod === 'single' && (
              <>
                {/* 题目基本信息 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">题目基本信息</h3>

                  {/* 题型 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">题型 *</label>
                    {loadingQuestionTypes ? (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <select
                        value={createFormData.type || ''}
                        onChange={(e) => handleCreateFormChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="">请选择题型</option>
                        {questionTypes.map((type: any) => (
                          <option key={type.id} value={type.id}>
                            {type.typeName}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {/* 难度 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">难度</label>
                    <select
                      value={createFormData.difficulty || ''}
                      onChange={(e) => handleCreateFormChange('difficulty', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">请选择难度</option>
                      <option value="easy">简单</option>
                      <option value="medium">中等</option>
                      <option value="hard">困难</option>
                    </select>
                  </div>

                  {/* 级别 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">级别</label>
                    <select
                      value={createFormData.level || ''}
                      onChange={(e) => handleCreateFormChange('level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="">请选择级别</option>
                      <option value="level1">一级</option>
                      <option value="level2">二级</option>
                      <option value="level3">三级</option>
                      <option value="level4">四级</option>
                    </select>
                  </div>

                  {/* 状态 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                    <select
                      value={createFormData.status || 1}
                      onChange={(e) => handleCreateFormChange('status', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value={1}>启用</option>
                      <option value={0}>禁用</option>
                    </select>
                  </div>
                </div>

                {/* 题目内容 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">题目内容</h3>

                  {/* 题干 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">题干 *</label>
                    <textarea
                      value={createFormData.stem || ''}
                      onChange={(e) => handleCreateFormChange('stem', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={4}
                      placeholder="请输入题目内容"
                    />
                  </div>

                  {/* 选项 - 仅对选择题显示 */}
                  {(createFormData.type === 'single' || createFormData.type === 'multiple') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">选项</label>
                      <div className="space-y-2">
                        {parseOptionsToArray(createFormData.options).map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="w-8 font-medium text-gray-700">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                              placeholder={`请输入选项${String.fromCharCode(65 + index)}`}
                            />
                            {parseOptionsToArray(createFormData.options).length > 2 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-600"
                                onClick={() => handleRemoveOption(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleAddOption}
                          className="w-full"
                        >
                          + 添加选项
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* 答案 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {createFormData.type === 'judge' ? '答案（T/F）*' : '答案 *'}
                    </label>
                    {createFormData.type === 'judge' ? (
                      <div className="flex gap-2">
                        <Button
                          variant={createFormData.answer === 'T' ? 'default' : 'outline'}
                          onClick={() => handleCreateFormChange('answer', 'T')}
                          className="flex-1"
                        >
                          T (正确)
                        </Button>
                        <Button
                          variant={createFormData.answer === 'F' ? 'default' : 'outline'}
                          onClick={() => handleCreateFormChange('answer', 'F')}
                          className="flex-1"
                        >
                          F (错误)
                        </Button>
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={createFormData.answer || ''}
                        onChange={(e) => handleCreateFormChange('answer', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="请输入答案"
                      />
                    )}
                  </div>

                  {/* 解析 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">解析</label>
                    <textarea
                      value={createFormData.analysis || ''}
                      onChange={(e) => handleCreateFormChange('analysis', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      rows={3}
                      placeholder="请输入题目解析"
                    />
                  </div>
                </div>

                {/* 知识点标签 */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">知识点标签</h3>

                  {/* 已选择的标签 */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">已选择的标签</label>
                    {creatingTags.length > 0 ? (
                      <div className="space-y-2">
                        {creatingTags.map((tag, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                {tag.firstLevelTagName || `一级(${tag.firstLevelTagId})`}
                              </Badge>
                              <span className="text-gray-400">/</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {tag.secondLevelTagName || `二级(${tag.secondLevelTagId})`}
                              </Badge>
                              <span className="text-gray-400">/</span>
                              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                {tag.thirdLevelTagName || `三级(${tag.thirdLevelTagId})`}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600"
                              onClick={() => handleRemoveTagInCreate(index)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">暂无标签</div>
                    )}
                  </div>

                  {/* 标签树选择 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">选择标签</label>
                    {loadingCreateTagTree ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    ) : createTagTree.length > 0 ? (
                      <div className="border rounded-lg p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
                        {createTagTree.map((node) => renderCreateTreeNode(node))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">暂无知识点数据</div>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={handleCloseCreateDialog}>
                    取消
                  </Button>
                  <Button onClick={handleSaveCreate} disabled={savingCreate}>
                    {savingCreate ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      '保存'
                    )}
                  </Button>
                </div>
              </>
            )}

            {/* 批量导入和智能导入提示 */}
            {(createAddMethod === 'batch' || createAddMethod === 'smart') && (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <p>该功能开发中，敬请期待...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 知识点树对话框 */}
      <Dialog open={showTagTree} onOpenChange={setShowTagTree}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>知识点标签树</DialogTitle>
          </DialogHeader>
          {loadingTagTree ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : tagTree.length > 0 ? (
            <div className="border rounded-lg p-4 bg-gray-50 max-h-[60vh] overflow-y-auto">
              {tagTree.map((node) => renderTreeNode(node))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              暂无知识点数据
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 批量导入对话框 */}
      <Dialog open={showBatchImportDialog} onOpenChange={setShowBatchImportDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>批量导入题目</DialogTitle>
          </DialogHeader>
          <QuestionBatchImport
            onImportSuccess={() => {
              setShowBatchImportDialog(false);
              fetchQuestions(1, pageSize);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionBankManagement;

