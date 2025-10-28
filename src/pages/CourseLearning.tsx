import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, CheckCircle, Lock, BookOpen, Code, Zap, FileText, Video, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourseBySid, getLessonsByCourseId, getTaskBySid, getSubtaskTabsByTaskId, updateSubtaskTabProgress } from "@/services/courseService";
import { Course, Lesson, Task, SubtaskTab, TaskCategory } from "@/types/course";
import { renderSubtaskTab, getTabIcon, getTabTypeName } from "@/components/SubtaskTabRegistry";

const CourseLearning: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [subtaskTabs, setSubtaskTabs] = useState<SubtaskTab[]>([]);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(lessonId);
  const [loading, setLoading] = useState(true);
  const [courseProgress, setCourseProgress] = useState<{ [courseId: string]: number }>({});

  const currentTabId = searchParams.get("tab");
  const currentTab = subtaskTabs.find(t => t.id === currentTabId) || subtaskTabs[0];

  // 初始化数据
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!courseId || !lessonId) return;

        // 加载所有课程（用于课程切换）
        const coursesData = await Promise.all([
          getCourseBySid("course-001"),
          getCourseBySid("course-002"),
          getCourseBySid("course-003"),
        ]).catch(() => []);
        setAllCourses(coursesData.filter(Boolean));

        const courseData = await getCourseBySid(courseId);
        setCourse(courseData);

        const lessonsData = await getLessonsByCourseId(courseId);
        setLessons(lessonsData);

        // 获取当前课时的第一个任务
        const currentLesson = lessonsData.find(l => l.sid === lessonId);
        if (currentLesson?.tasks?.[0]) {
          const taskData = await getTaskBySid(currentLesson.tasks[0].sid);
          setCurrentTask(taskData);

          // 获取子任务 Tab
          const tabs = await getSubtaskTabsByTaskId(taskData.sid);
          setSubtaskTabs(tabs);

          // 恢复上次的 Tab
          const savedTabId = localStorage.getItem(`course-${courseId}-task-${taskData.sid}-tab`);
          setSearchParams({
            tab: savedTabId || tabs[0]?.id || ""
          });
        }

        // 计算课程进度
        const progress = Math.floor(Math.random() * 100);
        setCourseProgress(prev => ({ ...prev, [courseId]: progress }));
      } catch (error) {
        console.error("Error loading course data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [courseId, lessonId, setSearchParams]);

  // 处理任务切换
  const handleTaskClick = async (task: Task) => {
    try {
      const taskData = await getTaskBySid(task.sid);
      setCurrentTask(taskData);

      const tabs = await getSubtaskTabsByTaskId(taskData.sid);
      setSubtaskTabs(tabs);

      // 重置为第一个 Tab
      setSearchParams({
        tab: tabs[0]?.id || ""
      });

      // 保存当前任务
      localStorage.setItem(`course-${courseId}-current-task`, task.sid);
    } catch (error) {
      console.error("Error loading task:", error);
    }
  };

  // 处理 Tab 切换
  const handleTabChange = (tabId: string) => {
    setSearchParams({
      tab: tabId
    });
    localStorage.setItem(`course-${courseId}-task-${currentTask?.sid}-tab`, tabId);
  };

  // 处理课程切换
  const handleCourseSwitch = (newCourseId: string) => {
    const newCourse = allCourses.find(c => c.sid === newCourseId);
    if (newCourse && newCourse.lessons?.[0]) {
      navigate(`/courses/${newCourseId}/lessons/${newCourse.lessons[0].sid}`);
    }
  };

  // 处理进度更新
  const handleTabProgress = async (tabId: string, progress: number) => {
    if (!currentTask) return;
    try {
      await updateSubtaskTabProgress(currentTask.sid, tabId, progress, progress >= 100);
      // 更新本地状态
      setSubtaskTabs(tabs =>
        tabs.map(t =>
          t.id === tabId ? { ...t, progress, completed: progress >= 100 } : t
        )
      );
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // 检查前置依赖
  const isTabLocked = (tab: SubtaskTab) => {
    if (!tab.prerequisites || tab.prerequisites.length === 0) return false;
    return tab.prerequisites.some(
      prereqId => !subtaskTabs.find(t => t.id === prereqId)?.completed
    );
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 顶部导航栏 */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/courses/${courseId}`)}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            返回课程
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{course?.title}</h1>
            <p className="text-sm text-gray-600">{currentTask?.title}</p>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧：课程导航 */}
        <div className="w-72 border-r bg-white overflow-y-auto">
          {/* 课程切换 */}
          <div className="p-4 border-b">
            <h3 className="text-sm font-semibold mb-3">课程列表</h3>
            <div className="space-y-2">
              {allCourses.map(c => (
                <button
                  key={c.sid}
                  onClick={() => handleCourseSwitch(c.sid)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    c.sid === courseId
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{c.description}</div>
                  {/* 进度条 */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all"
                        style={{ width: `${courseProgress[c.sid] || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{courseProgress[c.sid] || 0}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 课时和任务列表 */}
          <div className="p-4 space-y-2">
            {lessons.map(lesson => (
              <div key={lesson.sid}>
                {/* 课时标题 */}
                <button
                  onClick={() =>
                    setExpandedLessonId(
                      expandedLessonId === lesson.sid ? null : lesson.sid
                    )
                  }
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-sm">{lesson.title}</div>
                    <div className="text-xs text-gray-600">{lesson.description}</div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      expandedLessonId === lesson.sid ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* 任务列表 */}
                {expandedLessonId === lesson.sid && lesson.tasks && (
                  <div className="ml-4 space-y-1">
                    {lesson.tasks.map(task => (
                      <button
                        key={task.sid}
                        onClick={() => handleTaskClick(task)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          currentTask?.sid === task.sid
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {task.completed ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-400" />
                          )}
                          <span>{task.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：子任务类型展示 */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* 标题 */}
          <div className="border-b px-6 py-4 bg-white">
            <h2 className="text-lg font-semibold">{currentTask?.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{currentTask?.description}</p>
          </div>

          {/* 子任务类型网格 */}
          <div className="flex-1 overflow-y-auto p-6">
            {subtaskTabs.length > 0 ? (
              <div className="space-y-6">
                {/* 学习类 */}
                {subtaskTabs.some(t => t.category === "study") && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      学习资源
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {subtaskTabs
                        .filter(t => t.category === "study")
                        .map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            disabled={isTabLocked(tab)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isTabLocked(tab)
                                ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                                : currentTab?.id === tab.id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-blue-300"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">{getTabTypeName(tab.type)}</div>
                                <div className="text-xs text-gray-600 mt-1">{tab.title}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                {tab.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {isTabLocked(tab) && <Lock className="w-4 h-4 text-gray-400" />}
                              </div>
                            </div>
                            {tab.progress !== undefined && (
                              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-600 transition-all"
                                  style={{ width: `${tab.progress}%` }}
                                />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* 实训类 */}
                {subtaskTabs.some(t => t.category === "practice" && t.type?.includes("lab")) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-4 h-4 text-orange-600" />
                      实训环境
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {subtaskTabs
                        .filter(t => t.category === "practice" && t.type?.includes("lab"))
                        .map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            disabled={isTabLocked(tab)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isTabLocked(tab)
                                ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                                : currentTab?.id === tab.id
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200 bg-white hover:border-orange-300"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">{getTabTypeName(tab.type)}</div>
                                <div className="text-xs text-gray-600 mt-1">{tab.title}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                {tab.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {isTabLocked(tab) && <Lock className="w-4 h-4 text-gray-400" />}
                              </div>
                            </div>
                            {tab.progress !== undefined && (
                              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-orange-600 transition-all"
                                  style={{ width: `${tab.progress}%` }}
                                />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                )}

                {/* 测试类 */}
                {subtaskTabs.some(t => t.category === "practice" && t.type?.includes("quiz")) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-600" />
                      测试评估
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {subtaskTabs
                        .filter(t => t.category === "practice" && t.type?.includes("quiz"))
                        .map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => handleTabChange(tab.id)}
                            disabled={isTabLocked(tab)}
                            className={`p-4 rounded-lg border-2 transition-all text-left ${
                              isTabLocked(tab)
                                ? "border-gray-200 bg-gray-100 opacity-50 cursor-not-allowed"
                                : currentTab?.id === tab.id
                                ? "border-purple-500 bg-purple-50"
                                : "border-gray-200 bg-white hover:border-purple-300"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-sm text-gray-900">{getTabTypeName(tab.type)}</div>
                                <div className="text-xs text-gray-600 mt-1">{tab.title}</div>
                              </div>
                              <div className="flex items-center gap-1">
                                {tab.completed && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {isTabLocked(tab) && <Lock className="w-4 h-4 text-gray-400" />}
                              </div>
                            </div>
                            {tab.progress !== undefined && (
                              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-purple-600 transition-all"
                                  style={{ width: `${tab.progress}%` }}
                                />
                              </div>
                            )}
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-600">暂无子任务</p>
              </div>
            )}
          </div>

          {/* 底部：内容展示区 */}
          {currentTab && (
            <div className="border-t bg-white flex-1 overflow-hidden">
              {isTabLocked(currentTab) ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">需要先完成前置任务</p>
                  </div>
                </div>
              ) : (
                renderSubtaskTab(currentTab, (progress) =>
                  handleTabProgress(currentTab.id, progress)
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;

