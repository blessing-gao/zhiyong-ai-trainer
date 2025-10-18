// API 基础配置
const API_BASE_URL = 'http://localhost:8081';

// 通用 API 请求函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
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
  // 统一分页查询题目（支持无条件或条件查询）
  listQuestions: async (
    page: number = 1,
    pageSize: number = 10,
    type?: string,
    difficulty?: string,
    level?: string,
    keyword?: string,
    status?: number,
    sortBy?: string,
    sortOrder?: string
  ) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (type) params.append('type', type);
    if (difficulty) params.append('difficulty', difficulty);
    if (level) params.append('level', level);
    if (keyword) params.append('keyword', keyword);
    if (status !== undefined) params.append('status', status.toString());
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

  // 删除题目
  deleteQuestion: async (questionId: number) => {
    return apiRequest(`/api/questions/${questionId}`, {
      method: 'DELETE',
    });
  },
};

// 题型相关 API
export const questionTypeApi = {
  // 获取所有题型
  getAllTypes: async () => {
    return apiRequest('/api/question-types');
  },
};

// 标签相关 API
export const tagApi = {
  // 获取一级标签
  getFirstLevelTags: async () => {
    return apiRequest('/api/tags/first-level');
  },

  // 获取二级标签
  getSecondLevelTags: async (firstLevelTagId: number) => {
    return apiRequest(`/api/tags/second-level?firstLevelTagId=${firstLevelTagId}`);
  },

  // 获取三级标签
  getThirdLevelTags: async (secondLevelTagId: number) => {
    return apiRequest(`/api/tags/third-level?secondLevelTagId=${secondLevelTagId}`);
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
};

