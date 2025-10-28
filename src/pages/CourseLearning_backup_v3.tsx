import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  FileText,
  Code,
  PlayCircle,
  FlaskConical
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import { getCourseBySid, getLessonsByCourseId, getLessonBySid } from "@/services/courseService";
import { Course, Lesson, Task } from "@/types/course";

const CourseLearning = () => {
  const { applyRoleTheme } = useTheme();
  const navigate = useNavigate();
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Apply theme
  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  // 加载课程信息
  useEffect(() => {
    if (!courseId) return;
    
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const courseData = await getCourseBySid(courseId);
        setCourse(courseData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // 加载课时列表
  useEffect(() => {
    if (!courseId) return;
    
    const fetchLessons = async () => {
      try {
        const lessonsData = await getLessonsByCourseId(courseId);
        setLessons(lessonsData);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      }
    };

    fetchLessons();
  }, [courseId]);

  // 加载当前课时详情
  useEffect(() => {
    if (!lessonId) {
      if (lessons.length > 0) {
        setCurrentLesson(lessons[0]);
        if (lessons[0].tasks && lessons[0].tasks.length > 0) {
          setCurrentTaskId(lessons[0].tasks[0].sid);
        }
      }
      return;
    }
    
    const fetchLesson = async () => {
      try {
        const lessonData = await getLessonBySid(lessonId);
        setCurrentLesson(lessonData);
        if (lessonData.tasks && lessonData.tasks.length > 0) {
          setCurrentTaskId(lessonData.tasks[0].sid);
        }
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
      }
    };

    fetchLesson();
  }, [lessonId, lessons]);

  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  const handleLessonClick = (lesson: Lesson) => {
    navigate(`/courses/${courseId}/lessons/${lesson.sid}`);
  };

  const handleTaskClick = (taskId: string) => {
    setCurrentTaskId(taskId);
  };

  const getTaskIcon = (type?: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "notebook":
        return <Code className="h-4 w-4" />;
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "lab":
        return <FlaskConical className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const currentTask = currentLesson?.tasks?.find(t => t.sid === currentTaskId);

  // 获取任务的 Tab 配置
  const getTaskTabs = (task: Task) => {
    const tabs = [];
    
    // 文档内容 Tab
    if (task.content || task.type === "document") {
      tabs.push({ value: "document", label: "文档", icon: <FileText className="h-4 w-4 mr-2" /> });
    }
    
    // 实验 Tab
    if (task.lab || task.type === "lab") {
      tabs.push({ value: "lab", label: "实验", icon: <FlaskConical className="h-4 w-4 mr-2" /> });
    }
    
    // Notebook Tab
    if (task.notebookUrl || task.type === "notebook") {
      tabs.push({ value: "notebook", label: "Notebook", icon: <Code className="h-4 w-4 mr-2" /> });
    }
    
    return tabs;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载课程中...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="max-w-md bg-white rounded-lg p-6">
          <p className="text-destructive mb-4">加载课程失败</p>
          <Button onClick={() => navigate('/courses')}>返回课程列表</Button>
        </div>
      </div>
    );
  }

  const taskTabs = currentTask ? getTaskTabs(currentTask) : [];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToCourse}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回课程详情
          </Button>
          <div className="h-6 w-px bg-gray-300"></div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
            <p className="text-sm text-gray-500">{currentLesson?.title || '选择课时'}</p>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：课时和任务列表 */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">课时列表</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {lessons.map((lesson, lessonIndex) => (
              <div key={lesson.sid} className="border-b border-gray-100">
                <div
                  className={`p-4 cursor-pointer transition-colors ${
                    lesson.sid === currentLesson?.sid
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleLessonClick(lesson)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      lesson.sid === currentLesson?.sid
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {lessonIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {lesson.title}
                      </div>
                      {lesson.description && (
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {lesson.description}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 任务列表 */}
                {lesson.sid === currentLesson?.sid && lesson.tasks && lesson.tasks.length > 0 && (
                  <div className="bg-gray-50 py-2">
                    {lesson.tasks.map((task, taskIndex) => (
                      <div
                        key={task.sid}
                        className={`px-4 py-2 mx-2 mb-1 rounded cursor-pointer transition-colors flex items-center gap-2 ${
                          task.sid === currentTaskId
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-white text-gray-700'
                        }`}
                        onClick={() => handleTaskClick(task.sid)}
                      >
                        <div className="flex-shrink-0 text-xs font-medium text-gray-500">
                          {taskIndex + 1}
                        </div>
                        {getTaskIcon(task.type)}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm truncate">{task.title}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.duration} {task.durationUnit || '分钟'}
                          </div>
                        </div>
                        {task.completed && (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：内容区域 */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {currentTask ? (
            <>
              {/* 任务标题 */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getTaskIcon(currentTask.type)}
                    <h2 className="text-xl font-semibold text-gray-900">{currentTask.title}</h2>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {currentTask.duration} {currentTask.durationUnit || '分钟'}
                  </div>
                </div>
                {currentTask.description && (
                  <p className="text-sm text-gray-600 mt-2">{currentTask.description}</p>
                )}
              </div>

              {/* Tab 内容 */}
              {taskTabs.length > 0 ? (
                <Tabs defaultValue={taskTabs[0].value} className="flex-1 flex flex-col">
                  <TabsList className="mx-6 mt-4 w-auto self-start">
                    {taskTabs.map(tab => (
                      <TabsTrigger key={tab.value} value={tab.value} className="flex items-center">
                        {tab.icon}
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {taskTabs.map(tab => (
                      <TabsContent key={tab.value} value={tab.value} className="mt-0">
                        {tab.value === "document" && currentTask.content && (
                          <div className="prose max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: currentTask.content }} />
                          </div>
                        )}
                        
                        {tab.value === "notebook" && (
                          <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h3 className="font-semibold text-blue-900 mb-2">Jupyter Notebook</h3>
                              <p className="text-sm text-blue-700 mb-4">
                                点击下方按钮在新窗口中打开 Jupyter Notebook 进行交互式学习
                              </p>
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                <Code className="mr-2 h-4 w-4" />
                                打开 Notebook
                              </Button>
                            </div>
                            {currentTask.content && (
                              <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: currentTask.content }} />
                              </div>
                            )}
                          </div>
                        )}
                        
                        {tab.value === "lab" && currentTask.lab && (
                          <div className="space-y-4">
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <h3 className="font-semibold text-purple-900 mb-2">实验环境</h3>
                              <p className="text-sm text-purple-700 mb-4">
                                {currentTask.lab.description || '点击下方按钮启动实验环境'}
                              </p>
                              <Button className="bg-purple-600 hover:bg-purple-700">
                                <FlaskConical className="mr-2 h-4 w-4" />
                                启动实验
                              </Button>
                            </div>
                            {currentTask.content && (
                              <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: currentTask.content }} />
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">暂无学习内容</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">请从左侧选择课时和任务</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;

