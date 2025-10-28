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

// 获取所有课程
export const getAllCourses = async (): Promise<Course[]> => {
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

// 获取课程详情
export const getCourseBySid = async (sid: string): Promise<Course> => {
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

