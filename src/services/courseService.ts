import {
  Course,
  Lesson,
  Task,
  ApiResponse,
  CourseListResponse,
  CourseDetailResponse,
  LessonListResponse,
  LessonDetailResponse,
  TaskDetailResponse
} from "@/types/course";

const API_BASE_URL = "/api/v1";
const USE_MOCK_DATA = true; // 设置为 true 使用 mock 数据

// Mock 数据
const mockCourses: Course[] = [
  {
    sid: "course-001",
    name: "ai-basics",
    title: "生成式人工智能基础与应用",
    description: "全面学习生成式AI的基础理论、核心技术和实际应用，掌握大语言模型、图像生成、提示工程等核心技能，为成为专业AI训练师奠定坚实基础。",
    coverUrl: "",
    agentName: "AI助教",
    status: "active",
    tags: ["人工智能", "生成式AI", "大语言模型", "初级"],
    lessons: [],
    created_at: "2025-01-15T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  },
  {
    sid: "course-002",
    name: "prompt-engineering",
    title: "提示工程实战",
    description: "深入学习提示工程的核心技巧，掌握如何设计高质量的提示词，优化AI模型输出，提升工作效率。包含大量实战案例和最佳实践。",
    coverUrl: "",
    agentName: "提示工程师",
    status: "active",
    tags: ["提示工程", "ChatGPT", "实战", "中级"],
    lessons: [],
    created_at: "2025-02-01T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  },
  {
    sid: "course-003",
    name: "ai-trainer",
    title: "AI训练师认证课程",
    description: "系统学习AI训练师的核心技能，包括数据标注、模型评估、质量控制等，获得专业认证，开启AI训练师职业生涯。",
    coverUrl: "",
    agentName: "资深训练师",
    status: "active",
    tags: ["AI训练师", "认证课程", "数据标注", "高级"],
    lessons: [],
    created_at: "2025-03-01T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  },
  {
    sid: "course-004",
    name: "nlp-basics",
    title: "自然语言处理入门",
    description: "学习自然语言处理的基础知识，包括分词、词性标注、命名实体识别、情感分析等核心技术，为深入学习NLP打下基础。",
    coverUrl: "",
    agentName: "NLP专家",
    status: "active",
    tags: ["NLP", "自然语言处理", "文本分析", "初级"],
    lessons: [],
    created_at: "2025-03-15T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  },
  {
    sid: "course-005",
    name: "computer-vision",
    title: "计算机视觉基础",
    description: "掌握计算机视觉的核心概念和技术，包括图像处理、目标检测、图像分类、图像生成等，了解CV在实际场景中的应用。",
    coverUrl: "",
    agentName: "CV工程师",
    status: "active",
    tags: ["计算机视觉", "图像处理", "深度学习", "中级"],
    lessons: [],
    created_at: "2025-04-01T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  },
  {
    sid: "course-006",
    name: "llm-application",
    title: "大语言模型应用开发",
    description: "学习如何使用大语言模型API进行应用开发，包括对话系统、文本生成、智能问答等实战项目，掌握LLM应用开发的完整流程。",
    coverUrl: "",
    agentName: "LLM开发者",
    status: "active",
    tags: ["大语言模型", "API开发", "应用开发", "高级"],
    lessons: [],
    created_at: "2025-05-01T10:00:00Z",
    updated_at: "2025-10-28T10:00:00Z"
  }
];

// 获取所有课程
export const getAllCourses = async (): Promise<Course[]> => {
  if (USE_MOCK_DATA) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockCourses;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }
    const data: ApiResponse<Course[]> = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg || "Failed to fetch courses");
    }
    return data.data || [];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Mock 课时数据
const mockLessons: { [courseId: string]: Lesson[] } = {
  "course-001": [
    {
      sid: "lesson-001-01",
      courseId: "course-001",
      name: "ai-overview",
      title: "人工智能概述",
      description: "了解人工智能的发展历程、核心概念和应用领域",
      status: "active",
      tasks: [],
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "lesson-001-02",
      courseId: "course-001",
      name: "ml-basics",
      title: "机器学习基础",
      description: "学习机器学习的基本原理、算法和应用场景",
      status: "active",
      tasks: [],
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "lesson-001-03",
      courseId: "course-001",
      name: "deep-learning",
      title: "深度学习原理",
      description: "深入理解神经网络、反向传播等深度学习核心技术",
      status: "active",
      tasks: [],
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "lesson-001-04",
      courseId: "course-001",
      name: "generative-ai",
      title: "生成式AI技术",
      description: "学习GPT、DALL-E等生成式AI模型的原理和应用",
      status: "active",
      tasks: [],
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "lesson-001-05",
      courseId: "course-001",
      name: "practical-cases",
      title: "实际应用案例",
      description: "通过真实案例学习AI在各行业的应用",
      status: "active",
      tasks: [],
      created_at: "2025-01-15T10:00:00Z"
    }
  ],
  "course-002": [
    {
      sid: "lesson-002-01",
      courseId: "course-002",
      name: "prompt-basics",
      title: "提示词基础",
      description: "学习提示词的基本结构和编写原则",
      status: "active",
      tasks: [],
      created_at: "2025-02-01T10:00:00Z"
    },
    {
      sid: "lesson-002-02",
      courseId: "course-002",
      name: "advanced-techniques",
      title: "高级技巧",
      description: "掌握Few-shot、Chain-of-Thought等高级提示技巧",
      status: "active",
      tasks: [],
      created_at: "2025-02-01T10:00:00Z"
    },
    {
      sid: "lesson-002-03",
      courseId: "course-002",
      name: "practical-projects",
      title: "实战项目",
      description: "通过实际项目练习提示工程技能",
      status: "active",
      tasks: [],
      created_at: "2025-02-01T10:00:00Z"
    }
  ],
  "course-003": [
    {
      sid: "lesson-003-01",
      courseId: "course-003",
      name: "data-annotation",
      title: "数据标注",
      description: "学习各类数据标注的方法和质量标准",
      status: "active",
      tasks: [],
      created_at: "2025-03-01T10:00:00Z"
    },
    {
      sid: "lesson-003-02",
      courseId: "course-003",
      name: "model-evaluation",
      title: "模型评估",
      description: "掌握AI模型评估的指标和方法",
      status: "active",
      tasks: [],
      created_at: "2025-03-01T10:00:00Z"
    },
    {
      sid: "lesson-003-03",
      courseId: "course-003",
      name: "quality-control",
      title: "质量控制",
      description: "学习训练数据的质量控制流程",
      status: "active",
      tasks: [],
      created_at: "2025-03-01T10:00:00Z"
    },
    {
      sid: "lesson-003-04",
      courseId: "course-003",
      name: "certification-exam",
      title: "认证考试",
      description: "完成认证考试，获得AI训练师证书",
      status: "active",
      tasks: [],
      created_at: "2025-03-01T10:00:00Z"
    }
  ],
  "course-004": [
    {
      sid: "lesson-004-01",
      courseId: "course-004",
      name: "nlp-intro",
      title: "NLP入门",
      description: "了解自然语言处理的基本概念和应用",
      status: "active",
      tasks: [],
      created_at: "2025-03-15T10:00:00Z"
    },
    {
      sid: "lesson-004-02",
      courseId: "course-004",
      name: "text-processing",
      title: "文本处理",
      description: "学习分词、词性标注等文本处理技术",
      status: "active",
      tasks: [],
      created_at: "2025-03-15T10:00:00Z"
    },
    {
      sid: "lesson-004-03",
      courseId: "course-004",
      name: "sentiment-analysis",
      title: "情感分析",
      description: "掌握情感分析的方法和应用",
      status: "active",
      tasks: [],
      created_at: "2025-03-15T10:00:00Z"
    }
  ],
  "course-005": [
    {
      sid: "lesson-005-01",
      courseId: "course-005",
      name: "cv-basics",
      title: "计算机视觉基础",
      description: "学习图像处理的基本原理",
      status: "active",
      tasks: [],
      created_at: "2025-04-01T10:00:00Z"
    },
    {
      sid: "lesson-005-02",
      courseId: "course-005",
      name: "object-detection",
      title: "目标检测",
      description: "掌握目标检测的算法和应用",
      status: "active",
      tasks: [],
      created_at: "2025-04-01T10:00:00Z"
    },
    {
      sid: "lesson-005-03",
      courseId: "course-005",
      name: "image-generation",
      title: "图像生成",
      description: "学习图像生成技术和应用",
      status: "active",
      tasks: [],
      created_at: "2025-04-01T10:00:00Z"
    }
  ],
  "course-006": [
    {
      sid: "lesson-006-01",
      courseId: "course-006",
      name: "llm-api",
      title: "LLM API使用",
      description: "学习如何调用大语言模型API",
      status: "active",
      tasks: [],
      created_at: "2025-05-01T10:00:00Z"
    },
    {
      sid: "lesson-006-02",
      courseId: "course-006",
      name: "chatbot-dev",
      title: "对话系统开发",
      description: "开发智能对话系统",
      status: "active",
      tasks: [],
      created_at: "2025-05-01T10:00:00Z"
    },
    {
      sid: "lesson-006-03",
      courseId: "course-006",
      name: "rag-application",
      title: "RAG应用开发",
      description: "学习检索增强生成技术",
      status: "active",
      tasks: [],
      created_at: "2025-05-01T10:00:00Z"
    }
  ]
};

// Mock 任务数据
const mockTasks: { [lessonId: string]: Task[] } = {
  "lesson-001-01": [
    {
      sid: "task-001-01-01",
      name: "video-lecture",
      title: "视频讲解：AI发展史",
      description: "观看AI发展历程的视频讲解",
      status: "active",
      duration: 30,
      durationUnit: "分钟",
      materials: [
        {
          type: "video",
          title: "AI发展史",
          description: "从图灵测试到ChatGPT的AI发展历程",
          minioPath: "/videos/ai-history.mp4"
        }
      ],
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "task-001-01-02",
      name: "reading-material",
      title: "阅读材料：AI核心概念",
      description: "阅读AI核心概念的文档",
      status: "active",
      duration: 20,
      durationUnit: "分钟",
      materials: [
        {
          type: "document",
          title: "AI核心概念",
          description: "机器学习、深度学习、神经网络等核心概念",
          minioPath: "/docs/ai-concepts.pdf"
        }
      ],
      created_at: "2025-01-15T10:00:00Z"
    }
  ]
};

// 获取课程详情
export const getCourseBySid = async (sid: string): Promise<Course> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const course = mockCourses.find(c => c.sid === sid);
    if (!course) {
      throw new Error("Course not found");
    }
    // 添加课时信息
    const lessons = mockLessons[sid] || [];
    return { ...course, lessons };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/courses/${sid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch course: ${response.statusText}`);
    }
    const data: ApiResponse<Course> = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg || "Failed to fetch course");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
};

// 获取课时列表
export const getLessonsByCourseId = async (courseId: string): Promise<Lesson[]> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLessons[courseId] || [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lessons?courseId=${courseId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lessons: ${response.statusText}`);
    }
    const data: ApiResponse<Lesson[]> = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg || "Failed to fetch lessons");
    }
    return data.data || [];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

