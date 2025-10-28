import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Course } from "@/types/course";
import { BookOpen, Users, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseListingProps {
  courses: Course[];
  isLoading?: boolean;
  error?: Error | null;
}

const CourseListing: React.FC<CourseListingProps> = ({ courses, isLoading, error }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-80 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">获取课程列表失败</p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-muted-foreground">暂无可用课程</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card 
          key={course.sid} 
          className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50/50 to-cyan-50/50 border-blue-200/30"
          onClick={() => navigate(`/courses/${course.sid}`)}
        >
          {/* 课程封面 */}
          <div className="h-40 bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center overflow-hidden">
            {course.coverUrl ? (
              <img 
                src={course.coverUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full">
                <BookOpen className="w-16 h-16 text-white/50" />
              </div>
            )}
          </div>

          {/* 课程信息 */}
          <CardHeader className="pb-3">
            <CardTitle className="text-lg line-clamp-2 text-foreground">
              {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
              {course.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* 标签 */}
            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {course.tags.slice(0, 3).map((tag, index) => (
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

            {/* 课程统计信息 */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{course.lessons?.length || 0} 个课时</span>
              </div>
            </div>

            {/* 开始学习按钮 */}
            <Button 
              className="w-full text-white border-0"
              style={{ 
                background: 'linear-gradient(135deg, #67B3FF 0%, #4A90E2 100%)'
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/courses/${course.sid}`);
              }}
            >
              查看课程
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseListing;

