import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { getCourseBySid, getLessonsByCourseId } from "@/services/courseService";
import { Course, Lesson } from "@/types/course";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, Play, ArrowLeft } from "lucide-react";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { applyRoleTheme } = useTheme();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseLoading, setCourseLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [courseError, setCourseError] = useState<Error | null>(null);

  useEffect(() => {
    applyRoleTheme();
  }, [applyRoleTheme]);

  useEffect(() => {
    const handleNavChange = (e: CustomEvent) => {
      setIsVertical(e.detail === "vertical");
    };

    window.addEventListener("navPositionChange", handleNavChange as EventListener);
    return () => {
      window.removeEventListener("navPositionChange", handleNavChange as EventListener);
    };
  }, []);

  // 获取课程详情
  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      try {
        setCourseLoading(true);
        const data = await getCourseBySid(courseId);
        setCourse(data);
      } catch (err) {
        setCourseError(err as Error);
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // 获取课时列表
  useEffect(() => {
    if (!courseId) return;

    const fetchLessons = async () => {
      try {
        setLessonsLoading(true);
        const data = await getLessonsByCourseId(courseId);
        setLessons(data);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [courseId]);

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-xl text-red-500 mb-4">获取课程详情失败</p>
            <Button onClick={() => navigate("/courses")}>返回课程列表</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      <Header />

      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, rgba(103, 179, 255, 0.3) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-80 -right-100 w-[640px] h-[640px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%)'
        }}></div>
      </div>

      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* 返回按钮 */}
          <Button
            variant="ghost"
            onClick={() => navigate("/courses")}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回课程列表
          </Button>

          {/* 课程头部 */}
          <div className="mb-8">
            <div className="flex items-start gap-6">
              {/* 课程封面 */}
              <div className="w-64 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {course.coverUrl ? (
                  <img 
                    src={course.coverUrl} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen className="w-16 h-16 text-white/50" />
                )}
              </div>

              {/* 课程信息 */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-foreground mb-4">{course.title}</h1>
                <p className="text-muted-foreground mb-4">{course.description}</p>
                
                {/* 标签 */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* 课程统计 */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{lessons.length} 个课时</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 课时列表 */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">课程内容</h2>
            {lessonsLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : lessons.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">暂无课时内容</p>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson, index) => (
                  <Card 
                    key={lesson.sid}
                    className="hover:shadow-lg transition-shadow cursor-pointer bg-white/80 backdrop-blur-sm"
                    onClick={() => navigate(`/courses/${courseId}/lessons/${lesson.sid}`)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            {lesson.description && (
                              <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/courses/${courseId}/lessons/${lesson.sid}`);
                          }}
                        >
                          <Play className="w-4 h-4 mr-2" />
                          开始学习
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

