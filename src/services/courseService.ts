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

// Mock 任务数据 - 支持子任务和多种类型
const mockTasks: { [lessonId: string]: Task[] } = {
  "lesson-001-01": [
    {
      sid: "task-001-01-01",
      name: "ai-overview",
      title: "人工智能概述",
      description: "了解人工智能的基础概念、核心技术和应用领域",
      status: "active",
      type: "document",
      duration: 12,
      durationUnit: "分钟",
      completed: true,
      content: `
        <h2>前言</h2>
        <p>2022年11月30日，美国旧金山的人工智能研究公司OpenAI公司通过其官方宣布："实验性ChatGPT吧，这是我们训练的模型，它以对话方式进行交互。对话格式使ChatGPT能够回答后续问题，承认错误，挑战不正确的前提，并拒绝不适当的请求。"</p>
        <p>ChatGPT这款通过Web界面与用户互动的聊天机器人，先是在美国引发了广泛关注，随后迅速在全球范围内掀起了一股AI热潮...</p>
        <h3>ChatGPT的本质</h3>
        <p>它是一种基于深度学习的大语言模型（Large Language Model，LLM），可预测一个最有可能接续的文本内容...</p>
      `,
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "task-001-01-02",
      name: "ml-basics",
      title: "机器学习基础",
      description: "学习机器学习的基本原理、算法类型和应用场景",
      status: "active",
      type: "document",
      duration: 15,
      durationUnit: "分钟",
      completed: true,
      content: `
        <h2>机器学习概述</h2>
        <p>机器学习是人工智能的核心技术之一，它使计算机能够从数据中学习并做出预测或决策...</p>
        <h3>监督学习</h3>
        <p>监督学习使用标记的训练数据来学习输入和输出之间的映射关系...</p>
        <h3>无监督学习</h3>
        <p>无监督学习从未标记的数据中发现隐藏的模式和结构...</p>
      `,
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "task-001-01-03",
      name: "dl-principles",
      title: "深度学习原理",
      description: "深入理解神经网络、反向传播等深度学习核心技术",
      status: "active",
      type: "document",
      duration: 18,
      durationUnit: "分钟",
      completed: false,
      content: `
        <h2>神经网络基础</h2>
        <p>神经网络是深度学习的基础，它模拟人脑神经元的工作方式...</p>
        <h3>激活函数</h3>
        <p>激活函数为神经网络引入非线性，常用的激活函数包括ReLU、Sigmoid、Tanh等...</p>
      `,
      created_at: "2025-01-15T10:00:00Z"
    }
  ],
  "lesson-001-02": [
    {
      sid: "task-001-02-01",
      name: "ml-concepts",
      title: "机器学习概念",
      description: "学习机器学习的基本原理和算法",
      status: "active",
      type: "document",
      duration: 15,
      durationUnit: "分钟",
      completed: true,
      content: `
        <h2>机器学习的三大类型</h2>
        <h3>1. 监督学习</h3>
        <p>使用标记数据进行训练，包括分类和回归任务...</p>
        <h3>2. 无监督学习</h3>
        <p>从未标记数据中发现模式，包括聚类和降维...</p>
        <h3>3. 强化学习</h3>
        <p>通过与环境交互学习最优策略...</p>
      `,
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "task-001-02-02",
      name: "feature-engineering",
      title: "特征工程",
      description: "学习如何提取和选择有效的特征",
      status: "active",
      type: "document",
      duration: 20,
      durationUnit: "分钟",
      completed: false,
      content: `
        <h2>特征工程的重要性</h2>
        <p>特征工程是机器学习中最重要的环节之一...</p>
        <h3>特征提取</h3>
        <p>从原始数据中提取有意义的特征...</p>
        <h3>特征选择</h3>
        <p>选择对模型最有帮助的特征...</p>
      `,
      created_at: "2025-01-15T10:00:00Z"
    }
  ],
  "lesson-001-03": [
    {
      sid: "task-001-03-01",
      name: "nn-basics",
      title: "神经网络基础",
      description: "深入理解神经网络和反向传播",
      status: "active",
      type: "document",
      duration: 18,
      durationUnit: "分钟",
      completed: false,
      content: `
        <h2>神经网络结构</h2>
        <p>神经网络由输入层、隐藏层和输出层组成...</p>
        <h3>前向传播</h3>
        <p>数据从输入层经过隐藏层传递到输出层...</p>
        <h3>反向传播</h3>
        <p>通过梯度下降算法更新网络权重...</p>
      `,
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "task-001-03-02",
      name: "cnn-rnn",
      title: "CNN与RNN",
      description: "学习卷积神经网络和循环神经网络",
      status: "active",
      type: "document",
      duration: 22,
      durationUnit: "分钟",
      completed: false,
      content: `
        <h2>卷积神经网络（CNN）</h2>
        <p>CNN特别适合处理图像数据...</p>
        <h3>卷积层</h3>
        <p>通过卷积核提取图像特征...</p>
        <h2>循环神经网络（RNN）</h2>
        <p>RNN适合处理序列数据...</p>
      `,
      created_at: "2025-01-15T10:00:00Z"
    }
  ],
  "lesson-001-04": [
    {
      sid: "task-001-04-01",
      name: "generative-ai-intro",
      title: "生成式AI技术简介",
      description: "了解生成式AI的基本概念和应用",
      status: "active",
      type: "document",
      duration: 12,
      durationUnit: "分钟",
      completed: false,
      content: `
        <h2>第一章 生成式人工智能简介</h2>
        <h3>前言</h3>
        <p>2022年11月30日，美国旧金山的人工智能研究公司OpenAI公司通过其官方宣布："实验性ChatGPT吧，这是我们训练的模型，它以对话方式进行交互。对话格式使ChatGPT能够回答后续问题，承认错误，挑战不正确的前提，并拒绝不适当的请求。"</p>
        <p>ChatGPT这款通过Web界面与用户互动的聊天机器人，先是在美国引发了广泛关注，随后迅速在全球范围内掀起了一股AI热潮...</p>
        <h3>ChatGPT的本质</h3>
        <p>它是一种基于深度学习的大语言模型（Large Language Model，LLM），可预测一个最有可能接续的文本内容...</p>
        <h3>目录</h3>
        <ul>
          <li>1.1 从图灵测试到ChatGPT</li>
          <li>1.2 从数据到智能</li>
          <li>1.3 通用人工智能的曙光</li>
        </ul>
      `,
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "task-001-04-02",
      name: "generative-ai-practice",
      title: "生成式AI实践 - 学习实践",
      description: "通过Jupyter Notebook学习生成式AI的实际应用",
      status: "active",
      type: "notebook",
      duration: 45,
      durationUnit: "分钟",
      completed: false,
      notebookUrl: "/notebooks/generative-ai-practice.ipynb",
      content: `
        <h2>第一章 生成式人工智能简介 - 学习实践</h2>
        <p>本Notebook是第一章《生成式人工智能简介》的配套学习资料。首先确保你的学习环境已安装以下Python库...</p>
        <h3>1. 导入必要的库</h3>
        <pre><code>import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer</code></pre>
        <h3>2. 核心概念回顾</h3>
        <h4>2.1 图灵测试与智能度量</h4>
        <p>图灵测试是评估机器智能的经典方法...</p>

      `,
      materials: [
        {
          type: "document",
          title: "Jupyter Notebook 使用指南",
          description: "学习如何使用 Jupyter Notebook 进行交互式编程",
          minioPath: "/docs/jupyter-guide.pdf"
        }
      ],
      created_at: "2025-01-15T10:00:00Z"
    },
    {
      sid: "task-001-04-03",
      name: "generative-ai-lab",
      title: "生成式AI实验",
      description: "在实验环境中体验生成式AI的能力",
      status: "active",
      type: "lab",
      duration: 30,
      durationUnit: "分钟",
      completed: false,
      lab: {
        type: "interactive",
        id: "lab-generative-ai-001",
        url: "/labs/generative-ai",
        description: "交互式实验环境，可以直接与生成式AI模型对话"
      },
      content: `
        <h2>实验目标</h2>
        <p>通过本实验，你将：</p>
        <ul>
          <li>体验生成式AI的文本生成能力</li>
          <li>了解提示词（Prompt）的重要性</li>
          <li>学习如何优化AI输出质量</li>
        </ul>
        <h3>实验步骤</h3>
        <ol>
          <li>点击"启动实验"按钮</li>
          <li>在对话框中输入你的问题</li>
          <li>观察AI的回答并尝试优化提示词</li>
        </ol>
      `,
      created_at: "2025-01-15T10:00:00Z"
    }
  ],
  "lesson-001-05": [
    {
      sid: "task-001-05-01",
      name: "case-study",
      title: "案例分析：AI在各行业的应用",
      description: "通过真实案例了解AI的实际应用",
      status: "active",
      duration: 40,
      durationUnit: "分钟",
      materials: [
        {
          type: "video",
          title: "AI应用案例集锦",
          description: "医疗、金融、教育、制造等行业的AI应用",
          minioPath: "/videos/ai-cases.mp4"
        },
        {
          type: "document",
          title: "AI应用白皮书",
          description: "详细的行业应用分析报告",
          minioPath: "/docs/ai-applications.pdf"
        }
      ],
      content: `
        <h2>AI实际应用案例</h2>

        <h3>医疗健康</h3>
        <ul>
          <li>医学影像诊断：使用深度学习识别病变</li>
          <li>药物研发：AI加速新药发现</li>
          <li>个性化治疗：基于患者数据的精准医疗</li>
        </ul>

        <h3>金融服务</h3>
        <ul>
          <li>风险评估：智能信用评分</li>
          <li>欺诈检测：实时交易监控</li>
          <li>智能投顾：个性化投资建议</li>
        </ul>

        <h3>教育培训</h3>
        <ul>
          <li>个性化学习：自适应学习系统</li>
          <li>智能辅导：AI助教和答疑</li>
          <li>自动评分：作业和考试自动批改</li>
        </ul>
      `,
      created_at: "2025-01-15T10:00:00Z"
    }
  ],
  "lesson-002-01": [
    {
      sid: "task-002-01-01",
      name: "video-lecture",
      title: "视频讲解：提示词基础",
      description: "学习提示词的基本结构和编写原则",
      status: "active",
      duration: 30,
      durationUnit: "分钟",
      materials: [
        {
          type: "video",
          title: "提示词入门",
          description: "如何编写有效的提示词",
          minioPath: "/videos/prompt-basics.mp4"
        }
      ],
      content: `
        <h2>提示词基础</h2>
        <p>提示词（Prompt）是与AI模型交互的关键，好的提示词能够获得更准确、更有用的回答。</p>

        <h3>提示词的基本结构</h3>
        <ul>
          <li><strong>角色设定</strong>：告诉AI扮演什么角色</li>
          <li><strong>任务描述</strong>：清晰说明要完成的任务</li>
          <li><strong>上下文信息</strong>：提供必要的背景信息</li>
          <li><strong>输出格式</strong>：指定期望的输出格式</li>
        </ul>

        <h3>编写原则</h3>
        <ol>
          <li>清晰明确：避免模糊和歧义</li>
          <li>具体详细：提供足够的细节</li>
          <li>结构化：使用列表、编号等组织信息</li>
          <li>迭代优化：根据结果不断改进</li>
        </ol>
      `,
      created_at: "2025-02-01T10:00:00Z"
    }
  ],
  "lesson-002-02": [
    {
      sid: "task-002-02-01",
      name: "video-lecture",
      title: "视频讲解：高级提示技巧",
      description: "掌握Few-shot、Chain-of-Thought等高级技巧",
      status: "active",
      duration: 40,
      durationUnit: "分钟",
      materials: [
        {
          type: "video",
          title: "高级提示工程",
          description: "Few-shot Learning、CoT、Self-Consistency等技巧",
          minioPath: "/videos/advanced-prompts.mp4"
        }
      ],
      content: `
        <h2>高级提示技巧</h2>

        <h3>Few-shot Learning</h3>
        <p>通过提供几个示例，让AI理解任务模式。</p>
        <pre>
示例1：输入 -> 输出
示例2：输入 -> 输出
示例3：输入 -> 输出
现在处理：新输入 -> ?
        </pre>

        <h3>Chain-of-Thought (CoT)</h3>
        <p>引导AI展示推理过程，提高复杂问题的准确性。</p>
        <p>关键短语："让我们一步步思考"、"请详细说明推理过程"</p>

        <h3>Self-Consistency</h3>
        <p>让AI生成多个答案，然后选择最一致的结果。</p>
      `,
      created_at: "2025-02-01T10:00:00Z"
    }
  ],
  "lesson-003-01": [
    {
      sid: "task-003-01-01",
      name: "video-lecture",
      title: "视频讲解：数据标注方法",
      description: "学习各类数据标注的方法和质量标准",
      status: "active",
      duration: 35,
      durationUnit: "分钟",
      materials: [
        {
          type: "video",
          title: "数据标注入门",
          description: "文本、图像、音频等数据的标注方法",
          minioPath: "/videos/data-annotation.mp4"
        }
      ],
      content: `
        <h2>数据标注基础</h2>
        <p>数据标注是AI训练师的核心工作之一，高质量的标注数据是训练优秀AI模型的基础。</p>

        <h3>标注类型</h3>
        <ul>
          <li><strong>文本标注</strong>：情感分析、实体识别、文本分类</li>
          <li><strong>图像标注</strong>：目标检测、图像分割、关键点标注</li>
          <li><strong>音频标注</strong>：语音识别、说话人识别、情感识别</li>
        </ul>

        <h3>质量标准</h3>
        <ol>
          <li>准确性：标注结果符合实际</li>
          <li>一致性：相同情况使用相同标准</li>
          <li>完整性：不遗漏需要标注的内容</li>
          <li>规范性：遵循标注指南</li>
        </ol>
      `,
      created_at: "2025-03-01T10:00:00Z"
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

