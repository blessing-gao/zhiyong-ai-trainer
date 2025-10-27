// API 基础配置
// 使用空字符串，让请求通过 Vite 代理转发到后端
const API_BASE_URL = '';

// 通用 API 请求函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  // 获取认证令牌
  const accessToken = localStorage.getItem('access_token');

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// 题库相关 API
export const questionApi = {
  // 统一分页查询题目（支持无条件或条件查询，支持按知识点标签查询）
  listQuestions: async (
    page: number = 1,
    pageSize: number = 10,
    type?: string,
    difficulty?: string,
    bankId?: number,
    keyword?: string,
    status?: number,
    sortBy?: string,
    sortOrder?: string,
    firstLevelTagId?: number,
    secondLevelTagId?: number,
    thirdLevelTagId?: number
  ) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (type) params.append('type', type);
    if (difficulty) params.append('difficulty', difficulty);
    if (bankId) params.append('bank_id', bankId.toString());
    if (keyword) params.append('keyword', keyword);
    if (status !== undefined) params.append('status', status.toString());
    if (firstLevelTagId) params.append('first_level_tag_id', firstLevelTagId.toString());
    if (secondLevelTagId) params.append('second_level_tag_id', secondLevelTagId.toString());
    if (thirdLevelTagId) params.append('third_level_tag_id', thirdLevelTagId.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortOrder) params.append('sortOrder', sortOrder);

    return apiRequest(`/api/questions?${params.toString()}`);
  },

  // 获取单个题目详情
  getQuestionDetail: async (questionId: number) => {
    return apiRequest(`/api/questions/${questionId}`);
  },

  // 创建题目
  createQuestion: async (data: any) => {
    return apiRequest('/api/questions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新题目
  updateQuestion: async (questionId: number, data: any) => {
    return apiRequest(`/api/questions/${questionId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 更新题目及其标签
  updateQuestionWithTags: async (data: any) => {
    return apiRequest('/api/questions/with-tags', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 禁用题目
  disableQuestion: async (questionId: number) => {
    return apiRequest(`/api/questions/${questionId}/disable`, {
      method: 'PATCH',
    });
  },

  // 启用题目
  enableQuestion: async (questionId: number) => {
    return apiRequest(`/api/questions/${questionId}/enable`, {
      method: 'PATCH',
    });
  },

  // 删除题目
  deleteQuestion: async (questionId: number) => {
    return apiRequest(`/api/questions/${questionId}`, {
      method: 'DELETE',
    });
  },

  // 批量导入题目
  batchImportQuestions: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const accessToken = localStorage.getItem('access_token');
    const url = `${API_BASE_URL}/api/questions/batch-import`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Batch import error:', error);
      throw error;
    }
  },

  // 获取训练中心统计数据（知识点个数和练习题个数）
  getTrainingCenterStats: async () => {
    return apiRequest('/api/questions/training-center/stats');
  },

  // 根据二级标签查询题目
  getQuestionsBySecondLevelTag: async (secondLevelTagId: number) => {
    return apiRequest(`/api/questions/by-second-level-tag/${secondLevelTagId}`);
  },
};

// 题型相关 API
export const questionTypeApi = {
  // 获取所有题型
  getAllTypes: async () => {
    return apiRequest('/api/question-types');
  },

  // 获取所有启用的题型
  getEnabledTypes: async () => {
    return apiRequest('/api/question-types/enabled');
  },

  // 获取单个题型详情
  getQuestionType: async (id: number) => {
    return apiRequest(`/api/question-types/${id}`);
  },
};

// 标签相关 API
export const tagApi = {
  // 获取一级标签
  getFirstLevelTags: async () => {
    return apiRequest('/api/tags/first-level');
  },

  // 根据一级标签ID获取二级标签
  getSecondLevelTags: async (firstLevelId: number) => {
    return apiRequest(`/api/tags/second-level/${firstLevelId}`);
  },

  // 获取三级标签
  getThirdLevelTags: async (secondLevelTagId: number) => {
    return apiRequest(`/api/tags/third-level/${secondLevelTagId}`);
  },

  // 获取完整的知识点标签树形结构
  getTagTree: async () => {
    return apiRequest('/api/tags/tree');
  },
};

// 试卷相关 API
export const paperApi = {
  // 分页查询试卷
  getPapersByPage: async (page: number = 1, size: number = 10) => {
    return apiRequest(`/api/papers?page=${page}&size=${size}`);
  },

  // 获取单个试卷详情
  getPaperDetail: async (paperId: number) => {
    return apiRequest(`/api/papers/${paperId}`);
  },

  // 获取试卷详情（别名）
  getPaper: async (paperId: number) => {
    return apiRequest(`/api/papers/${paperId}`);
  },

  // 获取试卷的题目列表（用于恢复答题进度）
  getPaperQuestions: async (paperId: number) => {
    return apiRequest(`/api/papers/${paperId}/questions`);
  },

  // 创建试卷
  createPaper: async (data: any) => {
    return apiRequest('/api/papers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新试卷
  updatePaper: async (paperId: number, data: any) => {
    return apiRequest(`/api/papers/${paperId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 删除试卷
  deletePaper: async (paperId: number) => {
    return apiRequest(`/api/papers/${paperId}`, {
      method: 'DELETE',
    });
  },

  // 发布试卷
  publishPaper: async (paperId: number) => {
    return apiRequest(`/api/papers/${paperId}/publish`, {
      method: 'PATCH',
    });
  },

  // 归档试卷
  archivePaper: async (paperId: number) => {
    return apiRequest(`/api/papers/${paperId}/archive`, {
      method: 'PATCH',
    });
  },

  // 更改试卷状态
  changePaperStatus: async (paperId: number, status: number) => {
    return apiRequest(`/api/papers/${paperId}/status?status=${status}`, {
      method: 'PATCH',
    });
  },

  // 获取题目详情
  getQuestionDetail: async (questionId: number) => {
    return apiRequest(`/api/questions/${questionId}`);
  },

  // 生成试卷并返回题目（用于试题训练）
  generatePaperForTraining: async (data: any) => {
    return apiRequest('/api/papers/generate-for-training', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 生成试题训练试卷并保存到数据库
  generateTrainingPaper: async (data: any) => {
    return apiRequest('/api/papers/generate-training-paper', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 生成试卷预览（不保存到数据库）
  generatePaperPreview: async (data: any) => {
    return apiRequest('/api/papers/preview', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 保存试卷（从预览中确认保存）
  savePaper: async (data: any) => {
    return apiRequest('/api/papers/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 灵活组卷 - 预览
  previewFlexiblePaper: async (data: any) => {
    return apiRequest('/api/papers/flexible/preview', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 灵活组卷 - 保存
  saveFlexiblePaper: async (data: any) => {
    return apiRequest('/api/papers/flexible/save', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 组卷规则相关 API
export const paperRuleApi = {
  // 分页查询规则
  getPaperRulesByPage: async (page: number = 1, size: number = 10, status?: number) => {
    const statusParam = status !== undefined ? `&status=${status}` : '';
    return apiRequest(`/api/paper-rules?page=${page}&size=${size}${statusParam}`);
  },

  // 获取所有启用的规则
  getEnabledRules: async () => {
    return apiRequest('/api/paper-rules/enabled');
  },

  // 获取单个规则详情
  getPaperRuleDetail: async (ruleId: number) => {
    return apiRequest(`/api/paper-rules/${ruleId}`);
  },

  // 创建规则
  createPaperRule: async (data: any) => {
    return apiRequest('/api/paper-rules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新规则
  updatePaperRule: async (ruleId: number, data: any) => {
    return apiRequest(`/api/paper-rules/${ruleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 删除规则
  deletePaperRule: async (ruleId: number) => {
    return apiRequest(`/api/paper-rules/${ruleId}`, {
      method: 'DELETE',
    });
  },

  // 启用规则
  enableRule: async (ruleId: number) => {
    return apiRequest(`/api/paper-rules/${ruleId}/enable`, {
      method: 'PATCH',
    });
  },

  // 禁用规则
  disableRule: async (ruleId: number) => {
    return apiRequest(`/api/paper-rules/${ruleId}/disable`, {
      method: 'PATCH',
    });
  },

  // 更改规则状态
  changeRuleStatus: async (ruleId: number, status: number) => {
    return apiRequest(`/api/paper-rules/${ruleId}/status?status=${status}`, {
      method: 'PATCH',
    });
  },
};

// 考试相关 API
export const examApi = {
  // 分页查询考试
  getExamsByPage: async (page: number = 1, size: number = 10) => {
    return apiRequest(`/api/exams?page=${page}&size=${size}`);
  },

  // 获取单个考试详情
  getExamDetail: async (examId: number) => {
    return apiRequest(`/api/exams/${examId}`);
  },

  // 创建考试
  createExam: async (data: any) => {
    return apiRequest('/api/exams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 更新考试
  updateExam: async (examId: number, data: any) => {
    return apiRequest(`/api/exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // 删除考试
  deleteExam: async (examId: number) => {
    return apiRequest(`/api/exams/${examId}`, {
      method: 'DELETE',
    });
  },

  // 根据试卷ID查询考试
  findByPaperId: async (paperId: number) => {
    return apiRequest(`/api/exams/paper/${paperId}`);
  },

  // 根据状态查询考试
  findByStatus: async (status: number) => {
    return apiRequest(`/api/exams/status/${status}`);
  },

  // 批量创建考试（包含考场和考生）
  batchCreateExam: async (data: any) => {
    return apiRequest('/api/exams/batch-create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 查询用户列表（用于选择考生）
  getUsers: async (page: number = 1, size: number = 100, username?: string, realName?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (username) params.append('username', username);
    if (realName) params.append('realName', realName);
    return apiRequest(`/api/exams/users?${params.toString()}`);
  },

  // 查询试卷列表（用于绑定试卷）
  getPapers: async (page: number = 1, size: number = 100) => {
    return apiRequest(`/api/exams/papers?page=${page}&size=${size}`);
  },

  // 获取考试预览信息
  getExamPreview: async (examId: number) => {
    return apiRequest(`/api/exams/${examId}/preview`);
  },

  // 导出考生信息为CSV
  exportParticipants: async (examId: number) => {
    return apiRequest(`/api/exams/${examId}/export-participants`);
  },

  // 提交考试答卷
  submitExamAnswers: async (data: any) => {
    return apiRequest('/api/exams/submit-answers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // 考生登录
  examLogin: async (data: any) => {
    return apiRequest('/api/exams/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
};

// 用户认证相关 API
export const authApi = {
  // 用户注册
  register: async (data: {
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    phone?: string;
    realName?: string;
  }) => {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 用户登录
  login: async (data: { username: string; password: string }) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 管理员登录
  adminLogin: async (data: { username: string; password: string }) => {
    return apiRequest('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// 用户管理相关 API
export const userApi = {
  // 分页查询用户
  pageUsers: async (data: {
    page?: number;
    pageSize?: number;
    username?: string;
    realName?: string;
    email?: string;
    phone?: string;
    status?: number;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return apiRequest('/api/auth/users/page', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 添加用户
  addUser: async (data: {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    realName?: string;
    userType: string;
    status?: number;
  }) => {
    return apiRequest('/api/auth/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 批量导入用户
  importUsers: async (data: {
    users: Array<{
      username: string;
      password: string;
      email?: string;
      phone?: string;
      realName?: string;
      userType?: string;
      status?: number;
    }>;
  }) => {
    return apiRequest('/api/auth/users/import', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 获取用户详情
  getUserDetail: async (userId: number) => {
    return apiRequest(`/api/auth/users/${userId}`);
  },

  // 禁用用户
  disableUser: async (userId: number) => {
    return apiRequest(`/api/auth/users/${userId}/disable`, {
      method: 'PATCH',
    });
  },

  // 启用用户
  enableUser: async (userId: number) => {
    return apiRequest(`/api/auth/users/${userId}/enable`, {
      method: 'PATCH',
    });
  },
};

// 题目标签映射相关 API
export const questionTagApi = {
  // 获取题目的完整标签信息（包括一级、二级、三级标签）
  getQuestionTagsWithDetails: async (questionId: number) => {
    return apiRequest(`/api/question-tag-mappings/question/${questionId}/details`);
  },

  // 查询题目的所有标签映射
  getQuestionTags: async (questionId: number) => {
    return apiRequest(`/api/question-tag-mappings/question/${questionId}`);
  },

  // 绑定题目与标签
  bindTagToQuestion: async (data: {
    questionId: number;
    firstLevelTagId: number;
    secondLevelTagId: number;
    thirdLevelTagId: number;
  }) => {
    return apiRequest('/api/question-tag-mappings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // 删除题目的标签映射
  deleteMapping: async (mappingId: number) => {
    return apiRequest(`/api/question-tag-mappings/${mappingId}`, {
      method: 'DELETE',
    });
  },

  // 删除题目的所有标签映射
  deleteByQuestionId: async (questionId: number) => {
    return apiRequest(`/api/question-tag-mappings/question/${questionId}`, {
      method: 'DELETE',
    });
  },
};

// 试题训练答题记录相关 API
export const examAnswerApi = {
  // 开始答题
  startAnswering: async (userId: number, paperId: number) => {
    return apiRequest('/api/exam-answer/start', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        paperId,
      }),
    });
  },

  // 保存答题进度
  saveAnswerProgress: async (userId: number, paperId: number, answers: Record<string, any>) => {
    return apiRequest('/api/exam-answer/save-progress', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        paperId,
        answers,
      }),
    });
  },

  // 提交答题
  submitAnswers: async (userId: number, paperId: number) => {
    return apiRequest('/api/exam-answer/submit', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        paperId,
      }),
    });
  },

  // 放弃答题
  abandonAnswering: async (userId: number) => {
    return apiRequest(`/api/exam-answer/abandon?userId=${userId}`, {
      method: 'POST',
    });
  },

  // 获取答题记录
  getAnswerRecord: async (userId: number, paperId: number) => {
    return apiRequest(`/api/exam-answer/record?userId=${userId}&paperId=${paperId}`);
  },

  // 获取用户进行中的答题记录
  getInProgressAnswers: async (userId: number) => {
    return apiRequest(`/api/exam-answer/in-progress?userId=${userId}`);
  },

  // 获取用户已提交的答题记录
  getSubmittedAnswers: async (userId: number) => {
    return apiRequest(`/api/exam-answer/submitted?userId=${userId}`);
  },
};

// 正式考试答题记录相关 API
export const formalExamAnswerApi = {
  // 开始正式考试
  startFormalExam: async (userId: number, examId: number, paperId: number) => {
    return apiRequest('/api/formal-exam-answer/start', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        examId,
        paperId,
      }),
    });
  },

  // 保存正式考试答题进度
  saveFormalExamProgress: async (userId: number, examId: number, paperId: number, answers: Record<string, any>) => {
    return apiRequest('/api/formal-exam-answer/save-progress', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        examId,
        paperId,
        answers,
      }),
    });
  },

  // 提交正式考试
  submitFormalExam: async (userId: number, examId: number, paperId: number) => {
    return apiRequest('/api/formal-exam-answer/submit', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        examId,
        paperId,
      }),
    });
  },
};

// 题库相关 API
export const questionBankApi = {
  // 获取所有题库
  getAllBanks: async () => {
    return apiRequest('/api/question-banks');
  },

  // 获取所有启用的题库
  getEnabledBanks: async () => {
    return apiRequest('/api/question-banks/enabled');
  },

  // 获取单个题库详情
  getQuestionBank: async (id: number) => {
    return apiRequest(`/api/question-banks/${id}`);
  },
};

// 管理员相关 API
export const adminApi = {
  // 获取仪表盘统计数据
  getDashboardStats: async () => {
    return apiRequest('/api/admin/dashboard/stats');
  },
};
