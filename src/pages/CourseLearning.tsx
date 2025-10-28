import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  PlayCircle,
  FileText,
  Code
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
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Apply theme based on user role
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
      // 如果没有指定课时，使用第一个课时
      if (lessons.length > 0) {
        setCurrentLesson(lessons[0]);
      }
      return;
    }
    
    const fetchLesson = async () => {
      try {
        const lessonData = await getLessonBySid(lessonId);
        setCurrentLesson(lessonData);
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

  const handleNextTask = () => {
    if (currentLesson?.tasks && currentTaskIndex < currentLesson.tasks.length - 1) {
      setCurrentTaskIndex(currentTaskIndex + 1);
    }
  };

  const handlePrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(currentTaskIndex - 1);
    }
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
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">加载课程失败</p>
            <Button onClick={() => navigate('/courses')}>返回课程列表</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentTask = currentLesson?.tasks?.[currentTaskIndex];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* 半透明白色容器 */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* 顶部导航 */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                onClick={handleBackToCourse}
                className="text-foreground hover:bg-white/20"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回课程详情
              </Button>
              <div className="text-right">
                <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
                <p className="text-muted-foreground">{currentLesson?.title || '选择课时'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 左侧：课时列表 */}
              <div className="lg:col-span-1">
                <Card className="bg-white border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-foreground text-base font-medium">
                      课时列表
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                    {lessons.map((lesson, index) => (
                      <div 
                        key={lesson.sid}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          lesson.sid === currentLesson?.sid
                            ? 'bg-blue-50 border-2 border-blue-300' 
                            : 'hover:bg-gray-50 border border-transparent'
                        }`}
                        onClick={() => handleLessonClick(lesson)}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                            lesson.sid === currentLesson?.sid
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-foreground truncate">
                              {lesson.title}
                            </div>
                            {lesson.description && (
                              <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {lesson.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* 右侧：学习内容 */}
              <div className="lg:col-span-3">
                <Card className="bg-white border-0">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      {currentLesson?.title || '请选择课时'}
                    </CardTitle>
                    {currentLesson?.description && (
                      <p className="text-muted-foreground text-sm mt-2">
                        {currentLesson.description}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {currentLesson?.tasks && currentLesson.tasks.length > 0 ? (
                      <Tabs defaultValue="content" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="content">学习内容</TabsTrigger>
                          <TabsTrigger value="materials">学习资料</TabsTrigger>
                          <TabsTrigger value="lab">实验环境</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="content" className="mt-6">
                          {currentTask ? (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">{currentTask.title}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {currentTask.duration} {currentTask.durationUnit || '分钟'}
                                </div>
                              </div>
                              
                              {currentTask.description && (
                                <p className="text-muted-foreground">{currentTask.description}</p>
                              )}

                              {currentTask.content && (
                                <div className="prose max-w-none">
                                  <div dangerouslySetInnerHTML={{ __html: currentTask.content }} />
                                </div>
                              )}

                              {/* 任务导航 */}
                              <div className="flex items-center justify-between pt-6 border-t">
                                <Button
                                  variant="outline"
                                  onClick={handlePrevTask}
                                  disabled={currentTaskIndex === 0}
                                >
                                  上一个任务
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                  任务 {currentTaskIndex + 1} / {currentLesson.tasks.length}
                                </span>
                                <Button
                                  onClick={handleNextTask}
                                  disabled={currentTaskIndex === currentLesson.tasks.length - 1}
                                >
                                  下一个任务
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">暂无学习内容</p>
                          )}
                        </TabsContent>

                        <TabsContent value="materials" className="mt-6">
                          {currentTask?.materials && currentTask.materials.length > 0 ? (
                            <div className="space-y-3">
                              {currentTask.materials.map((material, index) => (
                                <Card key={index} className="border">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                      {material.type === 'video' && <PlayCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />}
                                      {material.type === 'document' && <FileText className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />}
                                      {material.type === 'code' && <Code className="h-5 w-5 text-purple-500 flex-shrink-0 mt-1" />}
                                      <div className="flex-1">
                                        <h4 className="font-medium">{material.title}</h4>
                                        {material.description && (
                                          <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">暂无学习资料</p>
                          )}
                        </TabsContent>

                        <TabsContent value="lab" className="mt-6">
                          {currentTask?.lab ? (
                            <div className="space-y-4">
                              <Card className="border-blue-200 bg-blue-50">
                                <CardContent className="p-4">
                                  <h4 className="font-medium mb-2">实验环境</h4>
                                  <p className="text-sm text-muted-foreground mb-4">
                                    {currentTask.lab.description || '点击下方按钮启动实验环境'}
                                  </p>
                                  <Button className="w-full">
                                    启动实验环境
                                  </Button>
                                </CardContent>
                              </Card>
                            </div>
                          ) : (
                            <p className="text-muted-foreground">本课时暂无实验环境</p>
                          )}
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">本课时暂无学习任务</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;

