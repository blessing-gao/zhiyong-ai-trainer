// API 响应格式
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

// 教学材料对象
export interface Material {
  type: "document" | "ppt" | "video" | "assignment"; // 材料类型
  title: string;
  description?: string;
  minioPath?: string; // MinIO 存储路径
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 视频对象
export interface Video {
  id?: string;
  url?: string;
  duration?: number;
  resolution?: string;
  timeline?: VideoTimeline[];
}

export interface VideoTimeline {
  start: number;
  title: string;
  description?: string;
}

// 幻灯片对象
export interface Slide {
  fileId: string;
  fileName: string;
  url: string;
  uploadedAt?: string;
}

// 实验对象
export interface Lab {
  type: string;
  id: string;
  url?: string;
}

// 任务对象
export interface Task {
  sid: string;
  name: string;
  title: string;
  description?: string;
  status: "active" | "draft" | "archived";
  duration?: number;
  durationUnit?: string;
  materials?: Material[]; // 教学材料列表
  content?: string;
  lab?: Lab;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// 课时对象
export interface Lesson {
  sid: string;
  courseId: string;
  name: string;
  title: string;
  description?: string;
  agentApi?: string;
  status: "active" | "draft" | "archived";
  tasks?: Task[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// 课程对象
export interface Course {
  sid: string;
  name: string;
  title: string;
  description: string;
  coverUrl?: string;
  agentName?: string;
  status: "active" | "draft" | "archived";
  tags?: string[];
  lessons?: Lesson[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

// 课程列表响应
export interface CourseListResponse {
  courses: Course[];
  total: number;
}

// 课程详情响应
export interface CourseDetailResponse {
  course: Course;
}

// 课时列表响应
export interface LessonListResponse {
  lessons: Lesson[];
  total: number;
}

// 课时详情响应
export interface LessonDetailResponse {
  lesson: Lesson;
}

// 任务详情响应
export interface TaskDetailResponse {
  task: Task;
}

