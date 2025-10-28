import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCourseBySid, getLessonsByCourseId, getTaskBySid, getSubtaskTabsByTaskId, updateSubtaskTabProgress } from "@/services/courseService";
import { Course, Lesson, Task, SubtaskTab, TaskCategory } from "@/types/course";
import { renderSubtaskTab, getTabIcon, getTabTypeName } from "@/components/SubtaskTabRegistry";

const CourseLearning: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [subtaskTabs, setSubtaskTabs] = useState<SubtaskTab[]>([]);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(lessonId);
  const [loading, setLoading] = useState(true);

  // 从 URL 获取当前模式和 Tab
  const currentMode = (searchParams.get("mode") || "study") as TaskCategory;
  const currentTabId = searchParams.get("tab");

  // 获取当前 Tab
  const currentTab = subtaskTabs.find(t => t.id === currentTabId) || subtaskTabs[0];

  // 按分组过滤 Tab
  const studyTabs = subtaskTabs.filter(t => t.category === "study");
  const practiceTabs = subtaskTabs.filter(t => t.category === "practice");
  const visibleTabs = currentMode === "study" ? studyTabs : practiceTabs;

  // 初始化数据
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!courseId || !lessonId) return;

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

          // 恢复上次的模式和 Tab
          const savedMode = localStorage.getItem(`course-${courseId}-mode`) || "study";
          const savedTabId = localStorage.getItem(`course-${courseId}-task-${taskData.sid}-tab`);
          
          setSearchParams({
            mode: savedMode,
            tab: savedTabId || tabs[0]?.id || ""
          });
        }
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
        mode: currentMode,
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
      mode: currentMode,
      tab: tabId
    });
    localStorage.setItem(`course-${courseId}-task-${currentTask?.sid}-tab`, tabId);
  };

  // 处理模式切换
  const handleModeChange = (mode: TaskCategory) => {
    const tabs = mode === "study" ? studyTabs : practiceTabs;
    setSearchParams({
      mode,
      tab: tabs[0]?.id || ""
    });
    localStorage.setItem(`course-${courseId}-mode`, mode);
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
        {/* 左侧：课时和任务列表 */}
        <div className="w-80 border-r bg-gray-50 overflow-y-auto">
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
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-between"
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
                            : "hover:bg-gray-200"
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

        {/* 右侧：学习区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* 分组选择 */}
          <div className="border-b px-6 py-3 flex items-center gap-4 bg-gray-50">
            <span className="text-sm font-medium">学习模式：</span>
            <div className="flex gap-2">
              <Button
                variant={currentMode === "study" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange("study")}
              >
                学习类 ({studyTabs.length})
              </Button>
              <Button
                variant={currentMode === "practice" ? "default" : "outline"}
                size="sm"
                onClick={() => handleModeChange("practice")}
              >
                实践类 ({practiceTabs.length})
              </Button>
            </div>
          </div>

          {/* Tab 容器 */}
          {visibleTabs.length > 0 ? (
            <Tabs
              value={currentTab?.id || ""}
              onValueChange={handleTabChange}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {/* Tab 列表 */}
              <TabsList className="w-full justify-start rounded-none border-b bg-white px-6 py-0">
                {visibleTabs.map(tab => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    disabled={isTabLocked(tab)}
                    className="relative gap-2"
                    title={isTabLocked(tab) ? "需要先完成前置任务" : ""}
                  >
                    <span>{getTabIcon(tab.type)}</span>
                    <span>{getTabTypeName(tab.type)}</span>
                    {tab.completed && <CheckCircle className="w-3 h-3 text-green-600" />}
                    {isTabLocked(tab) && <Lock className="w-3 h-3 text-gray-400" />}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab 内容 */}
              {visibleTabs.map(tab => (
                <TabsContent
                  key={tab.id}
                  value={tab.id}
                  className="flex-1 overflow-hidden"
                >
                  {isTabLocked(tab) ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">需要先完成前置任务</p>
                      </div>
                    </div>
                  ) : (
                    renderSubtaskTab(tab, (progress) =>
                      handleTabProgress(tab.id, progress)
                    )
                  )}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-600">暂无{currentMode === "study" ? "学习" : "实践"}类任务</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;