// 获取课时详情
export const getLessonBySid = async (sid: string): Promise<Lesson> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // 在所有课程的课时中查找
    for (const lessons of Object.values(mockLessons)) {
      const lesson = lessons.find(l => l.sid === sid);
      if (lesson) {
        // 添加任务信息
        const tasks = mockTasks[sid] || [];
        return { ...lesson, tasks };
      }
    }
    throw new Error("Lesson not found");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${sid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lesson: ${response.statusText}`);
    }
    const data: ApiResponse<Lesson> = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg || "Failed to fetch lesson");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching lesson:", error);
    throw error;
  }
};

// 获取任务详情
export const getTaskBySid = async (sid: string): Promise<Task> => {
  if (USE_MOCK_DATA) {
    await new Promise(resolve => setTimeout(resolve, 300));
    // 在所有课时的任务中查找
    for (const tasks of Object.values(mockTasks)) {
      const task = tasks.find(t => t.sid === sid);
      if (task) {
        return task;
      }
    }
    throw new Error("Task not found");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${sid}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch task: ${response.statusText}`);
    }
    const data: ApiResponse<Task> = await response.json();
    if (data.code !== 0) {
      throw new Error(data.msg || "Failed to fetch task");
    }

    // 处理 materials 字段 - 如果是 JSON 字符串，则解析为对象
    const task = data.data;
    if (task.materials && typeof task.materials === 'string') {
      try {
        task.materials = JSON.parse(task.materials as any);
      } catch (e) {
        // 如果解析失败，保持原样
        console.warn("Failed to parse materials JSON:", e);
      }
    }

    return task;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

