import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, BookOpen, Target, Award, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import aiCourseHero from "@/assets/ai-course-hero.jpg";

export const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "课程中心",
      description: "系统性学习生成式人工智能基础知识和实际应用",
      path: "/courses"
    },
    {
      icon: Target,
      title: "训练中心", 
      description: "题目练习、模拟考试，全方位提升应试能力",
      path: "/training"
    },
    {
      icon: Award,
      title: "考试中心",
      description: "正式考试认证，获得权威人工智能训练师证书",
      path: "/login/exam"
    },
    {
      icon: Users,
      title: "个人中心",
      description: "管理个人信息，查看学习进度和考试成绩",
      path: "/profile"
    }
  ];

  const stats = [
    { label: "注册学员", value: "10,000+", icon: Users },
    { label: "课程时长", value: "50+小时", icon: BookOpen },
    { label: "通过率", value: "95%", icon: TrendingUp },
    { label: "证书颁发", value: "8,500+", icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-hover to-accent bg-clip-text text-transparent">
              开启AI未来之门
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              成为专业的人工智能训练师，掌握生成式AI核心技术
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="gradient-primary text-white hover:opacity-90 shadow-medium"
                onClick={() => navigate('/courses')}
              >
                <BookOpen className="mr-2 h-5 w-5" />
                开始学习
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/training')}
              >
                <Target className="mr-2 h-5 w-5" />
                模拟练习
              </Button>
            </div>
            
            {/* Hero Image */}
            <div className="relative max-w-4xl mx-auto">
              <img 
                src={aiCourseHero} 
                alt="AI训练课程" 
                className="w-full h-auto rounded-2xl shadow-strong"
              />
              <div className="absolute inset-0 gradient-hero opacity-20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center shadow-soft hover:shadow-medium transition-shadow">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              全方位AI训练体系
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              从基础理论到实战应用，系统化培养专业AI训练师
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-medium transition-all duration-300 cursor-pointer shadow-soft"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader className="text-center">
                  <div className="gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="gradient-hero text-white shadow-strong">
            <CardContent className="text-center py-16">
              <Brain className="h-16 w-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                立即开始您的AI训练师之旅
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                加入我们的专业培训体系，获得权威认证，成为AI时代的专业训练师
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="bg-white text-primary hover:bg-gray-100"
                onClick={() => navigate('/login/student')}
              >
                立即注册学习
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};