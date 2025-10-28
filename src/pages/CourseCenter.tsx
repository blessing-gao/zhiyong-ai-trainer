import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";
import { getAllCourses } from "@/services/courseService";
import CourseListing from "@/components/CourseListing";
import { Course } from "@/types/course";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const CourseCenter = () => {
  const { applyRoleTheme } = useTheme();
  const [isVertical, setIsVertical] = useState(() => {
    const saved = localStorage.getItem("navPosition");
    return saved === "vertical";
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Apply theme based on user role
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

  // 获取课程列表
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 搜索过滤
  useEffect(() => {
    if (!courses) {
      setFilteredCourses([]);
      return;
    }

    if (!searchQuery.trim()) {
      setFilteredCourses(courses);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = courses.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
    setFilteredCourses(filtered);
  }, [courses, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      <Header />

      {/* 蓝色渐变圆形背景元素 */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 -left-60 w-[768px] h-[768px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, rgba(103, 179, 255, 0.3) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-80 -right-100 w-[640px] h-[640px] rounded-full animate-float-slow" style={{
          background: 'radial-gradient(circle, rgba(74, 144, 226, 0.3) 0%, transparent 70%)'
        }}></div>
        <div className="absolute bottom-100 -right-60 w-[800px] h-[800px] rounded-full animate-float" style={{
          background: 'radial-gradient(circle, rgba(103, 179, 255, 0.2) 0%, transparent 70%)',
          animationDelay: '1s'
        }}></div>
      </div>

      <div className={`pt-20 p-6 transition-all duration-300 relative z-10 ${isVertical ? "ml-44" : ""}`}>
        <div className="max-w-7xl mx-auto">
          {/* 页面标题和搜索区域 */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-foreground">课程中心</h1>
            </div>
            <p className="text-muted-foreground mb-6">
              全面学习生成式AI的基础理论、核心技术和实际应用，为成为专业AI训练师奠定坚实基础。
            </p>

            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="搜索课程名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 bg-white/80 backdrop-blur-sm border-blue-200/50"
              />
            </div>
          </div>

          {/* 课程列表 */}
          <div>
            {filteredCourses.length > 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                找到 {filteredCourses.length} 个课程
              </p>
            )}
            <CourseListing
              courses={filteredCourses}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCenter;
